import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppContent } from '../types';

interface HeroProps {
  content: AppContent['hero'];
  theme: AppContent['theme'];
  siteName: string;
  isLoggedIn: boolean;
  onStartProject: () => void;
}

export default function Hero({ content, theme, siteName, isLoggedIn, onStartProject }: HeroProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 1. Double check the headline parts and partition it dynamically into 3 logical line items
  const headlineParts = useMemo(() => {
    const raw = content.headline || "We Build Websites That Grow Your Business";
    const words = raw.trim().split(/\s+/);
    if (words.length <= 2) {
      return [words[0] || "", words[1] || "", ""];
    }
    const totalWords = words.length;
    // Divide roughly into thirds
    const part1Size = Math.max(1, Math.floor(totalWords / 3));
    const part2Size = Math.max(1, Math.floor((totalWords - part1Size) / 2));

    const line1 = words.slice(0, part1Size).join(" ");
    const line2 = words.slice(part1Size, part1Size + part2Size).join(" ");
    const line3 = words.slice(part1Size + part2Size).join(" ");

    return [line1, line2, line3];
  }, [content.headline]);

  // 2. High fidelity scrolling offset calculations
  const scrollToSection = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const elementRect = element.getBoundingClientRect();
      const absoluteElementY = elementRect.top + window.scrollY - 80;
      if (typeof (window as any).__triggerInertiaScroll === 'function') {
        (window as any).__triggerInertiaScroll(absoluteElementY);
      } else {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-between pt-6 pb-12 px-6 overflow-hidden hero-section-container">
      {/* 3. Imbedded Custom Scoped Modern CSS Style Sheet */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&display=swap');

        :root {
          --text: hsl(0, 0%, 99%);
          --textDim: hsl(0, 0%, 60%);
          --background: hsl(0, 0%, 7%);
          --primary: hsl(217, 100%, 65%);
          --primaryBg: hsla(217, 100%, 65%, 2%);
          --primaryHi: hsla(217, 100%, 75%, 25%);
          --primaryFg: hsl(205, 100%, 85%);
          --secondary: hsl(315, 60%, 20%);
          --secondaryFg: hsl(315, 80%, 75%);
          --secondaryBg: hsla(315, 60%, 20%, 5%);
          --secondaryHi: hsla(315, 60%, 30%, 50%);
          --accent: hsl(328, 100%, 65%);
          --accentBg: hsla(328, 100%, 65%, 2%);
          --accentHi: hsla(328, 100%, 70%, 25%);
        }

        .hero-section-container {
          font-family: 'Manrope', sans-serif !important;
          background-color: var(--background);
          color: var(--text);
        }

        .hero-nav {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 2rem;
          color: var(--textDim);
          width: 100%;
          box-sizing: border-box;
          z-index: 9999;
        }

        .menu-item:hover {
          color: var(--text);
          cursor: pointer;
        }

        .sitename {
          font-weight: 800;
          color: var(--text);
        }

        .grid-bg-container {
          position: absolute;
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          align-self: center;
          z-index: 1;
          pointer-events: none;
          top: 0;
          left: 0;
        }

        .grid-svg {
          height: 80%;
          width: 80%;
          position: relative;
          z-index: 1;
        }

        .hero-glow-blur {
          height: 22rem;
          width: 22rem;
          background: radial-gradient(circle, hsl(217, 100%, 65%) 0%, hsl(328, 100%, 55%) 70%);
          filter: blur(130px);
          border-radius: 9999px;
          z-index: 0;
          position: absolute;
          opacity: 0.55;
        }

        .title-display {
          font-size: 8rem;
          font-weight: 800;
          letter-spacing: -0.4rem;
          display: flex;
          flex-direction: column;
          position: relative;
          justify-content: center;
          align-items: center;
          margin-top: auto;
          margin-bottom: auto;
          z-index: 10;
          pointer-events: none;
          user-select: none;
          text-align: center;
          width: 100%;
          max-width: 1200px;
        }

        .title-display > p {
          margin: 0;
          line-height: 8.2rem;
          width: auto;
        }

        .title-display > p:nth-child(1) {
          align-self: flex-start;
          text-align: left;
          padding-left: 5%;
        }

        .title-display > p:nth-child(2) {
          color: var(--primary);
          align-self: center;
          text-align: center;
        }

        .title-display > p:nth-child(3) {
          align-self: flex-end;
          text-align: right;
          padding-right: 5%;
        }

        .material-icons-trigger {
          display: none;
          fill: var(--text);
          cursor: pointer;
        }

        .button {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: absolute;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
          height: 50px;
          width: 160px;
          z-index: 40;
        }

        .interactive-shape-btn {
          height: 50px;
          width: 160px;
          clip-path: path("M 0 25 C 0 -5, -5 0, 80 0 S 160 -5, 160 25, 165 50 80 50, 0 55, 0 25");
          border: none;
          border-radius: 13px;
          background-color: var(--primaryBg);
          box-shadow: 0px -3px 15px 0px var(--primaryHi) inset;
          color: var(--primaryFg);
          font-family: "Manrope", sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: absolute;
          transform: translateY(0px);
          transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s ease;
          cursor: pointer;
        }

        .btn-ambient-glow {
          width: 100px;
          height: 60px;
          background-color: var(--primaryHi);
          border-radius: 100%;
          filter: blur(20px);
          position: absolute;
          bottom: -50%;
          transition: opacity 0.25s ease;
          opacity: 0.3;
        }

        .button:hover > .btn-ambient-glow {
          opacity: 0.8;
        }

        .button:hover > .interactive-shape-btn {
          transform: translateY(5px);
        }

        .button.first {
          top: 15%;
          right: 20%;
        }

        .button.sec {
          bottom: 15%;
          right: 12%;
        }

        .button.sec > .interactive-shape-btn {
          background-color: var(--accentBg);
          box-shadow: 0px -3px 15px 0px var(--accentHi) inset;
          color: var(--accentFg);
        }

        .button.sec > .btn-ambient-glow {
          background-color: var(--accentHi);
        }

        .button.third {
          bottom: 27%;
          left: 15%;
        }

        .button.third > .interactive-shape-btn {
          background-color: var(--secondaryBg);
          box-shadow: 0px -3px 15px 0px var(--secondary) inset;
          color: var(--secondaryFg);
        }

        .button.third > .btn-ambient-glow {
          background-color: var(--secondaryHi);
        }

        .top-right {
          position: absolute;
          top: 0;
          right: 0;
          z-index: 2;
          opacity: 0.5;
          pointer-events: none;
        }

        .bottom-left {
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 2;
          opacity: 0.5;
          pointer-events: none;
        }

        @media screen and (max-width: 1100px) {
          .title-display {
            font-size: 5rem;
            letter-spacing: -0.2rem;
            padding: 0 1rem;
          }
          
          .title-display > p {
            line-height: 5.5rem;
            align-self: center !important;
            text-align: center !important;
            padding: 0 !important;
          }
          
          .hero-nav > :not(.sitename, .material-icons-trigger) {
            display: none;
          }
          
          .hero-nav {
            justify-content: space-between;
          }
          
          .material-icons-trigger {
            display: flex;
            align-items: center;
          }

          .hero-buttons-container {
            position: relative !important;
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            gap: 1.5rem !important;
            justify-content: center !important;
            align-items: center !important;
            margin-top: 2rem !important;
            margin-bottom: 2rem !important;
            z-index: 40 !important;
            width: 100% !important;
            height: auto !important;
            top: auto !important;
            bottom: auto !important;
            left: auto !important;
            right: auto !important;
          }

          .button.first, .button.sec, .button.third {
            position: relative !important;
            top: auto !important;
            bottom: auto !important;
            left: auto !important;
            right: auto !important;
            margin: 0 !important;
          }
        }

        @media screen and (max-width: 640px) {
          .title-display {
            font-size: 3.5rem;
            letter-spacing: -0.15rem;
          }
          .title-display > p {
            line-height: 4rem;
          }
        }
      `}</style>

      {/* 4. Inline Header Navigation Area inside Hero */}
      <nav className="hero-nav w-full max-w-7xl mx-auto flex items-center justify-between h-16 z-50">
        <a 
          href="/" 
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="sitename text-xl tracking-[0.1em] hover:opacity-80 transition-opacity"
        >
          {siteName || "CoolSite"}
        </a>

        <div className="flex items-center gap-8 text-xs font-bold tracking-widest uppercase">
          <p className="menu-item transition-all duration-300" onClick={(e) => scrollToSection("services", e)}>Services</p>
          <p className="menu-item transition-all duration-300" onClick={(e) => scrollToSection("portfolio", e)}>Portfolio</p>
          <p className="menu-item transition-all duration-300" onClick={(e) => scrollToSection("why-choose-us", e)}>Features</p>
          <p className="menu-item transition-all duration-300" onClick={(e) => scrollToSection("contact", e)}>About us</p>
        </div>

        {/* Hamburger trigger for mobile viewports */}
        <div 
          className="material-icons-trigger lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6 stroke-white fill-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </div>
      </nav>

      {/* 5. Fluid Grid Vector Backdrop & Blurred Blob */}
      <div className="grid-bg-container">
        <svg className="grid-svg mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 982 786" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M490 401V537H348.5V401H490ZM490 785.5V676H348.5V785.5H347.5V676H206V785.5H205V676H63.5V785.5H62.5V676H0V675H62.5V538H0V537H62.5V401H0V400H62.5V258H0V257H62.5V116H0V115H62.5V0H63.5V115L205 115V0H206V115L347.5 115V0H348.5V115H490V0H491V115L627.5 115V0H628.5V115H765V0H766V115L902.5 115V0H903.5V115H982V116H903.5V257H982V258H903.5V400H982V401H903.5V537H982V538H903.5V675H982V676H903.5V785.5H902.5V676H766V785.5H765V676H628.5V785.5H627.5V676H491V785.5H490ZM902.5 675V538H766V675H902.5ZM902.5 537V401H766V537H902.5ZM902.5 400V258H766V400H902.5ZM902.5 257V116L766 116V257H902.5ZM627.5 675H491V538H627.5V675ZM765 675H628.5V538H765V675ZM348.5 675H490V538H348.5V675ZM347.5 538V675H206V538H347.5ZM205 538V675H63.5V538H205ZM765 537V401H628.5V537H765ZM765 400V258H628.5V400H765ZM765 257V116H628.5V257H765ZM347.5 401V537H206V401H347.5ZM205 401V537H63.5V401H205ZM627.5 401V537H491V401H627.5ZM627.5 116L491 116V257H627.5V116ZM627.5 258H491V400H627.5V258ZM63.5 257V116L205 116V257H63.5ZM63.5 400V258H205V400H63.5ZM206 116V257H347.5V116L206 116ZM348.5 116V257H490V116H348.5ZM206 400V258H347.5V400H206ZM348.5 258V400H490V258H348.5Z" fill="url(#paint0_radial_1_8)" />
          <defs>
            <radialGradient id="paint0_radial_1_8" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(491 392.75) rotate(90) scale(513.25 679.989)">
              <stop stopColor="white" stopOpacity="0.2" />
              <stop offset="1" stopColor="#000" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        <div className="hero-glow-blur"></div>
      </div>

      {/* 6. Abstract Frame Decoration Elements */}
      <svg className="top-right" width="219" height="147" viewBox="0 0 219 147" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect opacity="0.18" x="10.4252" y="75.8326" width="7.50168" height="7.50168" transform="rotate(110.283 10.4252 75.8326)" fill="#686868" stroke="white" strokeWidth="1.22683" />
        <rect opacity="0.18" x="180.869" y="138.825" width="7.50168" height="7.50168" transform="rotate(110.283 180.869 138.825)" fill="#686868" stroke="white" strokeWidth="1.22683" />
        <rect x="69.4713" y="-91.84" width="180.485" height="180.485" transform="rotate(20.2832 69.4713 -91.84)" stroke="white" strokeOpacity="0.1" strokeWidth="1.22683" />
      </svg>

      <svg className="bottom-left" width="232" height="191" viewBox="0 0 232 191" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50.5685" cy="172.432" r="112.068" stroke="white" strokeOpacity="0.09" />
        <g opacity="0.1">
          <path d="M26.4932 5.20547L228.856 172.432" stroke="#D9D9D9" />
          <rect x="22.4384" y="0.5" width="6.15753" height="6.15753" fill="#686868" stroke="white" />
          <rect x="224.801" y="169.027" width="6.15753" height="6.15753" fill="#686868" stroke="white" />
          <circle cx="121.819" cy="83.613" r="1.7774" fill="#323232" stroke="white" />
        </g>
      </svg>

      {/* 7. Dynamic Splitted Showcase Headline */}
      <div className="title-display">
        <p className="animate-fade-in-up">{headlineParts[0]}</p>
        <p className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>{headlineParts[1]}</p>
        <p className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>{headlineParts[2]}</p>
      </div>

      {/* 8. Interactive Shape Buttons with custom masks and glow backdrops */}
      <div className="hero-buttons-container">
        {/* First Absolute Button: Primary CTA */}
        <div className="button first" onClick={onStartProject}>
          <div className="interactive-shape-btn">
            Start Project
          </div>
          <span className="btn-ambient-glow"></span>
        </div>

        {/* Second Absolute Button: Secondary Portfolio Scroll */}
        <div className="button sec" onClick={(e) => scrollToSection("portfolio", e)}>
          <div className="interactive-shape-btn">
            View Work
          </div>
          <span className="btn-ambient-glow"></span>
        </div>

        {/* Third Absolute Button: Interactive Contact form Scroll */}
        <div className="button third" onClick={(e) => scrollToSection("contact", e)}>
          <div className="interactive-shape-btn">
            Connect
          </div>
          <span className="btn-ambient-glow"></span>
        </div>
      </div>

      {/* 9. Mobile slide-down menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 bg-slate-950/95 backdrop-blur-2xl border-b border-slate-900 py-6 px-6 flex flex-col gap-4 z-40 lg:hidden text-center"
          >
            <p className="text-sm font-bold text-slate-300 hover:text-white uppercase tracking-wider py-2 cursor-pointer" onClick={(e) => scrollToSection("services", e)}>Services</p>
            <p className="text-sm font-bold text-slate-300 hover:text-white uppercase tracking-wider py-2 cursor-pointer" onClick={(e) => scrollToSection("portfolio", e)}>Portfolio</p>
            <p className="text-sm font-bold text-slate-300 hover:text-white uppercase tracking-wider py-2 cursor-pointer" onClick={(e) => scrollToSection("why-choose-us", e)}>Features</p>
            <p className="text-sm font-bold text-slate-300 hover:text-white uppercase tracking-wider py-2 cursor-pointer" onClick={(e) => scrollToSection("contact", e)}>About us</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
