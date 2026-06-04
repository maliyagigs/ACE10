import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { AppContent } from '../types';

interface WhyChooseUsProps {
  theme: AppContent['theme'];
  siteName: string;
}

function SphereBackground() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const paths = svg.querySelectorAll('path');
    let animationId: number;
    const startTime = performance.now();

    const tick = () => {
      const elapsed = performance.now() - startTime;
      paths.forEach((path, idx) => {
        const percent = (1 - Math.sin((idx * 0.35) + (elapsed * 0.0014))) / 2;
        const tx = -5 + percent * 8;
        const ty = -5 + percent * 8;
        
        // GPU composited translation
        path.style.transform = `translate3d(${tx}px, ${ty}px, 0px)`;
        
        // GPU composited opacity fade
        path.style.opacity = (0.35 + percent * 0.65).toFixed(3);
      });
      animationId = requestAnimationFrame(tick);
    };
    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center opacity-70 select-none z-0">
      <div className="relative w-[340px] h-[340px] sm:w-[500px] sm:h-[500px] md:w-[680px] md:h-[680px] select-none pointer-events-none transform -rotate-12 scale-110 sm:scale-100">
        <svg 
          ref={svgRef}
          viewBox="0 0 440 440" 
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="sphereGradient" x1="5%" x2="5%" y1="0%" y2="15%">
              <stop stopColor="#1e293b" offset="0%"/>
              <stop stopColor="#0f172a" offset="50%"/>
              <stop stopColor="#020617" offset="100%"/>
            </linearGradient>
            
            {/* Heat-anodized titanium metallic gradient spectrum */}
            <linearGradient id="titaniumStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#e2e8f0" />
              <stop offset="60%" stopColor="#93c5fd" />
              <stop offset="85%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
            
            {/* High-tech glow and metal reflections filter for titanium threads */}
            <filter id="titanium-laser-glow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="1.5" result="blur1" />
              <feGaussianBlur stdDeviation="0.5" result="blur2" />
              <feMerge>
                <feMergeNode in="blur1" />
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path filter="url(#titanium-laser-glow)" stroke="url(#titaniumStroke)" strokeWidth="0.8" style={{ fill: 'url(#sphereGradient)', backfaceVisibility: 'hidden', willChange: 'transform, opacity', transition: 'none' }} d="M361.604 361.238c-24.407 24.408-51.119 37.27-59.662 28.727-8.542-8.543 4.319-35.255 28.726-59.663 24.408-24.407 51.12-37.269 59.663-28.726 8.542 8.543-4.319 35.255-28.727 59.662z"/>
          <path filter="url(#titanium-laser-glow)" stroke="url(#titaniumStroke)" strokeWidth="0.8" style={{ fill: 'url(#sphereGradient)', backfaceVisibility: 'hidden', willChange: 'transform, opacity', transition: 'none' }} d="M360.72 360.354c-35.879 35.88-75.254 54.677-87.946 41.985-12.692-12.692 6.105-52.067 41.985-87.947 35.879-35.879 75.254-54.676 87.946-41.984 12.692 12.692-6.105 52.067-41.984 87.946z"/>
          <path filter="url(#titanium-laser-glow)" stroke="url(#titaniumStroke)" strokeWidth="0.8" style={{ fill: 'url(#sphereGradient)', backfaceVisibility: 'hidden', willChange: 'transform, opacity', transition: 'none' }} d="M357.185 356.819c-44.91 44.91-94.376 68.258-110.485 52.149-16.11-16.11 7.238-65.575 52.149-110.485 44.91-44.91 94.376-68.259 110.485-52.15 16.11 16.11-7.239 65.576-52.149 110.486z"/>
          <path filter="url(#titanium-laser-glow)" stroke="url(#titaniumStroke)" strokeWidth="0.8" style={{ fill: 'url(#sphereGradient)', backfaceVisibility: 'hidden', willChange: 'transform, opacity', transition: 'none' }} d="M350.998 350.632c-53.21 53.209-111.579 81.107-130.373 62.313-18.794-18.793 9.105-77.163 62.314-130.372 53.209-53.21 111.579-81.108 130.373-62.314 18.794 18.794-9.105 77.164-62.314 130.373z"/>
          <path filter="url(#titanium-laser-glow)" stroke="url(#titaniumStroke)" strokeWidth="0.8" style={{ fill: 'url(#sphereGradient)', backfaceVisibility: 'hidden', willChange: 'transform, opacity', transition: 'none' }} d="M343.043 342.677c-59.8 59.799-125.292 91.26-146.283 70.268-20.99-20.99 10.47-86.483 70.269-146.282 59.799-59.8 125.292-91.26 146.283-70.269 20.99 20.99-10.47 86.484-70.27 146.283z"/>
          <path filter="url(#titanium-laser-glow)" stroke="url(#titaniumStroke)" strokeWidth="0.8" style={{ fill: 'url(#sphereGradient)', backfaceVisibility: 'hidden', willChange: 'transform, opacity', transition: 'none' }} d="M334.646 334.28c-65.169 65.169-136.697 99.3-159.762 76.235-23.065-23.066 11.066-94.593 76.235-159.762s136.697-99.3 159.762-76.235c23.065 23.065-11.066 94.593-76.235 159.762z"/>
          <path filter="url(#titanium-laser-glow)" stroke="url(#titaniumStroke)" strokeWidth="0.8" style={{ fill: 'url(#sphereGradient)', backfaceVisibility: 'hidden', willChange: 'transform, opacity', transition: 'none' }} d="M324.923 324.557c-69.806 69.806-146.38 106.411-171.031 81.76-24.652-24.652 11.953-101.226 81.759-171.032 69.806-69.806 146.38-106.411 171.031-81.76 24.652 24.653-11.953 101.226-81.759 171.032z"/>
          <path filter="url(#titanium-laser-glow)" stroke="url(#titaniumStroke)" strokeWidth="0.8" style={{ fill: 'url(#sphereGradient)', backfaceVisibility: 'hidden', willChange: 'transform, opacity', transition: 'none' }} d="M312.99 312.625c-73.222 73.223-153.555 111.609-179.428 85.736-25.872-25.872 12.514-106.205 85.737-179.428s153.556-111.609 179.429-85.737c25.872 25.873-12.514 106.205-85.737 179.429z"/>
          <path filter="url(#titanium-laser-glow)" stroke="url(#titaniumStroke)" strokeWidth="0.8" style={{ fill: 'url(#sphereGradient)', backfaceVisibility: 'hidden', willChange: 'transform, opacity', transition: 'none' }} d="M300.175 299.808c-75.909 75.909-159.11 115.778-185.837 89.052-26.726-26.727 13.143-109.929 89.051-185.837 75.908-75.908 159.11-115.778 185.837-89.051 26.726 26.726-13.143 109.928-89.051 185.836z"/>
          <path filter="url(#titanium-laser-glow)" stroke="url(#titaniumStroke)" strokeWidth="0.8" style={{ fill: 'url(#sphereGradient)', backfaceVisibility: 'hidden', willChange: 'transform, opacity', transition: 'none' }} d="M284.707 284.34c-77.617 77.617-162.303 118.773-189.152 91.924-26.848-26.848 14.308-111.534 91.924-189.15C265.096 109.496 349.782 68.34 376.63 95.188c26.849 26.849-14.307 111.535-91.923 189.151z"/>
          <path filter="url(#titanium-laser-glow)" stroke="url(#titaniumStroke)" strokeWidth="0.8" style={{ fill: 'url(#sphereGradient)', backfaceVisibility: 'hidden', willChange: 'transform, opacity', transition: 'none' }} d="M269.239 267.989c-78.105 78.104-163.187 119.656-190.035 92.807-26.849-26.848 14.703-111.93 92.807-190.035 78.105-78.104 163.187-119.656 190.035-92.807 26.849 26.848-14.703 111.93-92.807 190.035z"/>
          <path filter="url(#titanium-laser-glow)" stroke="url(#titaniumStroke)" strokeWidth="0.8" style={{ fill: 'url(#sphereGradient)', backfaceVisibility: 'hidden', willChange: 'transform, opacity', transition: 'none' }} d="M252.887 252.52C175.27 330.138 90.584 371.294 63.736 344.446 36.887 317.596 78.043 232.91 155.66 155.293 233.276 77.677 317.962 36.521 344.81 63.37c26.85 26.848-14.307 111.534-91.923 189.15z"/>
          <path filter="url(#titanium-laser-glow)" stroke="url(#titaniumStroke)" strokeWidth="0.8" style={{ fill: 'url(#sphereGradient)', backfaceVisibility: 'hidden', willChange: 'transform, opacity', transition: 'none' }} d="M236.977 236.61C161.069 312.52 77.867 352.389 51.14 325.663c-26.726-26.727 13.143-109.928 89.052-185.837 75.908-75.908 159.11-115.777 185.836-89.05 26.727 26.726-13.143 109.928-89.051 185.836z"/>
          <path filter="url(#titanium-laser-glow)" stroke="url(#titaniumStroke)" strokeWidth="0.8" style={{ fill: 'url(#sphereGradient)', backfaceVisibility: 'hidden', willChange: 'transform, opacity', transition: 'none' }} d="M221.067 220.7C147.844 293.925 67.51 332.31 41.639 306.439c-25.873-25.873 12.513-106.206 85.736-179.429C200.6 53.786 280.931 15.4 306.804 41.272c25.872 25.873-12.514 106.206-85.737 179.429z"/>
          <path filter="url(#titanium-laser-glow)" stroke="url(#titaniumStroke)" strokeWidth="0.8" style={{ fill: 'url(#sphereGradient)', backfaceVisibility: 'hidden', willChange: 'transform, opacity', transition: 'none' }} d="M205.157 204.79c-69.806 69.807-146.38 106.412-171.031 81.76-24.652-24.652 11.953-101.225 81.759-171.031 69.806-69.807 146.38-106.411 171.031-81.76 24.652 24.652-11.953 101.226-81.759 171.032z"/>
          <path filter="url(#titanium-laser-glow)" stroke="url(#titaniumStroke)" strokeWidth="0.8" style={{ fill: 'url(#sphereGradient)', backfaceVisibility: 'hidden', willChange: 'transform, opacity', transition: 'none' }} d="M189.247 188.881c-65.169 65.169-136.696 99.3-159.762 76.235-23.065-23.065 11.066-94.593 76.235-159.762s136.697-99.3 159.762-76.235c23.065 23.065-11.066 94.593-76.235 159.762z"/>
          <path filter="url(#titanium-laser-glow)" stroke="url(#titaniumStroke)" strokeWidth="0.8" style={{ fill: 'url(#sphereGradient)', backfaceVisibility: 'hidden', willChange: 'transform, opacity', transition: 'none' }} d="M173.337 172.971c-59.799 59.8-125.292 91.26-146.282 70.269-20.991-20.99 10.47-86.484 70.268-146.283 59.8-59.799 125.292-91.26 146.283-70.269 20.99 20.991-10.47 86.484-70.269 146.283z"/>
          <path filter="url(#titanium-laser-glow)" stroke="url(#titaniumStroke)" strokeWidth="0.8" style={{ fill: 'url(#sphereGradient)', backfaceVisibility: 'hidden', willChange: 'transform, opacity', transition: 'none' }} d="M157.427 157.061c-53.209 53.21-111.578 81.108-130.372 62.314-18.794-18.794 9.104-77.164 62.313-130.373 53.21-53.209 111.58-81.108 130.373-62.314 18.794 18.794-9.105 77.164-62.314 130.373z"/>
          <path filter="url(#titanium-laser-glow)" stroke="url(#titaniumStroke)" strokeWidth="0.8" style={{ fill: 'url(#sphereGradient)', backfaceVisibility: 'hidden', willChange: 'transform, opacity', transition: 'none' }} d="M141.517 141.151c-44.91 44.91-94.376 68.259-110.485 52.15-16.11-16.11 7.239-65.576 52.15-110.486 44.91-44.91 94.375-68.258 110.485-52.15 16.109 16.11-7.24 65.576-52.15 110.486z"/>
          <path filter="url(#titanium-laser-glow)" stroke="url(#titaniumStroke)" strokeWidth="0.8" style={{ fill: 'url(#sphereGradient)', backfaceVisibility: 'hidden', willChange: 'transform, opacity', transition: 'none' }} d="M125.608 125.241c-35.88 35.88-75.255 54.677-87.947 41.985-12.692-12.692 6.105-52.067 41.985-87.947C115.525 43.4 154.9 24.603 167.592 37.295c12.692 12.692-6.105 52.067-41.984 87.946z"/>
          <path filter="url(#titanium-laser-glow)" stroke="url(#titaniumStroke)" strokeWidth="0.8" style={{ fill: 'url(#sphereGradient)', backfaceVisibility: 'hidden', willChange: 'transform, opacity', transition: 'none' }} d="M109.698 109.332c-24.408 24.407-51.12 37.268-59.663 28.726-8.542-8.543 4.319-35.255 28.727-59.662 24.407-24.408 51.12-37.27 59.662-28.727 8.543 8.543-4.319 35.255-28.726 59.663z"/>
        </svg>
      </div>
    </div>
  );
}

