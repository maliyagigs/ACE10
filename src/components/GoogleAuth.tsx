import React, { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import { auth as firebaseAuth, db } from '../services/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { StorageService } from '../services/storageService';
import { GoogleUser } from '../types';

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

export default function GoogleAuth({ theme, modalOpen, setModalOpen, user, setUser }: GoogleAuthProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  
  // Email Password States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Feedback states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync user profile to Firestore
  const syncUserProfile = async (fbUser: any, type: 'google' | 'email') => {
    try {
      const userRef = doc(db, 'users', fbUser.uid);
      await setDoc(userRef, {
        uid: fbUser.uid,
        name: fbUser.displayName || (type === 'email' ? fbUser.email.split('@')[0] : 'User'),
        email: fbUser.email,
        picture: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        authType: type,
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn("Failed to sync user profile to cloud:", err);
    }
  };

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

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsProcessing(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(firebaseAuth, provider);
      const fbUser = result.user;
      
      const transformedUser: GoogleUser = {
        name: fbUser.displayName || 'Google User',
        email: fbUser.email || '',
        picture: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        uid: fbUser.uid,
        type: 'google'
      };
      
      await syncUserProfile(fbUser, 'google');
      
      setUser(transformedUser);
      StorageService.saveCurrentUser(transformedUser);
      setModalOpen(false);
    } catch (err: any) {
      console.error("Google Sign-In Error:", err);
      setErrorMsg(err.message || "Failed to authenticate with Google.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(firebaseAuth);
      setUser(null);
      StorageService.saveCurrentUser(null);
      setDropdownOpen(false);
    } catch (err) {
      console.error("Sign-out error:", err);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const fbUser = result.user;
      
      const loggedInUser: GoogleUser = {
        name: fbUser.displayName || email.split('@')[0],
        email: fbUser.email || email,
        picture: fbUser.photoURL || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop`,
        uid: fbUser.uid,
        type: 'email'
      };

      await syncUserProfile(fbUser, 'email');

      setSuccessMsg("Welcome back! Signing you in...");
      setTimeout(() => {
        setUser(loggedInUser);
        StorageService.saveCurrentUser(loggedInUser);
        setModalOpen(false);
        setSuccessMsg(null);
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid credentials.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const fbUser = result.user;
      
      await updateProfile(fbUser, {
        displayName: name,
        photoURL: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop`
      });

      const loggedInUser: GoogleUser = {
        name: name,
        email: fbUser.email || email,
        picture: fbUser.photoURL || "",
        uid: fbUser.uid,
        type: 'email'
      };

      await syncUserProfile(fbUser, 'email');

      setSuccessMsg("Account created! Access granted.");
      setTimeout(() => {
        setUser(loggedInUser);
        StorageService.saveCurrentUser(loggedInUser);
        setModalOpen(false);
        setSuccessMsg(null);
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create account.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      {/* Session Trigger / Profile Menu */}
      {!user ? (
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 text-xs font-mono font-bold px-4 py-3 rounded-full border border-slate-800 bg-slate-900/50 hover:bg-slate-950 text-slate-350 hover:text-white transition-all cursor-pointer group"
        >
          <Icons.User className="w-4 h-4 text-blue-500 group-hover:animate-pulse" />
          <span>SIGN IN / REGISTER</span>
        </button>
      ) : (
        /* User profile menu */
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
            <div className="absolute right-0 mt-2.5 w-67 bg-slate-950/95 border border-slate-900 rounded-2xl shadow-xl backdrop-blur-xl z-[60] p-4 flex flex-col gap-3 animate-in fade-in zoom-in duration-200">
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
      )}

      {/* Unified Auth Form Overlay Modal */}
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
              <span className="flex-shrink mx-4 text-slate-500 font-mono text-[10px] font-bold uppercase tracking-wider">or continue with</span>
              <div className="flex-grow border-t border-slate-850"></div>
            </div>

            {/* Official Firebase Google Auth Button */}
            <div className="space-y-3 relative z-10">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-3 py-3 bg-white hover:bg-slate-50 text-slate-900 rounded-xl font-bold text-xs uppercase tracking-wide transition-all border border-slate-200 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <img src="https://www.gstatic.com/firebase/anonymous-scan.png" alt="Google" className="w-4 h-4 hidden" />
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                   <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                   <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                   <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
                   <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Sign in with Google</span>
              </button>
            </div>

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
