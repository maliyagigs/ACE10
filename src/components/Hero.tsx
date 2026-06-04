import { useEffect, useRef, useState, useMemo } from 'react';
import { animate, stagger } from 'animejs';
import { motion } from 'motion/react';
import { AppContent } from '../types';

interface HeroProps {
  content: AppContent['hero'];
  theme: AppContent['theme'];
  isLoggedIn: boolean;
  onStartProject: () => void;
}

export default function Hero({ content, theme, isLoggedIn, onStartProject }: HeroProps) {
  const heroImageContainerRef = useRef<HTMLDivElement>(null);
  const particlesCanvasRef = useRef<HTMLCanvasElement>(null);

  const text = useMemo(() => {
    const raw = content.headline || "We Build Websites That Grow Your Business";
    return raw.trim().endsWith('.') ? raw.trim() : `${raw.trim()}.`;
  }, [content.headline]);
  
  const [visibleCount, setVisibleCount] = useState(0);

  // Typewriter timing logic
  useEffect(() => {
    setVisibleCount(0);
    const delay = 45; // ms per char
    let current = 0;
    
    const timer = setInterval(() => {
      current++;
      if (current <= text.length) {
        setVisibleCount(current);
      } else {
        clearInterval(timer);
      }
    }, delay);
    
    return () => clearInterval(timer);
  }, [text]);

  const wordObjects = useMemo(() => {
    const words = text.split(' ');
    let currentIndex = 0;
    return words.map((word, wordIdx) => {
      const chars = word.split('').map(char => {
        currentIndex++;
        return {
          char,
          globalIndex: currentIndex
        };
      });
      if (wordIdx < words.length - 1) {
        currentIndex++; // account for space between words
      }
      return {
        word,
        chars
      };
    });
  }, [text]);

  // Floating Hero image background particles emitter
  useEffect(() => {
    const canvas = particlesCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animeId: number;
    let particleArray: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      life: number;
      maxLife: number;
    }> = [];

    const resizeCanvas = () => {
      const rect = heroImageContainerRef.current?.getBoundingClientRect();
      canvas.width = (rect?.width || 500) + 100;
      canvas.height = (rect?.height || 400) + 100;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const colors = [theme.secondaryColor, theme.accentColor, '#ffffff'];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Randomly spawn from the edges of where the image is
      if (Math.random() < 0.2) {
        particleArray.push({
          x: Math.random() * canvas.width,
          y: canvas.height - 20,
          size: Math.random() * 3 + 1.5,
          speedX: (Math.random() - 0.5) * 1.5,
          speedY: -(Math.random() * 1.5 + 0.5),
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 0,
          maxLife: 120
        });
      }

      particleArray.forEach((p, idx) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.life++;

        const alpha = 1 - (p.life / p.maxLife);

        // Render fast halo glow (substitutes slow CPU shadowBlur)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha * 0.22;
        ctx.fill();

        // Render solid particle core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();

        if (p.life >= p.maxLife) {
          particleArray.splice(idx, 1);
        }
      });

      animeId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animeId);
    };
  }, [theme.secondaryColor, theme.accentColor, content.image]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-20 px-6 md:px-12 text-center overflow-hidden">
      <style>{`
        @keyframes typewriterBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .typewriter-cursor {
          animation: typewriterBlink 0.9s step-end infinite;
          will-change: opacity;
        }
      `}</style>
      
      {/* Abstract Glowing Grid Mesh behind Hero */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
        
        {/* Centered Content: Headline, Subheadline and CTAs */}
        <div className="text-center flex flex-col items-center z-10">

          {/* Headline featuring typewriter layout-safe animation */}
          <h1 
            className="text-6xl sm:text-8xl lg:text-9xl font-aloevera font-semibold tracking-wide leading-none mb-6 min-h-[140px] md:min-h-auto text-white mt-4 relative text-center"
          >
            {visibleCount === 0 && (
              <span className="inline-block w-[3px] h-[0.9em] bg-emerald-400 ml-1 translate-y-[0.1em] typewriter-cursor" />
            )}
            {wordObjects.map((wordObj, wordIdx) => {
              const isBusiness = wordObj.word.toLowerCase().replace(/[^a-z]/g, '') === 'business';
              
              return (
                <span key={wordIdx} className="inline-block whitespace-nowrap">
                  {wordObj.chars.map((charObj) => {
                    const isVisible = charObj.globalIndex <= visibleCount;
                    const isGreen = isBusiness || charObj.char === '.';
                    const textColor = isGreen ? 'text-emerald-400' : 'text-white';
                    
                    return (
                      <span 
                        key={charObj.globalIndex} 
                        className={`inline-block transition-opacity duration-100 ${isVisible ? 'opacity-100' : 'opacity-0'} ${textColor}`}
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'translate3d(0,0,0)'
                        }}
                      >
                        {charObj.char}
                        {charObj.globalIndex === visibleCount && visibleCount < text.length && (
                          <span className="inline-block w-[3px] h-[0.9em] bg-emerald-400 ml-0.5 translate-y-[0.1em] typewriter-cursor" />
                        )}
                      </span>
                    );
                  })}
                  {/* Space between words */}
                  {wordIdx < wordObjects.length - 1 && (
                    <span 
                      className={`inline-block ${visibleCount >= wordObj.chars[wordObj.chars.length - 1].globalIndex + 1 ? 'opacity-100' : 'opacity-0'}`}
                    >
                      &nbsp;
                      {visibleCount === wordObj.chars[wordObj.chars.length - 1].globalIndex + 1 && (
                        <span className="inline-block w-[3px] h-[0.9em] bg-emerald-400 -ml-[0.2em] translate-y-[0.1em] typewriter-cursor" />
                      )}
                    </span>
                  )}
                </span>
              );
            })}
            {visibleCount >= text.length && (
              <span className="inline-block w-[3px] h-[0.9em] bg-emerald-400 ml-1 translate-y-[0.1em] typewriter-cursor" />
            )}
          </h1>

          {/* Subheadline description */}
          <p 
            key={content.subheadline}
            className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed mb-10 max-w-2xl mx-auto text-center opacity-0 animate-[fade-in-up_1400ms_cubic-bezier(0.16,1,0.3,1)_forwards] [animation-delay:400ms] subheadline"
          >
            {content.subheadline}
          </p>

          {/* Call to Actions with Anime.js style spring effects */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <motion.button
              onClick={onStartProject}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-full font-bold text-white shadow-xl flex items-center gap-2 relative overflow-hidden group transition-all duration-300 cursor-pointer text-sm font-sans"
              style={{ backgroundColor: theme.secondaryColor }}
            >
              <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              <span>Start Your Project</span>
            </motion.button>
             <motion.a
              href="#portfolio"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('portfolio');
                if (element) {
                  const elementRect = element.getBoundingClientRect();
                  const absoluteElementY = elementRect.top + window.scrollY - 80;
                  if (typeof (window as any).__triggerInertiaScroll === 'function') {
                    (window as any).__triggerInertiaScroll(absoluteElementY);
                  } else {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-full font-bold text-white hover:text-white border border-slate-600 hover:border-slate-300 transition-colors bg-slate-900/40 backdrop-blur-md"
            >
              View Our Work
            </motion.a>
          </div>

          {/* Admin Managed Sub-Images (Underneath CTA section) */}
          {content.subImages && content.subImages.length > 0 && (
            <div className="border-t border-slate-800/60 pt-6 w-full text-center">
              <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 font-semibold text-center">TRUSTED BY LEADING BRANDS</p>
              <div className="flex flex-wrap items-center gap-8 justify-center">
                {content.subImages.map((img) => (
                  <motion.img 
                    key={img.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 0.6, y: 0 }}
                    whileHover={{ opacity: 1, scale: 1.1 }}
                    transition={{ ease: "easeOut" }}
                    src={img.url} 
                    alt={img.alt} 
                    className="h-9 w-auto object-contain rounded-lg filter grayscale opacity-60 hover:grayscale-0 transition-all cursor-pointer border border-slate-800"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
