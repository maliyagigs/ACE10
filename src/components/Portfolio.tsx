import React, { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import { AppContent } from '../types';

interface PortfolioProps {
  portfolio: AppContent['portfolio'];
  theme: AppContent['theme'];
}

export default function Portfolio({ portfolio }: PortfolioProps) {
  const [targetOffset, setTargetOffset] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const targetOffsetRef = useRef(0);
  const currentOffsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  const dragStartX = useRef(0);
  const dragStartOffset = useRef(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Sync state values with refs for zero-rendering background threads
  useEffect(() => {
    targetOffsetRef.current = targetOffset;
  }, [targetOffset]);

  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  // Fallback safety
  if (!portfolio || portfolio.length === 0) {
    return (
      <section id="portfolio" className="py-24 text-center text-slate-400">
        No projects available in portfolio.
      </section>
    );
  }

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

  // Smooth interpolation loop (zero-re-render inert slider)
  useEffect(() => {
    let rId: number;

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

        // Apply hardware accelerated direct style mutations
        card.style.transform = `translate3d(-50%, -50%, 0px) translate3d(${tx}px, 0px, ${tz}px) rotateY(${ry}deg) scale3d(${scale}, ${scale}, 1)`;
        card.style.opacity = String(opacity);
        card.style.zIndex = String(zIndex);
        card.style.pointerEvents = isActiveElement ? 'auto' : 'none';
        
        // Setup transition speeds
        card.style.transition = isDraggingRef.current ? 'none' : 'transform 150ms cubic-bezier(0.16, 1, 0.3, 1), opacity 150ms cubic-bezier(0.16, 1, 0.3, 1)';
        
        // Active border matching active index cleanly via class mutations
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

    const lerp = () => {
      const diff = targetOffsetRef.current - currentOffsetRef.current;
      if (Math.abs(diff) < 0.0001) {
        currentOffsetRef.current = targetOffsetRef.current;
      } else {
        currentOffsetRef.current += diff * 0.12;
      }

      updateCardStyles(currentOffsetRef.current);

      const rounded = Math.round(currentOffsetRef.current);
      const computedActiveIdx = ((rounded % portfolio.length) + portfolio.length) % portfolio.length;

      if (computedActiveIdx !== activeIdx) {
        setActiveIdx(computedActiveIdx);
      }

      rId = requestAnimationFrame(lerp);
    };

    rId = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(rId);
  }, [portfolio.length, radius, activeIdx]);

  // Non-passive wheel event interceptor to lock and spin
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let totalAccumulatedDelta = 0;

    const handleWheel = (e: WheelEvent) => {
      // Small threshold filter
      if (Math.abs(e.deltaY) < 3) return;

      const isScrollingDown = e.deltaY > 0;
      
      // Calculate normalized current index to lock between [0, portfolio.length - 1]
      // Once it completes, we unlock page scroll to let user proceed
      if (isScrollingDown) {
        if (targetOffset < portfolio.length - 1) {
          e.preventDefault();
          // Scale scrolling increments nicely
          const increment = Math.min(0.25, Math.abs(e.deltaY) * 0.0015);
          setTargetOffset((prev) => Math.min(portfolio.length - 0.9, prev + increment));
        }
      } else {
        if (targetOffset > 0) {
          e.preventDefault();
          const decrement = Math.min(0.25, Math.abs(e.deltaY) * 0.0015);
          setTargetOffset((prev) => Math.max(0, prev - decrement));
        }
      }
    };

    section.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      section.removeEventListener('wheel', handleWheel);
    };
  }, [portfolio.length, targetOffset]);

  // Pointer drag gestures
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartOffset.current = targetOffset;
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX.current;
    const sensitivity = windowWidth < 768 ? 0.004 : 0.0025;
    const newOffset = dragStartOffset.current - dx * sensitivity;
    setTargetOffset(newOffset);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    // Snap cleanly to nearest integer index
    setTargetOffset((prev) => Math.round(prev));
  };

  // Next / Prev triggers
  const handleNext = () => {
    setTargetOffset((prev) => Math.round(prev) + 1);
  };

  const handlePrev = () => {
    setTargetOffset((prev) => Math.round(prev) - 1);
  };

  // Safe dot navigation - finding the closest circular offset matching that index
  const handleDotClick = (idx: number) => {
    const currentRound = Math.round(targetOffset);
    const currentBase = Math.floor(currentRound / portfolio.length) * portfolio.length;
    let candidate = currentBase + idx;
    if (Math.abs(candidate - targetOffset) > portfolio.length / 2) {
      if (candidate > targetOffset) {
        candidate -= portfolio.length;
      } else {
        candidate += portfolio.length;
      }
    }
    setTargetOffset(candidate);
  };

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
              Featured Portfolio
            </h2>
            <p id="portfolio-header-subtitle" className="text-slate-400 mt-2 max-w-xl">
              Spin through our latest designs. Drag left or right, use your scroll wheel inside the area, or use the controls below to discover our work in an immersive 3D cylinder.
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
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ 
          height: `${cardHeight + 60}px`,
        }}
        className="relative w-full overflow-visible flex items-center justify-center cursor-grab active:cursor-grabbing [perspective:2000px]"
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
                className={`rounded-[1.5rem] md:rounded-[2rem] border overflow-hidden bg-slate-900/60 backdrop-blur-2xl flex flex-col group ${
                  idx === activeIdx 
                    ? 'border-blue-500/65 shadow-2xl shadow-blue-500/20' 
                    : 'border-white/5 shadow-lg'
                }`}
              >
                {/* Image container with Category overlay */}
                <div className="relative w-full h-[52%] sm:h-[55%] overflow-hidden">
                  <img
                    src={project.image || 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=400&auto=format&fit=crop'}
                    alt={project.title}
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[2000ms] brightness-90 group-hover:brightness-100"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Category floating badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-slate-950/85 backdrop-blur-md text-blue-400 border border-blue-500/20 text-[10px] font-mono rounded-lg font-extrabold uppercase tracking-wider">
                      {project.category || 'Digital Ecosystem'}
                    </span>
                  </div>

                  {/* Dark gradient overlap */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Body content with details */}
                <div className="p-5 flex flex-col justify-between flex-grow">
                  <div className="space-y-1.5 sm:space-y-2">
                    <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-450 text-xs leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Footer specs and navigation link */}
                  <div className="border-t border-slate-850/60 pt-3 flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono text-slate-500 tracking-wider">INTERFACE TECH</span>
                      <span className="text-[11px] font-semibold text-slate-350">React / Tailwind</span>
                    </div>
                    
                    {project.webUrl && (
                      <a
                        href={project.webUrl}
                        target="_blank"
                        rel="noreferrer"
                        id={`portfolio-btn-link-${project.id}`}
                        className="px-3.5 py-1.5 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-100 transition-all text-xs flex items-center gap-1 shadow-md hover:-translate-y-0.5"
                      >
                        <span>Live Preview</span>
                        <Icons.ExternalLink className="w-3 h-3" />
                      </a>
                    )}
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
