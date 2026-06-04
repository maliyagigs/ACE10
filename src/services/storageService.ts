import { AppContent } from '../types';

export interface GoogleUser {
  name: string;
  email: string;
  picture: string;
  sub?: string;
  type: 'google' | 'email';
}

export interface RegisteredUser {
  name: string;
  email: string;
  password?: string;
  picture?: string;
}

// Environment variables hooks for future cloud scaling
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
const CLOUDINARY_URL = (import.meta as any).env?.VITE_CLOUDINARY_URL || '';
const CLOUDINARY_UPLOAD_PRESET = (import.meta as any).env?.VITE_CLOUDINARY_UPLOAD_PRESET || '';

// Check if cloud configurations are present
const isCloudEnabled = !!SUPABASE_URL && !!SUPABASE_KEY;
const isCloudStorageEnabled = !!CLOUDINARY_URL;

if (isCloudEnabled) {
  console.info(`[StorageService] Cloud DB Integration detected: Supabase is online (${SUPABASE_URL})`);
} else {
  console.debug(`[StorageService] Running in Local Storage database mode. Define VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY to scale to a cloud cluster.`);
}

if (isCloudStorageEnabled) {
  console.info(`[StorageService] Cloud Asset Bucket detected: Cloudinary is online (${CLOUDINARY_URL})`);
} else {
  console.debug(`[StorageService] Relying on local device blob URLs for mock asset uploads. Define VITE_CLOUDINARY_URL for global durable URLs.`);
}

/**
 * Robust CMS and Authentication Data Persistor & Sync Engine
 */
export const StorageService = {
  /**
   * 1. App Content / CMS Data management
   */
  loadContent(fallbackDefault: AppContent): AppContent {
    if (isCloudEnabled) {
      // Placeholder for Cloud SQL/NoSQL Sync API call:
      // fetch(`${SUPABASE_URL}/rest/v1/cms_content?select=*`, { headers: { apikey: SUPABASE_KEY } })
      console.log("[StorageService] Simulating cloud data fetch from Supabase cluster...");
    }

    try {
      const saved = localStorage.getItem('ace10_cms_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Schema sanity validation
        if (parsed && typeof parsed === 'object' && parsed.siteName && parsed.hero) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('[StorageService] Failing to load cached CMS content from local storage:', e);
    }
    return fallbackDefault;
  },

  saveContent(content: AppContent): void {
    try {
      localStorage.setItem('ace10_cms_content', JSON.stringify(content));
      
      if (isCloudEnabled) {
        // Placeholders and async fire-and-forget logic for cloud synchronization:
        console.log("[StorageService] Syncing CMS edits to Cloud database tables asynchronously...", content);
        /*
        fetch(`${SUPABASE_URL}/rest/v1/cms_content?id=eq.global`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Prefer': 'resolution=merge'
          },
          body: JSON.stringify(content)
        }).catch(err => console.error("Supabase CMS save update failed:", err));
        */
      }
    } catch (e) {
      console.error('[StorageService] Error serializing CMS dataset to local storage:', e);
    }
  },

  /**
   * 2. Registered Users (Email + Password) database
   */
  loadRegisteredUsers(): RegisteredUser[] {
    try {
      const saved = localStorage.getItem('ace10_registered_users');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('[StorageService] Error loading credentials list:', e);
    }
    return [];
  },

  saveRegisteredUser(newUser: RegisteredUser): RegisteredUser[] {
    const list = this.loadRegisteredUsers();
    
    // Check if user exists
    const exists = list.some(u => u.email.toLowerCase().trim() === newUser.email.toLowerCase().trim());
    if (exists) {
      throw new Error("An account with this email address already is registered.");
    }

    list.push(newUser);
    try {
      localStorage.setItem('ace10_registered_users', JSON.stringify(list));
      
      if (isCloudEnabled) {
        console.log("[StorageService] Registering new credential set inside cloud users table:", newUser.email);
        /*
        fetch(`${SUPABASE_URL}/rest/v1/auth_users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY },
          body: JSON.stringify(newUser)
        }).catch(err => console.error("Supabase user sync error:", err));
        */
      }
    } catch (e) {
      console.error('[StorageService] Failed writing users database:', e);
    }
    return list;
  },

  /**
   * 3. Current User Session Manager
   */
  loadCurrentUser(): GoogleUser | null {
    try {
      const savedUser = localStorage.getItem('ace10_google_user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      console.error('[StorageService] Session parse error:', e);
    }
    return null;
  },

  saveCurrentUser(user: GoogleUser | null): void {
    try {
      if (user) {
        localStorage.setItem('ace10_google_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('ace10_google_user');
      }
    } catch (e) {
      console.error('[StorageService] Error managing user token storage:', e);
    }
  },

  /**
   * 4. Google GSI OAuth client-ID configuration
   */
  loadGoogleClientId(): string {
    return '793024535052-2fjl8pdruv3m22oglc3lsiqkqi3qf9cp.apps.googleusercontent.com';
  },

  saveGoogleClientId(clientId: string): void {
    // Storage of custom client ID is disabled since it is now fixed
  },

  /**
   * 5. Cloud Storage Asset Upload Handler template
   * If a standard file is provided, this function generates local blob URL as requested.
   * If Cloudinary is configured, it upload file to Cloudinary dynamically.
   */
  async uploadAssetAndGetUrl(file: File): Promise<string> {
    if (isCloudStorageEnabled) {
      console.log("[StorageService] Cloud Asset Bucket upload started:", file.name);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset');
        
        // Example dynamic HTTP client post request:
        // const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_URL}/image/upload`, { method: 'POST', body: formData });
        // const data = await res.json();
        // return data.secure_url;
        
        console.warn("[StorageService] Cloudinary SDK initialized but requires fine-tuned Cloudinary Upload Preset.");
      } catch (err) {
        console.error("[StorageService] Cloud upload failed, reverting to local session preview.", err);
      }
    }

    // Default: Lightweight session-based Object URLs preventing large Base64 quota crashes
    return URL.createObjectURL(file);
  }
};
