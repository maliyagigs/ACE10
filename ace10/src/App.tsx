import React, { useState, useEffect, lazy, Suspense } from 'react';
import { initialContent } from './data';
import { AppContent } from './types';
import { StorageService } from './services/storageService';

// Importing Premium custom sections
import AmbientBackground from './components/AmbientBackground';
import InertiaScroll from './components/InertiaScroll';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import WhyChooseUs from './components/WhyChooseUs';
import Stats from './components/Stats';
import Testimonials from './components/Testimonials';
import ServedCountries from './components/ServedCountries';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import GoogleAuth from './components/GoogleAuth';

import * as Icons from 'lucide-react';

// Lazy load heavy CMS & login portals
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const LoginPage = lazy(() => import('./components/LoginPage'));

// Cybernetic Glassmorphism loading spinner for smooth lazy-loaded portals
function CyberLoadingPlaceholder() {
  return (
    <div className="min-h-[450px] w-full max-w-xl mx-auto flex flex-col items-center justify-center p-12 text-center bg-slate-950/40 backdrop-blur-xl border border-slate-900 rounded-3xl shadow-2xl animate-fade-in relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] bg-blue-600/5 rounded-full blur-[60px] pointer-events-none" />
      <div className="relative w-14 h-14 mb-8">
        {/* Animated double-layer spin rings */}
        <div className="absolute inset-0 rounded-full border-2 border-slate-900 border-t-blue-500 animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-slate-950 border-t-emerald-450 animate-spin" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }} />
      </div>
      <p className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 font-extrabold animate-pulse">
        Initializing Module
      </p>
      <p className="text-[10px] text-slate-550 mt-2 font-mono">
        Securing telemetry credentials & local schema sync...
      </p>
      <div className="mt-6 w-40 h-1 bg-slate-950/60 overflow-hidden rounded-full border border-slate-900/40 relative">
        <div className="absolute top-0 h-full w-14 bg-gradient-to-r from-blue-500 to-emerald-400 animate-pulse" style={{ left: '30%' }} />
      </div>
    </div>
  );
}