export default function WhyChooseUs({ theme, siteName }: WhyChooseUsProps) {
  const benefits = [
    {
      title: "Pristine Pixel Perfection",
      description: "We don't settle for templates. Every component is handcrafted from scratch to maintain structural superiority and high-conversion elegance.",
      icon: "ShieldAlert"
    },
    {
      title: "Optimized Core Web Vitals",
      description: "Our engineered sites rank amongst the fastest. We optimize file load weights, image servers, and client caching structures.",
      icon: "Gauge"
    },
    {
      title: "Adaptive Responsive Fluidity",
      description: "Every single page adjusts fluidly from wide displays down to ultra-compact mobile screens without a single layout error.",
      icon: "Smartphone"
    },
    {
      title: "User-Centered Behavior Labs",
      description: "Every CTA, card position, and color emphasis undergoes strict mapping to maximize client lead capture rates.",
      icon: "Compass"
    }
  ];

  const renderIcon = (name: string) => {
    const LucideIcon = (Icons as any)[name] || Icons.CheckCircle;
    return <LucideIcon className="w-6 h-6 text-white" />;
  };

  return (
    <section className="py-28 px-6 md:px-12 bg-slate-950/40 backdrop-blur-3xl border-t border-slate-900 overflow-hidden relative">
      <SphereBackground />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blue-500/5 filter blur-[140px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
        
        {/* Left column */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-3xl md:text-5xl font-glass text-white tracking-wider leading-tight uppercase relative inline-block">
            {`Why Hundreds of Leaders Trust ${siteName}`.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.01,
                  delay: i * 0.03, // Fast typewriter speed
                  ease: "linear"
                }}
              >
                {char}
              </motion.span>
            ))}
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "steps(2)" }}
              className="inline-block w-[3px] h-[0.8em] bg-blue-500 ml-1 align-middle"
            />
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed pt-2">
            We operate at the intersection of technological logic and aesthetic brilliance. No mock layout simulations, only state-of-the-art results tailored to your market.
          </p>
          <div className="pt-4">
            <a 
              href="#contact" 
              className="inline-flex items-center gap-2 font-semibold text-white hover:text-blue-400 group transition-colors"
            >
              <span>Get Started With Our Team Today</span>
              <Icons.ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {benefits.map((b, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="p-8 bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 rounded-3xl backdrop-blur-xl transition-all duration-300"
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-6"
                style={{ backgroundColor: theme.secondaryColor }}
              >
                {renderIcon(b.icon)}
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{b.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{b.description}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
