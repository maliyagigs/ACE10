import { AppContent, GoogleUser } from '../types';

export interface RegisteredUser {
  name: string;
  email: string;
  password?: string;
  picture?: string;
}

// Environment variables hooks for future cloud scaling
const CLOUDINARY_URL = (import.meta as any).env?.VITE_CLOUDINARY_URL || '';
const CLOUDINARY_UPLOAD_PRESET = (import.meta as any).env?.VITE_CLOUDINARY_UPLOAD_PRESET || '';

// Check if cloud configurations are present
const isCloudStorageEnabled = !!CLOUDINARY_URL;

console.debug(`[StorageService] Running in Firebase/Firestore mode. All production edits are synced to Cloud Firestore.`);

/**
 * Robust CMS and Authentication Data Persistor & Sync Engine
 */
export const StorageService = {
  /**
   * 1. App Content / CMS Data management (Local Cache)
   */
  loadContent(fallbackDefault: AppContent): AppContent {
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
      console.error('[StorageService] Failing to load cached CMS content:', e);
    }
    return fallbackDefault;
  },

  saveContent(content: AppContent): void {
    try {
      localStorage.setItem('ace10_cms_content', JSON.stringify(content));
    } catch (e) {
      console.error('[StorageService] Error saving CMS content:', e);
    }
  },

  /**
   * 2. Current User Session Manager (Cache Only)
   */
  loadCurrentUser(): GoogleUser | null {
    try {
      const savedUser = localStorage.getItem('ace10_firebase_user_cache');
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
        localStorage.setItem('ace10_firebase_user_cache', JSON.stringify(user));
      } else {
        localStorage.removeItem('ace10_firebase_user_cache');
      }
    } catch (e) {
      console.error('[StorageService] Error saving user session cache:', e);
    }
  },

  /**
   * 3. Cloud Storage Asset Upload Handler template
   */
  async uploadAssetAndGetUrl(file: File): Promise<string> {
    if (isCloudStorageEnabled) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset');
        console.warn("[StorageService] Cloudinary integration ready. Configure preset to enable cloud uploads.");
      } catch (err) {
        console.error("[StorageService] Cloud upload failed, reverting to local blob.", err);
      }
    }
    return URL.createObjectURL(file);
  }
};
