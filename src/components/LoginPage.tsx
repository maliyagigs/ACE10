import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth as firebaseAuth, db } from '../services/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { GoogleUser } from '../types';
import { getAuthErrorMessage } from '../services/authUtils';

interface LoginPageProps {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  user: GoogleUser | null;
  setUser: (user: GoogleUser | null) => void;
  onBackToHome: () => void;
}

export default function LoginPage({ theme, user, setUser, onBackToHome }: LoginPageProps) {
  const navigate = useNavigate();
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

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsProcessing(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account',
        client_id: '241771979796-o026825m3jg3m7lau7jn1g6m0b1sasit.apps.googleusercontent.com'
      });
      const result = await signInWithPopup(firebaseAuth, provider);
      await syncUserProfile(result.user, 'google');
      setSuccessMsg("Logged in successfully with Google!");
      setTimeout(() => {
        onBackToHome();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to authenticate with Google.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
      await syncUserProfile(result.user, 'email');
      setSuccessMsg("Welcome back! Redirecting...");
      setTimeout(() => {
        onBackToHome();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(getAuthErrorMessage(err.code));
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

      await syncUserProfile(fbUser, 'email');
      setSuccessMsg("Account created! Access granted.");
      setTimeout(() => {
        onBackToHome();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(getAuthErrorMessage(err.code));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 h-screen w-screen bg-[#020617] flex flex-col items-center justify-center overflow-hidden px-4 z-50">
      <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-1/3 w-[300px] h-[300px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg bg-slate-900/60 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative flex flex-col gap-6 animate-fade-in max-h-[92vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        <button
          onClick={onBackToHome}
          className="self-start text-xs font-mono text-slate-400 hover:text-white transition-all flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-slate-950/40 border border-slate-900 cursor-pointer"
        >
          <Icons.ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-glass text-white tracking-wider uppercase">
            Access Portal
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Securely sign in to manage your digital infrastructure and request premium engineering support.
          </p>
        </div>

        <div className="grid grid-cols-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-850/80">
          <button
            type="button"
            onClick={() => { setActiveTab('signin'); setErrorMsg(null); }}
            className={`py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all relative cursor-pointer ${
              activeTab === 'signin' ? 'bg-slate-900 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('signup'); setErrorMsg(null); }}
            className={`py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all relative cursor-pointer ${
              activeTab === 'signup' ? 'bg-slate-900 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-950/50 border border-red-900/30 text-red-400 p-4 rounded-xl text-xs flex items-start gap-2.5 animate-pulse leading-relaxed">
            <Icons.AlertOctagon className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-950/50 border border-emerald-900/30 text-emerald-400 p-4 rounded-xl text-xs flex items-start gap-2.5 leading-relaxed">
            <Icons.CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={activeTab === 'signin' ? handleEmailSignIn : handleEmailSignUp} className="space-y-4">
          {activeTab === 'signup' && (
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-widest font-extrabold px-1">Full Name</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500"><Icons.User className="w-4 h-4" /></span>
                <input
                  type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Maliya Gigs"
                  className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 rounded-xl pl-10 pr-4 py-3.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-700 outline-none transition"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-widest font-extrabold px-1">Email Address</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500"><Icons.Mail className="w-4 h-4" /></span>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 rounded-xl pl-10 pr-4 py-3.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-700 outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-widest font-extrabold px-1">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500"><Icons.Lock className="w-4 h-4" /></span>
              <input
                type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 rounded-xl pl-10 pr-10 py-3.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-700 outline-none transition"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer">
                {showPassword ? <Icons.EyeOff className="w-4 h-4" /> : <Icons.Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit" disabled={isProcessing}
            className="w-full py-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-lg transition-all duration-300 transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            style={{ 
              background: activeTab === 'signin' 
                ? `linear-gradient(to right, ${theme.secondaryColor}, ${theme.accentColor})`
                : `linear-gradient(to right, #10b981, #059669)` 
            }}
          >
            {isProcessing ? <Icons.Loader2 className="w-4 h-4 animate-spin" /> : <span>{activeTab === 'signin' ? 'Sign In' : 'Create Account'}</span>}
            <Icons.ChevronRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative flex py-1 items-center text-xs">
          <div className="flex-grow border-t border-slate-850"></div>
          <span className="flex-shrink mx-4 text-slate-500 font-mono text-[10px] font-bold uppercase tracking-wider">or sign in with</span>
          <div className="flex-grow border-t border-slate-850"></div>
        </div>

        <button
          type="button" onClick={handleGoogleSignIn} disabled={isProcessing}
          className="w-full flex items-center justify-center gap-3 py-3 bg-white hover:bg-slate-50 text-slate-900 rounded-xl font-bold text-xs uppercase tracking-wide transition-all border border-slate-200 shadow-sm disabled:opacity-50 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Google Authentication</span>
        </button>
      </div>
    </div>
  );
}
