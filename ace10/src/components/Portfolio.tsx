import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { AppContent } from '../types';

interface PortfolioProps {
  portfolio: AppContent['portfolio'];
  theme: AppContent['theme'];
}

export default function Portfolio({ portfolio, theme }: PortfolioProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(0); // 1 = down/next, -1 = up/prev

  // Safety fallback if empty
  if (!portfolio || portfolio.length === 0) {
    return (
      <section id="portfolio" className="py-24 text-center text-slate-400">
        No projects available in portfolio.
      </section>
    );
  }

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCardWidth = () => {
    if (windowWidth < 640) return 295;
    if (windowWidth < 768) return 360;
    if (windowWidth < 1024) return 400;
    return 440; // Desktop width
  };

  const getGap = () => 24;

  const cardWidth = getCardWidth();
  const gap = getGap();

  // Safety fallback if empty
  if (!portfolio || portfolio.length === 0) {
    return (
      <section id="portfolio" className="py-24 text-center text-slate-400">
        No projects available in portfolio.
      </section>
    );
  }

  const currentProject = portfolio[activeIdx] || portfolio[0];

  const handleNext = () => {
    setDirection(1);
    setActiveIdx((prev) => (prev + 1) % portfolio.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIdx((prev) => (prev - 1 + portfolio.length) % portfolio.length);
  };

  // Translate offset inline
  const translateX = activeIdx * (cardWidth + gap);

  return (
    <section id="portfolio" className="py-28 px-6 md:px-12 bg-slate-950/20 backdrop-blur-3xl border-t border-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 id="portfolio-header-title" className="text-3xl md:text-5xl font-glass text-white tracking-wider mt-2 uppercase">
              Featured Portfolio
            </h2>
            <p id="portfolio-header-subtitle" className="text-slate-400 mt-2 max-w-xl">
              Explore live previews of our latest digital products. Switch through the inline horizontal slideshow preview below to witness layout precision.
            </p>
          </div>
          
          {/* Controls */}
          <div id="portfolio-controls-bar" className="flex items-center gap-3">
            <button 
              id="portfolio-control-btn-prev"
              onClick={handlePrev}
              className="p-4 rounded-full border border-slate-800 bg-slate-900/60 hover:border-slate-600 text-white transition-colors cursor-pointer"
            >
              <Icons.ArrowLeft className="w-5 h-5" />
            </button>
            <span id="portfolio-index-counter" className="text-sm font-mono text-slate-500">
              {String(activeIdx + 1).padStart(2, '0')} / {String(portfolio.length).padStart(2, '0')}
            </span>
            <button 
              id="portfolio-control-btn-next"
              onClick={handleNext}
              className="p-4 rounded-full border border-slate-800 bg-slate-900/60 hover:border-slate-600 text-white transition-colors cursor-pointer"
            >
              <Icons.ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Sideshow Block - Inline Horizontally */}
        <div id="portfolio-horizontal-viewport" className="relative w-full overflow-hidden py-4">
          <div 
            id="portfolio-slider-track"
            className="flex transition-transform duration-500 ease-out"
            style={{ 
              transform: `translateX(-${translateX}px) translateZ(0)`,
              willChange: 'transform',
              gap: `${gap}px`
            }}
          >
            {portfolio.map((project, idx) => {
              const isActive = idx === activeIdx;
              return (
                <div 
                  key={project.id}
                  id={`portfolio-card-${project.id}`}
                  style={{ width: `${cardWidth}px` }}
                  className={`shrink-0 rounded-[2rem] border overflow-hidden bg-slate-900/40 backdrop-blur-md transition-all duration-500 flex flex-col group h-[480px] sm:h-[500px] ${
                    isActive 
                      ? 'border-blue-500/50 shadow-2xl shadow-blue-500/10 scale-100 opacity-100' 
                      : 'border-slate-900 opacity-40 scale-95 hover:opacity-75 hover:border-slate-800'
                  }`}
                >
                  {/* Image container with Category overlay */}
                  <div className="relative w-full h-[58%] overflow-hidden">
                    <img
                      src={project.image || 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=400&auto=format&fit=crop'}
                      alt={project.title}
                      className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[2000ms] brightness-90 group-hover:brightness-100"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Category floating badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-slate-950/80 backdrop-blur-md text-blue-400 border border-blue-500/30 text-xs font-mono rounded-lg font-bold">
                        {project.category || 'Digital Ecosystem'}
                      </span>
                    </div>

                    {/* Dark gradient overlap inside simulated viewport screen */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Body content with details */}
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div className="space-y-2">
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                        {project.description}
                      </p>
                    </div>

                    {/* Footer specs and real-time navigation link */}
                    <div className="border-t border-slate-850/60 pt-4 flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-slate-500">INTERFACE TECH</span>
                        <span className="text-xs font-semibold text-slate-300">React SPA / Tailwind CSS</span>
                      </div>
                      
                      {project.webUrl && (
                        <a
                          href={project.webUrl}
                          target="_blank"
                          rel="noreferrer"
                          id={`portfolio-btn-link-${project.id}`}
                          className="px-4 py-2 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-100 transition-all text-xs flex items-center gap-1.5 shadow-lg group-hover:-translate-y-0.5"
                        >
                          <span>Live Link</span>
                          <Icons.ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Dot Slide Indicators */}
        <div id="portfolio-dots-slider" className="flex items-center justify-center gap-2 pt-8">
          {portfolio.map((_, idx) => (
            <button
              key={idx}
              id={`portfolio-dot-tab-${idx}`}
              onClick={() => {
                setDirection(idx > activeIdx ? 1 : -1);
                setActiveIdx(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${activeIdx === idx ? 'w-8 bg-blue-500' : 'w-2 bg-slate-800 hover:bg-slate-600'}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
