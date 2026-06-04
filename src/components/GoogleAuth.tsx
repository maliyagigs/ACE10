import React, { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import { StorageService } from '../services/storageService';

export interface GoogleUser {
  name: string;
  email: string;
  picture: string;
  sub?: string; // unique google ID
  type: 'google' | 'email';
}

interface GoogleAuthProps {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  user: GoogleUser | null;
  setUser: (user: GoogleUser | null) => void;
}

// Simple client-side JWT decoder for Google Identity tokens
function decodeJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("JWT decoding failed:", error);
    return null;
  }
}

export default function GoogleAuth({ theme, modalOpen, setModalOpen, user, setUser }: GoogleAuthProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  
  // Email Password States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Feedback states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const clientId = "793024535052-2fjl8pdruv3m22oglc3lsiqkqi3qf9cp.apps.googleusercontent.com";
  const [gsiLoaded, setGsiLoaded] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const btnContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dynamically load Google GSI client library script
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (document.getElementById('google-gsi-client')) {
      setGsiLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-client';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGsiLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed loading Google Identity Services client script.");
    };
    document.head.appendChild(script);
  }, []);

  // Initialize and Render button when GSI & Client ID are ready inside the Modal
  useEffect(() => {
    if (!gsiLoaded || !clientId || user || !modalOpen) return;

    // Use a small timeout to let the modal mount the DOM element cleanly
    const timer = setTimeout(() => {
      try {
        const handleCredentialResponse = (response: any) => {
          const decoded = decodeJwt(response.credential);
          if (decoded) {
            const transformedUser: GoogleUser = {
              name: decoded.name || 'Google User',
              email: decoded.email || '',
              picture: decoded.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
              sub: decoded.sub,
              type: 'google'
            };
            setUser(transformedUser);
            StorageService.saveCurrentUser(transformedUser);
            setModalOpen(false);
            setSuccessMsg(null);
            setErrorMsg(null);
          }
        };

        // @ts-ignore
        const google = window.google;
        if (google && google.accounts && google.accounts.id) {
          google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          const btnElement = document.getElementById('google-gsi-button-container');
          if (btnElement) {
            google.accounts.id.renderButton(
              btnElement,
              { 
                theme: 'filled_black', 
                size: 'large', 
                shape: 'pill',
                width: 250,
                text: 'signin_with'
              }
            );
          }
        }
      } catch (err) {
        console.error("Error setting up Google Auth script buttons:", err);
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [gsiLoaded, clientId, user, modalOpen, activeTab]);

  const handleSignOut = () => {
    setUser(null);
    StorageService.saveCurrentUser(null);
    setDropdownOpen(false);
    
    // @ts-ignore
    const google = window.google;
    if (google && google.accounts && google.accounts.id && user) {
      try {
        google.accounts.id.disableAutoSelect();
      } catch (err) {
        console.warn(err);
      }
    }
  };

  // Fully functioning Email Sign-In
  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    // Load registered users from StorageService
    const registeredUsers = StorageService.loadRegisteredUsers();

    // Search user
    const foundUser = registeredUsers.find(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (!foundUser) {
      setErrorMsg("No account found with this email. Please check your credentials or Sign Up!");
      return;
    }

    if (foundUser.password !== password) {
      setErrorMsg("Incorrect password. Please try again.");
      return;
    }

    // Success Authentication
    const loggedInUser: GoogleUser = {
      name: foundUser.name,
      email: foundUser.email,
      picture: foundUser.picture || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop`,
      type: 'email'
    };

    setSuccessMsg("Success! Welcome back, signing you in...");
    setTimeout(() => {
      setUser(loggedInUser);
      StorageService.saveCurrentUser(loggedInUser);
      setModalOpen(false);
      // reset form
      setEmail('');
      setPassword('');
      setSuccessMsg(null);
    }, 1000);
  };

  // Fully functioning Email Sign-Up (Registration)
  const handleEmailSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validations
    if (!name.trim()) {
      setErrorMsg("Full Name is required.");
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    // Load registered users array
    const registeredUsers = StorageService.loadRegisteredUsers();

    // Check if duplicate email
    const duplicate = registeredUsers.some(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (duplicate) {
      setErrorMsg("An account with this email address already exists. Please choose a different email or select Sign In.");
      return;
    }

    // Create avatar placeholder with a nice human image based on initials or general seed
    const avatarSeed = Math.floor(Math.random() * 100);
    const pictures = [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
    ];
    const chosenPicture = pictures[avatarSeed % pictures.length];

    // Push new credentials
    const newUser = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      picture: chosenPicture
    };

    try {
      StorageService.saveRegisteredUser(newUser);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed creating credentials.");
      return;
    }

    // Sign them in instantly
    const loggedInUser: GoogleUser = {
      name: newUser.name,
      email: newUser.email,
      picture: newUser.picture,
      type: 'email'
    };

    setSuccessMsg("Account created! Access granted, wrapping up setup...");
    setTimeout(() => {
      setUser(loggedInUser);
      StorageService.saveCurrentUser(loggedInUser);
      setModalOpen(false);
      // reset forms
      setName('');
      setEmail('');
      setPassword('');
      setSuccessMsg(null);
    }, 1200);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative inline-block text-left">
      {/* User profile menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center justify-center p-0.5 rounded-full border border-slate-800 bg-slate-900/60 hover:bg-slate-950 transition-all cursor-pointer hover:scale-105"
        >
          <img
            src={user.picture}
            alt={user.name}
            className="w-10 h-10 rounded-full border-2 border-blue-500/60 object-cover"
            referrerPolicy="no-referrer"
          />
        </button>

        {/* User profile dropdown box */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2.5 w-67 bg-slate-950/95 border border-slate-900 rounded-2xl shadow-xl backdrop-blur-xl z-[60] p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-900">
              <img
                src={user.picture}
                alt={user.name}
                className="w-10 h-10 rounded-full border border-blue-500/50 object-cover min-w-[40px]"
                referrerPolicy="no-referrer"
              />
              <div className="truncate">
                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-1">
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 rounded-lg bg-red-950/50 border border-red-900/30 text-red-400 hover:bg-red-900/40 text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Icons.LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Unified Auth Form, Register & Google GSI Overlay Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-[100] transition-opacity animate-fade-in overflow-y-auto">
          <div 
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative flex flex-col gap-6 overflow-hidden my-8"
          >
            {/* Ambient background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header / Dismiss */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                  <Icons.ShieldAlert className="w-4 h-4 text-blue-400" />
                </span>
                <span className="font-glass text-white text-base tracking-wider uppercase">ACE10 Secure Access</span>
              </div>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            {/* Custom Sliding Tab Selectors */}
            <div className="grid grid-cols-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-850/80 relative z-10">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
                  activeTab === 'signin' 
                    ? 'bg-slate-900 text-white shadow' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {activeTab === 'signin' && (
                  <span className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                )}
                Sign In Acc
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
                  activeTab === 'signup' 
                    ? 'bg-slate-900 text-white shadow' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {activeTab === 'signup' && (
                  <span className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                )}
                Create Account
              </button>
            </div>

            {/* Feedback Alerts */}
            {errorMsg && (
              <div className="bg-red-950/40 border border-red-900/30 text-red-400 p-3.5 rounded-xl text-xs flex items-start gap-2.5 animate-pulse relative z-10 leading-relaxed">
                <Icons.AlertOctagon className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-950/40 border border-emerald-900/30 text-emerald-400 p-3.5 rounded-xl text-xs flex items-start gap-2.5 relative z-10 leading-relaxed">
                <Icons.CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Interactive Forms (Submit handlers linked based on tabs) */}
            <form 
              onSubmit={activeTab === 'signin' ? handleEmailSignIn : handleEmailSignUp} 
              className="space-y-4 relative z-10"
            >
              {/* Full Name field - Sign Up only */}
              {activeTab === 'signup' && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-widest font-extrabold">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                      <Icons.User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Maliya Gigs"
                      className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl pl-9 pr-4 py-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-650 outline-none transition"
                    />
                  </div>
                </div>
              )}

              {/* Email Address field */}
              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-widest font-extrabold">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                    <Icons.Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 rounded-xl pl-9 pr-4 py-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-650 outline-none transition"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-widest font-extrabold">
                  {activeTab === 'signup' ? 'Password (Min 6 characters)' : 'Password'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                    <Icons.Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 rounded-xl pl-9 pr-10 py-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-650 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <Icons.EyeOff className="w-4 h-4" /> : <Icons.Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit CTA button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-lg transition-all duration-300 transform active:scale-95 cursor-pointer relative overflow-hidden flex items-center justify-center gap-1.5"
                style={{ 
                  background: activeTab === 'signin' 
                    ? `linear-gradient(to right, ${theme.secondaryColor}, ${theme.accentColor})`
                    : `linear-gradient(to right, #10b981, #059669)` 
                }}
              >
                <span>{activeTab === 'signin' ? 'Sign In' : 'Create Account'}</span>
                <Icons.ChevronRight className="w-4 h-4" />
              </button>
            </form>

            {/* Interactive OR Divider */}
            <div className="relative flex py-2 items-center text-xs relative z-10">
              <div className="flex-grow border-t border-slate-850"></div>
              <span className="flex-shrink mx-4 text-slate-500 font-mono text-[10px] font-bold uppercase tracking-wider">or sign in with</span>
              <div className="flex-grow border-t border-slate-850"></div>
                {/* Official Google identity loader card and mount element */}
            <div className="space-y-3 relative z-10">
              <div className="flex flex-col items-center justify-center py-4 border border-dashed border-slate-800/80 rounded-2xl bg-slate-950/40 gap-3">
                {clientId ? (
                  <div className="flex flex-col items-center gap-2">
                    <div id="google-gsi-button-container" ref={btnContainerRef} className="min-h-[44px]" />
                  </div>
                ) : (
                  <div className="text-center p-2 space-y-1.5">
                    <Icons.Lock className="w-6 h-6 text-slate-550 mx-auto" />
                    <p className="text-xs text-slate-400 font-bold">Standard Google login bypass active</p>
                    <p className="text-[10px] text-slate-500 max-w-[280px]">
                      Enter a Google OAuth Web ID below to enable the official Google authentication container frame.
                    </p>
                  </div>
                )}
              </div>
            </div>          </div>

            {/* Footer Workspace Info */}
            <div className="border-t border-slate-850 pt-4 mt-2 text-[10px] text-slate-500 flex items-center justify-between font-medium relative z-10">
              <span className="font-mono">Google GIS Framework</span>
              <a 
                href="https://console.cloud.google.com/apis/credentials" 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-500 hover:underline flex items-center gap-0.5 font-mono text-[10px]"
              >
                <span>Google Console</span>
                <Icons.ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
