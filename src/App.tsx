import React, { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { initialContent } from "./data";
import { API_ENDPOINTS } from "./config";
import { AppContent } from "./types";
import { StorageService } from "./services/storageService";
import { db, auth as firebaseAuth } from "./services/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { mergeContentWithDefaults } from "./utils/mergeDefaults";

// Importing Premium custom sections
import AmbientBackground from "./components/AmbientBackground";
import InertiaScroll from "./components/InertiaScroll";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import WhyChooseUs from "./components/WhyChooseUs";
import Stats from "./components/Stats";
import Testimonials from "./components/Testimonials";
import ServedCountries from "./components/ServedCountries";
import GlowingArtwork from "./components/GlowingArtwork";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import GoogleAuth from "./components/GoogleAuth";
import LoadingScreen from "./components/LoadingScreen";
import Sitemaps from "./components/Sitemaps";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";

import * as Icons from "lucide-react";

// Lazy load heavy CMS & login portals
const AdminPanel = lazy(() => import("./components/AdminPanel"));
const LoginPage = lazy(() => import("./components/LoginPage"));

// Cybernetic Glassmorphism loading spinner for smooth lazy-loaded portals
function CyberLoadingPlaceholder() {
  return (
    <div className="min-h-[450px] w-full max-w-xl mx-auto flex flex-col items-center justify-center p-12 text-center bg-slate-950/40 backdrop-blur-xl border border-slate-900 rounded-3xl shadow-2xl animate-fade-in relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] bg-blue-600/5 rounded-full blur-[60px] pointer-events-none" />
      <div className="relative w-14 h-14 mb-8">
        {/* Animated double-layer spin rings */}
        <div className="absolute inset-0 rounded-full border-2 border-slate-900 border-t-blue-500 animate-spin" />
        <div
          className="absolute inset-2 rounded-full border-2 border-slate-950 border-t-emerald-450 animate-spin"
          style={{ animationDuration: "0.8s", animationDirection: "reverse" }}
        />
      </div>
      <p className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 font-extrabold animate-pulse">
        Initializing Module
      </p>
      <p className="text-[10px] text-slate-550 mt-2 font-mono">
        Setting up your experience...
      </p>
      <div className="mt-6 w-40 h-1 bg-slate-950/60 overflow-hidden rounded-full border border-slate-900/40 relative">
        <div
          className="absolute top-0 h-full w-14 bg-gradient-to-r from-blue-500 to-emerald-400 animate-pulse"
          style={{ left: "30%" }}
        />
      </div>
    </div>
  );
}

export default function App() {
  const [content, setContent] = useState<AppContent>(initialContent);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isSiteLoaded, setIsSiteLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 1. Synchronize Auth Session with Firebase Client SDK (Unified Auth)
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      if (firebaseUser) {
        const transformedUser: any = {
          name: firebaseUser.displayName || "Firebase User",
          email: firebaseUser.email,
          picture: firebaseUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
          uid: firebaseUser.uid,
          type: 'firebase'
        };
        setUser(transformedUser);
        StorageService.saveCurrentUser(transformedUser);
      } else {
        setUser(null);
        StorageService.saveCurrentUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. Real-time CMS Synchronization: Listen for Cloud Firestore changes
  useEffect(() => {
    // a. Load initial local state for immediate renders (SSR/Offline cache)
    const localContent = StorageService.loadContent(initialContent);
    setContent(mergeContentWithDefaults(localContent, initialContent));

    // b. Attach real-time listener to the 'latest' CMS configuration document
    const cmsDocRef = doc(db, "cms", "latest");
    const unsubscribeSnapshot = onSnapshot(cmsDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const liveData = snapshot.data();
        if (liveData && liveData.content) {
          console.info("[CMS Sync] Real-time configuration push detected from Cloud!");
          const merged = mergeContentWithDefaults(liveData.content, initialContent);
          setContent(merged);
          StorageService.saveContent(merged);
        }
      }
    }, (err) => {
      console.warn("[CMS Sync] Firestore listener constrained or restricted:", err.message);
      
      // Fallback: Attempt one-time REST fetch if real-time fails (e.g. initial setup)
      fetch(API_ENDPOINTS.getContent)
        .then(res => res.json())
        .then(data => {
          if (data && data.siteName) {
            const merged = mergeContentWithDefaults(data, initialContent);
            setContent(merged);
            StorageService.saveContent(merged);
          }
        }).catch(() => {});
    });

    return () => unsubscribeSnapshot();
  }, []);

  const handleUpdateContent = (newContent: AppContent) => {
    const merged = mergeContentWithDefaults(newContent, initialContent);
    setContent(merged);
    StorageService.saveContent(merged);
    // Note: Cloud persistence and src/data.ts synchronization is handled via the "SAVE CHANGES" 
    // action in the AdminPanel to ensure secure, authenticated transactions.
  };

  const scrollToSection = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    setIsAdmin(false);

    // If we're not on the home page, redirect to home and then scroll
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return;
    }

    // Low latency transition to let React switch DOM views before measuring scroll offsets
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const elementRect = element.getBoundingClientRect();
        const absoluteElementY = elementRect.top + window.scrollY - 80; // Minus 80px for the sticky header

        if (typeof (window as any).__triggerInertiaScroll === "function") {
          (window as any).__triggerInertiaScroll(absoluteElementY);
        } else {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }, 60);
  };

  if (!isSiteLoaded) {
    return <LoadingScreen onComplete={() => setIsSiteLoaded(true)} />;
  }

  return (
    <div className="min-h-screen relative text-slate-100 font-sans selection:bg-blue-600 selection:text-white antialiased">
      {/* 1. Immersive Ambient Particles and glowing moving blobs behind layout */}
      <AmbientBackground theme={content.theme} />
      {!isAdmin && <InertiaScroll />}

      {/* Modern cyber glass floating Navigation bar */}
      <nav className={`fixed top-0 inset-x-0 h-20 bg-slate-950/70 backdrop-blur-xl border-b border-slate-900/80 flex items-center justify-between px-6 md:px-12 z-50 transition-all duration-300 ${
        location.pathname === "/" && !scrolled && !isAdmin
          ? "pointer-events-none opacity-0 -translate-y-5"
          : "pointer-events-auto opacity-100 translate-y-0"
      }`}>
        {/* Dynamic Site Name configured by CMS */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
          className="flex items-center gap-2.5 group"
        >
          <span className="font-black text-2xl tracking-[0.15em] bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400 uppercase transition-all duration-300 drop-shadow-sm group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
            {content.siteName}
          </span>
        </a>

        {/* Desktop Quick links - centered in the middle */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-300 absolute left-1/2 -translate-x-1/2">
          <motion.a
            href="#services"
            onClick={(e) => scrollToSection("services", e)}
            whileHover={{ y: -2 }}
            className="hover:text-white transition-colors duration-200 relative py-1.5 group font-mono text-[11px] uppercase tracking-widest font-bold"
          >
            Services
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-350 ease-out" />
          </motion.a>
          <motion.a
            href="#portfolio"
            onClick={(e) => scrollToSection("portfolio", e)}
            whileHover={{ y: -2 }}
            className="hover:text-white transition-colors duration-200 relative py-1.5 group font-mono text-[11px] uppercase tracking-widest font-bold"
          >
            Portfolio
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-350 ease-out" />
          </motion.a>
          <motion.a
            href="#testimonials"
            onClick={(e) => scrollToSection("testimonials", e)}
            whileHover={{ y: -2 }}
            className="hover:text-white transition-colors duration-200 relative py-1.5 group font-mono text-[11px] uppercase tracking-widest font-bold"
          >
            Testimonials
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-350 ease-out" />
          </motion.a>
          <motion.a
            href="#contact"
            onClick={(e) => scrollToSection("contact", e)}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="hover:text-white transition-all duration-350 px-5 py-2.5 bg-slate-900/50 border border-slate-800 rounded-full hover:bg-slate-850 hover:border-slate-700 font-mono text-[10px] uppercase tracking-widest font-bold shadow-md shadow-black/20"
          >
            Quote Request
          </motion.a>
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
          {user?.email === "maliyagigs@gmail.com" && (
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`flex items-center gap-2 text-xs font-mono font-bold px-4 py-2.5 rounded-full transition-all duration-300 relative overflow-hidden cursor-pointer border ${
                isAdmin
                  ? "bg-blue-600 text-white border-transparent shadow-lg shadow-blue-500/20"
                  : "border-slate-800 bg-slate-900/50 hover:bg-slate-950 text-slate-350 hover:text-white"
              }`}
            >
              {isAdmin ? (
                <>
                  <Icons.X className="w-4 h-4" />
                  <span>CLOSE CMS PANEL</span>
                </>
              ) : (
                <>
                  <Icons.Sliders className="w-4 h-4 text-blue-450" />
                  <span>ACE10 DESIGN CMS PANEL</span>
                </>
              )}
            </button>
          )}
        </div>
      </nav>

      <Routes>
        <Route
          path="/auth"
          element={
            <div className="pt-28 pb-12 px-6">
              <Suspense fallback={<CyberLoadingPlaceholder />}>
                <LoginPage
                  theme={content.theme}
                  user={user}
                  setUser={setUser}
                  onBackToHome={() => navigate("/")}
                />
              </Suspense>
            </div>
          }
        />
        <Route
          path="/privacy"
          element={
            <div className="pt-28 pb-12 px-6">
              <PrivacyPolicy
                onBack={() => navigate("/")}
                theme={content.theme}
              />
            </div>
          }
        />
        <Route
          path="/sitemaps"
          element={
            <div className="pt-28 pb-12 px-6">
              <Sitemaps />
            </div>
          }
        />
        <Route
          path="/terms"
          element={
            <div className="pt-28 pb-12 px-6">
              <TermsOfService
                onBack={() => navigate("/")}
                theme={content.theme}
              />
            </div>
          }
        />
        <Route
          path="/"
          element={
            <div className="relative flex flex-col xl:flex-row">
              {/* Main App Content - scale down dynamically if admin side-panel is open on desktop */}
              <main className="relative w-full scale-100">
                <div className={`${isAdmin ? "pointer-events-none lg:pointer-events-auto" : ""}`}>
                  {/* Hero section */}
                  <Hero
                    content={content.hero}
                    theme={content.theme}
                    siteName={content.siteName}
                    isLoggedIn={!!user}
                    onStartProject={() => {
                      if (user) {
                        scrollToSection("contact");
                      } else {
                        navigate("/auth");
                      }
                    }}
                  />

                  {/* Numerical counters section */}
                  <Stats stats={content.stats} theme={content.theme} />

                  {/* Handcrafted Services layout with organic vector shapes rendering behind cards */}
                  <Services
                    services={content.services}
                    theme={content.theme}
                    header={content.servicesHeader}
                    servicesLab={content.servicesLab}
                  />

                  {/* Segment showing custom vertical project showcase mockups */}
                  <Portfolio
                    portfolio={content.portfolio}
                    theme={content.theme}
                    header={content.portfolioHeader}
                  />

                  {/* Elegant benefits/features display */}
                  <WhyChooseUs
                    theme={content.theme}
                    siteName={content.siteName}
                    whyChooseUs={content.whyChooseUs}
                  />

                  {/* Testimonial endorse panel */}
                  <Testimonials
                    testimonials={content.testimonials}
                    theme={content.theme}
                    header={content.testimonialsHeader}
                  />

                  {/* Served Flags badge list */}
                  <ServedCountries
                    countries={content.countries}
                    theme={content.theme}
                    header={content.countriesHeader}
                  />

                  {/* Floating inputs contact quote selector */}
                  <ContactForm
                    theme={content.theme}
                    header={content.contactHeader}
                  />

                  {/* Detailed scalable footer list */}
                  {/* We pass a navigate wrapper for Footer if needed to navigate back to other paths */}
                  <Footer
                    footer={content.footer}
                    theme={content.theme}
                    siteName={content.siteName}
                    setCurrentView={(route) =>
                      navigate("/" + (route === "home" ? "" : route))
                    }
                  />
                </div>
              </main>

              {/* Admin CMS Full Screen Overlay */}
              {isAdmin && (
                <div className="fixed inset-0 bg-slate-950 z-[100] animate-in fade-in duration-500 overflow-hidden">
                  <Suspense fallback={<CyberLoadingPlaceholder />}>
                    <AdminPanel
                      content={content}
                      setContent={handleUpdateContent}
                      user={user}
                      onClose={() => setIsAdmin(false)}
                    />
                  </Suspense>
                </div>
              )}
            </div>
          }
        />
      </Routes>
    </div>
  );
}
