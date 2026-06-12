import React, { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import { AppContent } from '../types';

function PortfolioCardImage({ src, alt, className }: { src?: string; alt: string; className: string }) {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const fallback = 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=1200&auto=format&fit=crop';
  
  let finalSrc = src || fallback;
  if (hasError) {
    finalSrc = fallback;
  } else if (finalSrc.includes('images.unsplash.com')) {
    // Automatically convert any low-resolution width properties to 1200px width for premium clarity
    finalSrc = finalSrc.replace(/w=\d+/, 'w=1200').replace(/q=\d+/, 'q=90');
    // If it lacks width parameter, ensure high resolution size is added
    if (!finalSrc.includes('w=')) {
      finalSrc += (finalSrc.includes('?') ? '&' : '?') + 'w=1200&q=90';
    }
  }
  
  return (
    <img
      src={finalSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  );
}

interface PortfolioProps {
  portfolio: AppContent['portfolio'];
  theme: AppContent['theme'];
  header?: AppContent['portfolioHeader'];
}

export default function Portfolio({ portfolio, header }: PortfolioProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  
  const targetOffsetRef = useRef(0);
  const currentOffsetRef = useRef(0);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const lastInteractionRef = useRef(Date.now());
  const lastCenteredIndexRef = useRef(-1);
  const pausedUntilRef = useRef(0);

  const resetInteraction = () => {
    lastInteractionRef.current = Date.now();
    const len = portfolio.length;
    if (len > 0) {
      const roundedOffset = Math.floor(currentOffsetRef.current / len) * len;
      currentOffsetRef.current -= roundedOffset;
      targetOffsetRef.current -= roundedOffset;
      lastCenteredIndexRef.current = Math.round(currentOffsetRef.current);
    }
  };

  // Handle window width for responsive layout
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive dimensions for 3D layout
  const getCardWidth = () => {
    if (windowWidth < 640) return 170;
    if (windowWidth < 768) return 240;
    if (windowWidth < 1024) return 270;
    return 310;
  };

  const getCardHeight = () => {
    if (windowWidth < 640) return 240;
    if (windowWidth < 768) return 330;
    if (windowWidth < 1024) return 360;
    return 420;
  };

  const getRadius = () => {
    if (windowWidth < 640) return 190;
    if (windowWidth < 768) return 290;
    if (windowWidth < 1024) return 370;
    return 460;
  };

  const cardWidth = getCardWidth();
  const cardHeight = getCardHeight();
  const radius = getRadius();

  // Smooth inertial render loop
  useEffect(() => {
    if (!portfolio || portfolio.length === 0) return;
    let rId: number;
    let lastTime = performance.now();

    const updateCardStyles = (offset: number) => {
      portfolio.forEach((_, idx) => {
        const card = cardsRef.current[idx];
        if (!card) return;

        const theta = (idx - offset) * (2 * Math.PI / portfolio.length);
        const cosVal = Math.cos(theta);
        const sinVal = Math.sin(theta);

        const tx = sinVal * radius;
        const tz = cosVal * (radius * 0.82); 
        const ry = theta * (180 / Math.PI); 

        const scale = 0.65 + 0.35 * ((cosVal + 1) / 2);
        const opacity = cosVal < -0.3 ? 0 : 0.15 + 0.85 * ((cosVal + 1) / 2);
        const zIndex = Math.round((cosVal + 1) * 100);
        const isActiveElement = cosVal > 0.45;

        // Custom curve that lifts the element near the center (cosVal approaches 1)
        const liftFactor = Math.pow(Math.max(0, cosVal), 8); 
        const ty = -30 * liftFactor; // lift up by 30px at center peak

        card.style.transform = `translate3d(-50%, -50%, 0px) translate3d(${tx}px, ${ty}px, ${tz}px) rotateY(${ry}deg) scale3d(${scale}, ${scale}, 1)`;
        card.style.opacity = String(opacity);
        card.style.zIndex = String(zIndex);
        card.style.pointerEvents = isActiveElement ? 'auto' : 'none';
        
        card.style.transition = 'transform 120ms cubic-bezier(0.16, 1, 0.3, 1), opacity 120ms cubic-bezier(0.16, 1, 0.3, 1)';
        
        const isCurrentActive = idx === activeIdx;
        if (isCurrentActive) {
          card.classList.add('border-blue-500/65', 'shadow-2xl', 'shadow-blue-500/20');
          card.classList.remove('border-white/5', 'shadow-lg');
        } else {
          card.classList.remove('border-blue-500/65', 'shadow-2xl', 'shadow-blue-500/20');
          card.classList.add('border-white/5', 'shadow-lg');
        }
      });
    };

    const mainLoop = (time: number) => {
      const dtMs = time - lastTime;
      lastTime = time;

      const dt = Math.min(3, dtMs / 16.666);
      const now = Date.now();
      const timeSinceInteraction = now - lastInteractionRef.current;

      if (timeSinceInteraction > 3500) {
        if (now < pausedUntilRef.current) {
          // Stay 1 second! Keep currentOffset stationary
        } else {
          // Auto-spin beautifully and continuously with pristine inertial momentum
          const speed = 0.005;
          const nextOffset = currentOffsetRef.current + speed * dt;
          
          const nearestInteger = Math.round(nextOffset);
          // Check if we approach the nearest integer very closely and haven't paused for it yet
          if (nearestInteger !== lastCenteredIndexRef.current && 
              Math.abs(nextOffset - nearestInteger) < speed * dt * 1.5) {
            
            // Snap perfectly to the exact center to keep it aligned during the dwell
            currentOffsetRef.current = nearestInteger;
            targetOffsetRef.current = nearestInteger;
            pausedUntilRef.current = now + 1000; // pause for 1 second
            lastCenteredIndexRef.current = nearestInteger;
          } else {
            currentOffsetRef.current = nextOffset;
            targetOffsetRef.current = currentOffsetRef.current;
          }
        }
      } else {
        // Return/interpolate cleanly with inert ease to user's clicked page
        const diff = targetOffsetRef.current - currentOffsetRef.current;
        currentOffsetRef.current += diff * 0.08 * dt;
      }

      updateCardStyles(currentOffsetRef.current);

      const rounded = Math.round(currentOffsetRef.current);
      const computedActiveIdx = ((rounded % portfolio.length) + portfolio.length) % portfolio.length;

      if (computedActiveIdx !== activeIdx) {
        setActiveIdx(computedActiveIdx);
      }

      rId = requestAnimationFrame(mainLoop);
    };

    rId = requestAnimationFrame(mainLoop);
    return () => {
      if (rId) cancelAnimationFrame(rId);
    };
  }, [portfolio.length, radius, activeIdx]);

  // Next / Prev triggers
  const handleNext = () => {
    resetInteraction();
    const currentRound = Math.round(currentOffsetRef.current);
    targetOffsetRef.current = currentRound + 1;
  };

  const handlePrev = () => {
    resetInteraction();
    const currentRound = Math.round(currentOffsetRef.current);
    targetOffsetRef.current = currentRound - 1;
  };

  // Safe dot navigation
  const handleDotClick = (idx: number) => {
    resetInteraction();
    const currentRound = Math.round(currentOffsetRef.current);
    const currentBase = Math.floor(currentRound / portfolio.length) * portfolio.length;
    let candidate = currentBase + idx;
    if (Math.abs(candidate - currentOffsetRef.current) > portfolio.length / 2) {
      if (candidate > currentOffsetRef.current) {
        candidate -= portfolio.length;
      } else {
        candidate += portfolio.length;
      }
    }
    targetOffsetRef.current = candidate;
  };

  if (!portfolio || portfolio.length === 0) {
    return (
      <section id="portfolio" className="py-24 text-center text-slate-400">
        No projects available in portfolio.
      </section>
    );
  }

  return (
    <section 
      id="portfolio" 
      ref={sectionRef}
      className="py-24 px-0 bg-slate-950/20 backdrop-blur-3xl border-t border-slate-900 overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h2 id="portfolio-header-title" className="text-3xl md:text-5xl font-glass text-white tracking-wider mt-2 uppercase">
              {header?.title || "Featured Portfolio"}
            </h2>
            <p id="portfolio-header-subtitle" className="text-slate-400 mt-2 max-w-xl">
              {header?.description || "Experience our latest designs in a continuously spinning 3D carousel. Use the navigation buttons and status indicators below to orbit between creations with smooth inertial physics."}
            </p>
          </div>
          
          {/* Controls */}
          <div id="portfolio-controls-bar" className="flex items-center gap-3 text-white">
            <button 
              id="portfolio-control-btn-prev"
              onClick={handlePrev}
              className="p-3.5 rounded-full border border-slate-800 bg-slate-900/60 hover:border-slate-600 transition-colors cursor-pointer"
            >
              <Icons.ArrowLeft className="w-5 h-5" />
            </button>
            <span id="portfolio-index-counter" className="text-sm font-mono text-slate-500 min-w-[50px] text-center">
              {String(activeIdx + 1).padStart(2, '0')} / {String(portfolio.length).padStart(2, '0')}
            </span>
            <button 
              id="portfolio-control-btn-next"
              onClick={handleNext}
              className="p-3.5 rounded-full border border-slate-800 bg-slate-900/60 hover:border-slate-600 transition-colors cursor-pointer"
            >
              <Icons.ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3D Immersive Cylinder Container */}
      <div 
        id="portfolio-horizontal-viewport" 
        style={{ 
          height: `${cardHeight + 60}px`,
        }}
        className="relative w-full overflow-visible flex items-center justify-center cursor-default [perspective:2000px]"
      >
        <div 
          id="portfolio-3d-stage"
          style={{
            transformStyle: 'preserve-3d',
            width: '100%',
            height: '100%',
            position: 'relative'
          }}
        >
          {portfolio.map((project, idx) => {
            // Initial positioning (will be overridden on first requestAnimationFrame update instantly)
            const theta = idx * (2 * Math.PI / portfolio.length);
            const cosVal = Math.cos(theta);
            const sinVal = Math.sin(theta);
            const tx = sinVal * radius;
            const tz = cosVal * (radius * 0.82); 
            const ry = theta * (180 / Math.PI); 
            const scale = 0.65 + 0.35 * ((cosVal + 1) / 2);
            const opacity = cosVal < -0.3 ? 0 : 0.15 + 0.85 * ((cosVal + 1) / 2);
            const zIndex = Math.round((cosVal + 1) * 100);
            const isActiveElement = cosVal > 0.45;
            const pointerEvents = isActiveElement ? ('auto' as const) : ('none' as const);

              const isActive = idx === activeIdx;

              return (
                <div 
                  key={project.id}
                  ref={(el) => { if (cardsRef.current) cardsRef.current[idx] = el; }}
                  id={`portfolio-card-${project.id}`}
                  style={{ 
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: `${cardWidth}px`,
                    height: `${cardHeight}px`,
                    transform: `translate3d(-50%, -50%, 0px) translate3d(${tx}px, 0px, ${tz}px) rotateY(${ry}deg) scale3d(${scale}, ${scale}, 1)`,
                    opacity: opacity,
                    zIndex: zIndex,
                    pointerEvents: pointerEvents,
                    willChange: 'transform, opacity',
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden'
                  }}
                  className={`rounded-[1.5rem] md:rounded-[2rem] border overflow-hidden flex flex-col justify-end group transition-all duration-300 ${
                    isActive 
                      ? 'border-white/50 shadow-[0_0_50px_rgba(255,255,255,0.18)] bg-white/5' 
                      : 'border-white/10 shadow-lg bg-black/20'
                  }`}
                >
                  {/* Full-bleed Background Image with dynamic highlight */}
                  <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                    <PortfolioCardImage
                      src={project.image}
                      alt={project.title}
                      className={`w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[2500ms] ${
                        isActive 
                          ? 'brightness-100 contrast-[1.05] saturate-[1.05]' 
                          : 'brightness-[0.45] contrast-[0.95]'
                      }`}
                    />
                    {/* Dynamic card gradient overlay - clean bottom vignette only on active card, heavy dark dimming on inactive cards */}
                    <div className={`absolute inset-0 transition-opacity duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-t from-black/50 via-transparent to-transparent' 
                        : 'bg-gradient-to-t from-black/80 via-black/40 to-transparent'
                    }`} />
                  </div>

                  {/* White Text Overlays - Beautiful Frosted Glass text panel overlay */}
                  <div className="relative z-10 p-6 sm:p-8 bg-black/40 backdrop-blur-[16px] border-t border-white/10 w-full pointer-events-none rounded-b-[1.5rem] md:rounded-[2rem]">
                    <div className="space-y-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                        {project.title}
                      </h3>
                      <p className="text-white text-xs sm:text-sm leading-relaxed opacity-90 font-light line-clamp-3">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Quick Dot Slide Indicators */}
        <div id="portfolio-dots-slider" className="flex items-center justify-center gap-2 pt-6">
          {portfolio.map((_, idx) => (
            <button
              key={idx}
              id={`portfolio-dot-tab-${idx}`}
              onClick={() => handleDotClick(idx)}
              className={`h-1.5 rounded-full transition-all duration-350 cursor-pointer ${
                activeIdx === idx 
                  ? 'w-7 bg-blue-500' 
                  : 'w-1.5 bg-slate-800 hover:bg-slate-650'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
