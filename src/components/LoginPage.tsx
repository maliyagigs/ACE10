import React, { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import { StorageService } from '../services/storageService';
import { GoogleUser } from '../types';

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

// Client-side JWT decoder for Google Identity tokens
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

export default function LoginPage({ theme, user, setUser, onBackToHome }: LoginPageProps) {
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
  const btnContainerRef = useRef<HTMLDivElement>(null);

  // Dynamically load Google GSI client library script
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (document.getElementById('google-gsi-client-login-page')) {
      setGsiLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-client-login-page';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGsiLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed loading Google Identity Services client script on standalone login page.");
    };
    document.head.appendChild(script);
  }, []);

  // Initialize and Render Google Sign-in buttons
  useEffect(() => {
    if (!gsiLoaded || !clientId || user) return;

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
            setSuccessMsg("Logged in successfully with Google!");
            setTimeout(() => {
              onBackToHome();
            }, 1000);
          }
        };

        // @ts-ignore
        const google = window.google;
        if (google && google.accounts && google.accounts.id) {
          google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
          });

          const btnElement = document.getElementById('standalone-google-button-container');
          if (btnElement) {
            google.accounts.id.renderButton(
              btnElement,
              { 
                theme: 'filled_black', 
                size: 'large', 
                shape: 'pill',
                width: 320,
                text: 'signin_with'
              }
            );
          }
        }
      } catch (err) {
        console.error("Error setting up Google Auth script inside login page:", err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [gsiLoaded, clientId, user, activeTab]);

  // Email Sign-In handler
  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    const registeredUsers = StorageService.loadRegisteredUsers();

    const foundUser = registeredUsers.find(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (!foundUser) {
      setErrorMsg("No account found with this email. Please check your credentials or click \"Create Account\"!");
      return;
    }

    if (foundUser.password !== password) {
      setErrorMsg("Incorrect password. Please try again.");
      return;
    }

    const loggedInUser: GoogleUser = {
      name: foundUser.name,
      email: foundUser.email,
      picture: foundUser.picture || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop`,
      type: 'email'
    };

    setSuccessMsg("Success! Welcome back, redirecting you to your workspace...");
    setTimeout(() => {
      setUser(loggedInUser);
      StorageService.saveCurrentUser(loggedInUser);
      onBackToHome();
      setEmail('');
      setPassword('');
      setSuccessMsg(null);
    }, 1000);
  };

  // Email Sign-Up handler
  const handleEmailSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

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

    const registeredUsers = StorageService.loadRegisteredUsers();

    const duplicate = registeredUsers.some(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (duplicate) {
      setErrorMsg("An account with this email address already exists. Try signing in.");
      return;
    }

    const avatarSeed = Math.floor(Math.random() * 100);
    const pictures = [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
    ];
    const chosenPicture = pictures[avatarSeed % pictures.length];

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

    const loggedInUser: GoogleUser = {
      name: newUser.name,
      email: newUser.email,
      picture: newUser.picture,
      type: 'email'
    };

    setSuccessMsg("Account created! Logging you in...");
    setTimeout(() => {
      setUser(loggedInUser);
      StorageService.saveCurrentUser(loggedInUser);
      onBackToHome();
      setName('');
      setEmail('');
      setPassword('');
      setSuccessMsg(null);
    }, 1200);
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background radial soft light gradient */}
      <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-1/3 w-[300px] h-[300px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main card box with high craftsmanship */}
      <div className="w-full max-w-lg bg-slate-900/60 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative flex flex-col gap-6 animate-fade-in">
        
        {/* Back Link */}
        <button
          onClick={onBackToHome}
          className="self-start text-xs font-mono text-slate-400 hover:text-white transition-all flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-slate-950/40 border border-slate-900 cursor-pointer"
        >
          <Icons.ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Title Display */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-glass text-white tracking-wider uppercase">
            Access Portal
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Securely sign in to start your custom engineering projects, manage milestones, and request immediate premium support.
          </p>
        </div>

        {/* Dynamic Sliding Tabs */}
        <div className="grid grid-cols-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-850/80">
          <button
            type="button"
            onClick={() => {
              setActiveTab('signin');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all relative cursor-pointer ${
              activeTab === 'signin' 
                ? 'bg-slate-900 text-white shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all relative cursor-pointer ${
              activeTab === 'signup' 
                ? 'bg-slate-900 text-white shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Feedbacks */}
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

        {/* Authentication Interactive Form */}
        <form 
          onSubmit={activeTab === 'signin' ? handleEmailSignIn : handleEmailSignUp} 
          className="space-y-4"
        >
          {activeTab === 'signup' && (
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-slate-450 uppercase tracking-widest font-extrabold px-1">
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
                  className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 rounded-xl pl-10 pr-4 py-3.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-700 outline-none transition"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono text-slate-455 uppercase tracking-widest font-extrabold px-1">
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
                className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 rounded-xl pl-10 pr-4 py-3.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-700 outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono text-slate-455 uppercase tracking-widest font-extrabold px-1 animate-pulse">
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
                className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 rounded-xl pl-10 pr-10 py-3.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-700 outline-none transition"
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

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-lg transition-all duration-300 transform active:scale-95 cursor-pointer relative overflow-hidden flex items-center justify-center gap-1.5"
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

        {/* OR Spacer */}
        <div className="relative flex py-1 items-center text-xs">
          <div className="flex-grow border-t border-slate-850"></div>
          <span className="flex-shrink mx-4 text-slate-550 font-mono text-[10px] font-bold uppercase tracking-wider">or integrate google</span>
          <div className="flex-grow border-t border-slate-850"></div>
        </div>

        {/* Google Authentication Section */}
        <div className="space-y-3">
          <div className="flex flex-col items-center justify-center py-5 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40 gap-3">
            {clientId ? (
              <div className="flex flex-col items-center gap-2">
                <div id="standalone-google-button-container" className="min-h-[44px]" />
              </div>
            ) : (
              <div className="text-center p-3 space-y-1.5">
                <Icons.Lock className="w-6 h-6 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 font-bold">Standard Google OAuth bypass available</p>
                <p className="text-[10px] text-slate-550 max-w-[320px]">
                  Provide a Google OAuth Client ID below to display the official custom interactive container iframe.
                </p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
  );
}