export default function App() {
  const [content, setContent] = useState<AppContent>(initialContent);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'auth'>('home');

  // Sync Google/Email Authorized User session on load using isolated StorageService
  useEffect(() => {
    const savedUser = StorageService.loadCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  // Synchronize App Content using custom StorageService database fallback & live server API
  useEffect(() => {
    // 1. Initial local state / offline recovery fallback
    const syncContent = StorageService.loadContent(initialContent);
    setContent(syncContent);

    // 2. Query the live AI Studio Workspace Server to read the database-level config
    const apiBase = window.location.hostname.includes('run.app') || window.location.hostname === 'localhost' || window.location.hostname.includes('3000')
      ? ''
      : 'https://ais-pre-3bnsn3h3bcrvvg5n3vii3y-730607672030.asia-southeast1.run.app';

    fetch(`${apiBase}/api/get-content`)
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(liveContent => {
        if (liveContent && typeof liveContent === 'object' && liveContent.siteName) {
          setContent(liveContent);
          StorageService.saveContent(liveContent);
          console.info('[CMS Sync] Loaded latest production configurations from workspace adapter!');
        }
      })
      .catch(err => {
        console.debug('[CMS Sync] Offline or external workspace fallback:', err.message);
      });
  }, []);

  const handleUpdateContent = (newContent: AppContent) => {
    setContent(newContent);
    StorageService.saveContent(newContent);
    
    const apiBase = window.location.hostname.includes('run.app') || window.location.hostname === 'localhost' || window.location.hostname.includes('3000')
      ? ''
      : 'https://ais-pre-3bnsn3h3bcrvvg5n3vii3y-730607672030.asia-southeast1.run.app';

    // Broadcast file-level CMS update payload to the backend server to preserve state across builds
    fetch(`${apiBase}/api/save-content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newContent)
    }).catch(err => {
      console.warn('[CMS Sync] Local workspace sync error:', err);
    });
  };

  const scrollToSection = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    setIsAdmin(false);
    setCurrentView('home');
    
    // Low latency transition to let React switch DOM views before measuring scroll offsets
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const elementRect = element.getBoundingClientRect();
        const absoluteElementY = elementRect.top + window.scrollY - 80; // Minus 80px for the sticky header
        
        if (typeof (window as any).__triggerInertiaScroll === 'function') {
          (window as any).__triggerInertiaScroll(absoluteElementY);
        } else {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 60);
  };

  return (
    <div className="min-h-screen relative text-slate-100 font-sans selection:bg-blue-600 selection:text-white antialiased">
      
      {/* 1. Immersive Ambient Particles and glowing moving blobs behind layout */}
      <AmbientBackground theme={content.theme} />
      <InertiaScroll />

      {/* Modern cyber glass floating Navigation bar */}
      <nav className="fixed top-0 inset-x-0 h-20 bg-slate-950/70 backdrop-blur-xl border-b border-slate-900/80 flex items-center justify-between px-6 md:px-12 z-50">
        
        {/* Dynamic Site Name configured by CMS */}
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            setCurrentView('home');
          }}
          className="flex items-center gap-2.5 group"
        >
          <div 
            className="w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center font-black text-white text-lg shadow-lg group-hover:scale-105 transition-transform" 
            style={{ backgroundImage: `linear-gradient(to bottom right, ${content.theme.secondaryColor}, ${content.theme.accentColor})` }}
          >
            A
          </div>
          <span className="font-black text-xl tracking-wider text-white group-hover:text-blue-400 transition-colors uppercase">
            {content.siteName}
          </span>
        </a>

        {/* Desktop Quick links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
          <a href="#services" onClick={(e) => scrollToSection('services', e)} className="hover:text-white transition-colors">Services</a>
          <a href="#portfolio" onClick={(e) => scrollToSection('portfolio', e)} className="hover:text-white transition-colors">Portfolio</a>
          <a href="#testimonials" onClick={(e) => scrollToSection('testimonials', e)} className="hover:text-white transition-colors">Testimonials</a>
          <a href="#contact" onClick={(e) => scrollToSection('contact', e)} className="hover:text-white transition-colors">Quote Request</a>
        </div>

        {/* Action Controls Group: Google Login + CMS / Design Mode */}
        <div className="flex items-center gap-3">
          {/* Integrated Google OAuth client-side status element */}
          <GoogleAuth 
            theme={content.theme} 
            modalOpen={authModalOpen}
            setModalOpen={setAuthModalOpen}
            user={user}
            setUser={setUser}
          />

          {/* CMS / Design Mode Toggle Button */}
          <button 
            onClick={() => setIsAdmin(!isAdmin)}
            className={`flex items-center gap-2 text-xs font-mono font-bold px-4 py-2.5 rounded-full transition-all duration-300 relative overflow-hidden cursor-pointer border ${
              isAdmin 
                ? 'bg-blue-600 text-white border-transparent' 
                : 'border-slate-800 bg-slate-900/50 hover:bg-slate-950 text-slate-350 hover:text-white'
            }`}
          >
            {isAdmin ? (
              <>
                <Icons.Eye className="w-4 h-4" />
                <span>EXIT DESIGN CONTROLLER</span>
              </>
            ) : (
              <>
                <Icons.Sliders className="w-4 h-4 text-blue-450" />
                <span>ACE10 DESIGN CMS PANEL</span>
              </>
            )}
          </button>
        </div>
      </nav>

      {isAdmin ? (
        <div className="pt-28 pb-12 px-6">
          <Suspense fallback={<CyberLoadingPlaceholder />}>
            <AdminPanel content={content} setContent={handleUpdateContent} />
          </Suspense>
        </div>
      ) : currentView === 'auth' ? (
        <Suspense fallback={<CyberLoadingPlaceholder />}>
          <LoginPage 
            theme={content.theme} 
            user={user} 
            setUser={setUser} 
            onBackToHome={() => setCurrentView('home')} 
          />
        </Suspense>
      ) : (
        <main className="relative">
          {/* Hero section */}
          <Hero 
            content={content.hero} 
            theme={content.theme} 
            isLoggedIn={!!user}
            onStartProject={() => {
              if (user) {
                scrollToSection('contact');
              } else {
                setCurrentView('auth');
              }
            }}
          />
          
          {/* Numerical counters section */}
          <Stats stats={content.stats} theme={content.theme} />

          {/* Handcrafted Services layout with organic vector shapes rendering behind cards */}
          <Services services={content.services} theme={content.theme} />

          {/* Segment showing custom vertical project showcase mockups */}
          <Portfolio portfolio={content.portfolio} theme={content.theme} />

          {/* Elegant benefits/features display */}
          <WhyChooseUs theme={content.theme} siteName={content.siteName} />

          {/* Testimonial endorse panel */}
          <Testimonials testimonials={content.testimonials} theme={content.theme} />

          {/* Served Flags badge list */}
          <ServedCountries countries={content.countries} theme={content.theme} />

          {/* Floating inputs contact quote selector */}
          <ContactForm theme={content.theme} />

          {/* Detailed scalable footer list */}
          <Footer footer={content.footer} theme={content.theme} siteName={content.siteName} />
        </main>
      )}
    </div>
  );
}
