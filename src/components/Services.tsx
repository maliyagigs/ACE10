import React, { useState, useRef, useEffect } from "react";
import * as Icons from "lucide-react";
import { AppContent } from "../types";

interface ServicesProps {
  services?: any[];
  theme?: any;
  header?: any;
  servicesLab?: any;
}

// Translations structure from the user's code
const I18N = {
  en: {
    "sec.grid": "Shape system",
    "sec.grid.sub": "Six structural variants: orb glass, chamfer cut, neo surface, cinema wide, crystal facet, layered stack.",
    "sec.orbit": "Spotlight deck",
    "sec.orbit.sub": "Four panels in a stable horizontal stage — arrows, dots, keyboard, and swipe.",
    "card.orb.title": "Orb glass",
    "card.orb.text": "Soft pill body with stacked glass and concentric depth cues.",
    "card.chamfer.title": "Chamfer cut",
    "card.chamfer.text": "Precision corners via clip-path — reads sharp on dark UI.",
    "card.brutal.title": "Neo surface",
    "card.brutal.text": "High-contrast rim, hard shadow, and electric accent rail.",
    "card.cinema.title": "Cinema wide",
    "card.cinema.text": "Landscape canvas for metrics, trailers, or dashboard hero tiles.",
    "card.facet.title": "Crystal facet",
    "card.facet.text": "Angular gradient break with prismatic highlight pass.",
    "card.stack.title": "Layered stack",
    "card.stack.text": "Three floating sheets with parallax on hover.",
    "cta.more": "Open",
    "carousel.1t": "Signal",
    "carousel.1d": "Latency budgets and live traces.",
    "carousel.2t": "Mesh",
    "carousel.2d": "Distributed nodes with health rings.",
    "carousel.3t": "Vault",
    "carousel.3d": "Encrypted payloads at rest.",
    "carousel.4t": "Pulse",
    "carousel.4d": "Realtime fan-out to edge regions.",
    "nav.lang": "العربية",
  },
  ar: {
    "sec.grid": "نظام الأشكال",
    "sec.grid.sub": "ستة أنماط: زجاج دائري، قص مائل، سطح صلب، عريض سينمائي، وجه بلوري، طبقات مكدسة.",
    "sec.orbit": "عرض مميز",
    "sec.orbit.sub": "أربع لوحات في مسرح أفقي ثابت — أسهم، نقاط، لوحة مفاتيح، وسحب.",
    "card.orb.title": "زجاج دائري",
    "card.orb.text": "جسم ناعم مع زجاج مكدس وحلقات عمق.",
    "card.chamfer.title": "قص مائل",
    "card.chamfer.text": "زوايا دقيقة عبر clip-path — واضح على الواجهات الداكنة.",
    "card.brutal.title": "سطح صلب",
    "card.brutal.text": "إطار عالي التباين وظل حاد وشريط لوني.",
    "card.cinema.title": "عريض سينمائي",
    "card.cinema.text": "لوحة أفقية للمقاييس أو بطاقات لوحة التحكم.",
    "card.facet.title": "وجه بلوري",
    "card.facet.text": "تدرج زاوي مع لمعان منشوري.",
    "card.stack.title": "طبقات",
    "card.stack.text": "ثلاث طبقات عائمة مع انزياح بسيط عند المرور.",
    "cta.more": "فتح",
    "carousel.1t": "إشارة",
    "carousel.1d": "ميزانيات التأخير والتتبع المباشر.",
    "carousel.2t": "شبكة",
    "carousel.2d": "عقد موزعة مع حلقات صحة.",
    "carousel.3t": "خزنة",
    "carousel.3d": "حمولة مشفرة في السكون.",
    "carousel.4t": "نبض",
    "carousel.4d": "بث لحظي إلى الحافة.",
    "nav.lang": "English",
  },
};

export default function Services({ theme, header, servicesLab }: ServicesProps) {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const touchStartRef = useRef<number | null>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const totalSlides = 4;

  const t = {
    "sec.grid": lang === "en" 
      ? (servicesLab?.secGridTitleEn || I18N.en["sec.grid"]) 
      : (servicesLab?.secGridTitleAr || I18N.ar["sec.grid"]),
    "sec.grid.sub": lang === "en" 
      ? (servicesLab?.secGridSubEn || I18N.en["sec.grid.sub"]) 
      : (servicesLab?.secGridSubAr || I18N.ar["sec.grid.sub"]),
    "sec.orbit": lang === "en" 
      ? (servicesLab?.secOrbitTitleEn || I18N.en["sec.orbit"]) 
      : (servicesLab?.secOrbitTitleAr || I18N.ar["sec.orbit"]),
    "sec.orbit.sub": lang === "en" 
      ? (servicesLab?.secOrbitSubEn || I18N.en["sec.orbit.sub"]) 
      : (servicesLab?.secOrbitSubAr || I18N.ar["sec.orbit.sub"]),
    "cta.more": lang === "en" 
      ? (servicesLab?.ctaMoreEn || I18N.en["cta.more"]) 
      : (servicesLab?.ctaMoreAr || I18N.ar["cta.more"]),
    "nav.lang": lang === "en" ? "العربية" : "English",

    // Cards (0 to 5)
    "card.orb.title": lang === "en" 
      ? (servicesLab?.cards?.[0]?.titleEn || I18N.en["card.orb.title"]) 
      : (servicesLab?.cards?.[0]?.titleAr || I18N.ar["card.orb.title"]),
    "card.orb.text": lang === "en" 
      ? (servicesLab?.cards?.[0]?.textEn || I18N.en["card.orb.text"]) 
      : (servicesLab?.cards?.[0]?.textAr || I18N.ar["card.orb.text"]),

    "card.chamfer.title": lang === "en" 
      ? (servicesLab?.cards?.[1]?.titleEn || I18N.en["card.chamfer.title"]) 
      : (servicesLab?.cards?.[1]?.titleAr || I18N.ar["card.chamfer.title"]),
    "card.chamfer.text": lang === "en" 
      ? (servicesLab?.cards?.[1]?.textEn || I18N.en["card.chamfer.text"]) 
      : (servicesLab?.cards?.[1]?.textAr || I18N.ar["card.chamfer.text"]),

    "card.brutal.title": lang === "en" 
      ? (servicesLab?.cards?.[2]?.titleEn || I18N.en["card.brutal.title"]) 
      : (servicesLab?.cards?.[2]?.titleAr || I18N.ar["card.brutal.title"]),
    "card.brutal.text": lang === "en" 
      ? (servicesLab?.cards?.[2]?.textEn || I18N.en["card.brutal.text"]) 
      : (servicesLab?.cards?.[2]?.textAr || I18N.ar["card.brutal.text"]),

    "card.cinema.title": lang === "en" 
      ? (servicesLab?.cards?.[3]?.titleEn || I18N.en["card.cinema.title"]) 
      : (servicesLab?.cards?.[3]?.titleAr || I18N.ar["card.cinema.title"]),
    "card.cinema.text": lang === "en" 
      ? (servicesLab?.cards?.[3]?.textEn || I18N.en["card.cinema.text"]) 
      : (servicesLab?.cards?.[3]?.textAr || I18N.ar["card.cinema.text"]),

    "card.facet.title": lang === "en" 
      ? (servicesLab?.cards?.[4]?.titleEn || I18N.en["card.facet.title"]) 
      : (servicesLab?.cards?.[4]?.titleAr || I18N.ar["card.facet.title"]),
    "card.facet.text": lang === "en" 
      ? (servicesLab?.cards?.[4]?.textEn || I18N.en["card.facet.text"]) 
      : (servicesLab?.cards?.[4]?.textAr || I18N.ar["card.facet.text"]),

    "card.stack.title": lang === "en" 
      ? (servicesLab?.cards?.[5]?.titleEn || I18N.en["card.stack.title"]) 
      : (servicesLab?.cards?.[5]?.titleAr || I18N.ar["card.stack.title"]),
    "card.stack.text": lang === "en" 
      ? (servicesLab?.cards?.[5]?.textEn || I18N.en["card.stack.text"]) 
      : (servicesLab?.cards?.[5]?.textAr || I18N.ar["card.stack.text"]),

    // Carousel Spotlight (0 to 3)
    "carousel.1t": lang === "en" 
      ? (servicesLab?.carousel?.[0]?.titleEn || I18N.en["carousel.1t"]) 
      : (servicesLab?.carousel?.[0]?.titleAr || I18N.ar["carousel.1t"]),
    "carousel.1d": lang === "en" 
      ? (servicesLab?.carousel?.[0]?.textEn || I18N.en["carousel.1d"]) 
      : (servicesLab?.carousel?.[0]?.textAr || I18N.ar["carousel.1d"]),

    "carousel.2t": lang === "en" 
      ? (servicesLab?.carousel?.[1]?.titleEn || I18N.en["carousel.2t"]) 
      : (servicesLab?.carousel?.[1]?.titleAr || I18N.ar["carousel.2t"]),
    "carousel.2d": lang === "en" 
      ? (servicesLab?.carousel?.[1]?.textEn || I18N.en["carousel.2d"]) 
      : (servicesLab?.carousel?.[1]?.textAr || I18N.ar["carousel.2d"]),

    "carousel.3t": lang === "en" 
      ? (servicesLab?.carousel?.[2]?.titleEn || I18N.en["carousel.3t"]) 
      : (servicesLab?.carousel?.[2]?.titleAr || I18N.ar["carousel.3t"]),
    "carousel.3d": lang === "en" 
      ? (servicesLab?.carousel?.[2]?.textEn || I18N.en["carousel.3d"]) 
      : (servicesLab?.carousel?.[2]?.textAr || I18N.ar["carousel.3d"]),

    "carousel.4t": lang === "en" 
      ? (servicesLab?.carousel?.[3]?.titleEn || I18N.en["carousel.4t"]) 
      : (servicesLab?.carousel?.[3]?.titleAr || I18N.ar["carousel.4t"]),
    "carousel.4d": lang === "en" 
      ? (servicesLab?.carousel?.[3]?.textEn || I18N.en["carousel.4d"]) 
      : (servicesLab?.carousel?.[3]?.textAr || I18N.ar["carousel.4d"]),
  };

  // Pass passive movie-drift yaw parameter for visual card components
  const [heroMotionOffset, setHeroMotionOffset] = useState({ x: 0, y: 0 });

  const handleLangToggle = () => {
    setLang((prev) => (prev === "en" ? "ar" : "en"));
  };

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleDotClick = (index: number) => {
    setCarouselIndex(index);
  };

  // Keyboard navigation for card deck
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (lang === "ar") {
        nextSlide();
      } else {
        prevSlide();
      }
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (lang === "ar") {
        prevSlide();
      } else {
        nextSlide();
      }
    } else if (e.key === "Home") {
      e.preventDefault();
      setCarouselIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setCarouselIndex(totalSlides - 1);
    }
  };

  // Touch Swipe handler
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartRef.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    touchStartRef.current = null;
  };

  // Track cursor movement on whole services container for the passive 3D ambient drift effect
  const handleServicesMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setHeroMotionOffset({
      x: parseFloat((x * 24).toFixed(1)),
      y: parseFloat((y * 20).toFixed(1)),
    });
  };

  const handleServicesMouseLeave = () => {
    setHeroMotionOffset({ x: 0, y: 0 });
  };

  return (
    <section 
      id="services" 
      className="services-lab-section relative py-32 px-6 md:px-12 overflow-hidden select-none"
      onMouseMove={handleServicesMouseMove}
      onMouseLeave={handleServicesMouseLeave}
      style={{
        "--hx": `${heroMotionOffset.x}px`,
        "--hy": `${heroMotionOffset.y}px`,
      } as React.CSSProperties}
    >
      {/* 3D Lab Base Embedded Styles to prevent compiling errors and keep pixel-perfect fidelity */}
      <style>{`
        .services-lab-section {
          background-color: #040807;
          background-image:
            radial-gradient(ellipse 90% 60% at 10% -10%, rgba(0, 255, 214, 0.1), transparent 50%),
            radial-gradient(ellipse 70% 50% at 95% 10%, rgba(192, 132, 252, 0.1), transparent 45%),
            linear-gradient(165deg, #040807 0%, #0a1620 45%, #061210 100%);
        }

        .services-lab-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0, 255, 214, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 214, 0.02) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
          z-index: 0;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, black, transparent);
        }

        /* 3D Space system Cards Core styling */
        .shape-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
          gap: 2rem;
          align-items: stretch;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (min-width: 900px) {
          .shape-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .ux-parent--span-2 {
            grid-column: span 2;
          }
        }

        .ux-parent {
          width: 100%;
          height: 310px;
          margin-inline: auto;
          perspective: 1000px;
          perspective-origin: 50% 50%;
          filter: drop-shadow(0 28px 50px rgba(0, 40, 30, 0.45));
        }

        .ux-card {
          position: relative;
          height: 100%;
          border-radius: 50px;
          background: var(--ux-grad);
          transform-style: preserve-3d;
          transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.55s ease;
          box-shadow:
            rgba(5, 71, 17, 0) 40px 50px 25px -40px,
            rgba(5, 71, 17, 0.28) 0 25px 25px -5px;
        }

        .ux-parent:hover .ux-card {
          transform: rotate3d(1, 1, 0, 25deg);
          box-shadow:
            rgba(5, 71, 17, 0.45) 28px 48px 28px -38px,
            rgba(0, 255, 214, 0.12) 0 0 60px -10px,
            rgba(5, 71, 17, 0.15) 0 25px 35px 0;
        }

        .ux-glass {
          transform-style: preserve-3d;
          position: absolute;
          inset: 8px;
          border-radius: 55px;
          border-top-right-radius: 100%;
          background: linear-gradient(0deg, rgba(255, 255, 255, 0.38) 0%, rgba(255, 255, 255, 0.82) 100%);
          transform: translate3d(0, 0, 25px);
          border-left: 1px solid rgba(255, 255, 255, 0.85);
          border-bottom: 1px solid rgba(255, 255, 255, 0.75);
          transition: all 0.5s ease-in-out;
          pointer-events: none;
        }

        .ux-logo {
          position: absolute;
          right: 0;
          top: 0;
          transform-style: preserve-3d;
          pointer-events: none;
          z-index: 2;
        }
        
        [dir="rtl"] .ux-logo {
          right: auto;
          left: 0;
        }

        .ux-circle {
          display: block;
          position: absolute;
          aspect-ratio: 1;
          border-radius: 50%;
          top: 0;
          right: 0;
          background: var(--ux-orbit);
          box-shadow: rgba(100, 100, 111, 0.25) -10px 10px 24px 0;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          transition: all 0.5s ease-in-out;
        }
        
        [dir="rtl"] .ux-circle {
          right: auto;
          left: 0;
        }

        .ux-circle:nth-child(1) { width: 170px; transform: translate3d(0, 0, 20px); top: 8px; right: 8px; }
        .ux-circle:nth-child(2) { width: 140px; transform: translate3d(0, 0, 40px); top: 10px; right: 10px; transition-delay: 0.05s; }
        .ux-circle:nth-child(3) { width: 110px; transform: translate3d(0, 0, 60px); top: 17px; right: 17px; transition-delay: 0.1s; }
        .ux-circle:nth-child(4) { width: 80px; transform: translate3d(0, 0, 80px); top: 23px; right: 23px; transition-delay: 0.15s; }
        .ux-circle:nth-child(5) { 
          width: 50px; 
          transform: translate3d(0, 0, 100px); 
          top: 30px; 
          right: 30px; 
          display: grid; 
          place-content: center; 
          transition-delay: 0.2s; 
        }

        [dir="rtl"] .ux-circle:nth-child(1) { right: auto; left: 8px; }
        [dir="rtl"] .ux-circle:nth-child(2) { right: auto; left: 10px; }
        [dir="rtl"] .ux-circle:nth-child(3) { right: auto; left: 17px; }
        [dir="rtl"] .ux-circle:nth-child(4) { right: auto; left: 23px; }
        [dir="rtl"] .ux-circle:nth-child(5) { right: auto; left: 30px; }

        .ux-circle:nth-child(5) svg {
          width: 20px;
          height: 20px;
          fill: #fff;
        }

        .ux-parent:hover .ux-circle:nth-child(2) { transform: translate3d(0, 0, 60px); }
        .ux-parent:hover .ux-circle:nth-child(3) { transform: translate3d(0, 0, 80px); }
        .ux-parent:hover .ux-circle:nth-child(4) { transform: translate3d(0, 0, 100px); }
        .ux-parent:hover .ux-circle:nth-child(5) { transform: translate3d(0, 0, 120px); }

        .ux-content {
          padding: 100px 3.75rem 0 1.85rem;
          transform: translate3d(0, 0, 26px);
          position: relative;
          z-index: 3;
          text-align: left;
        }
        
        [dir="rtl"] .ux-content {
          text-align: right;
          padding: 100px 1.85rem 0 3.75rem;
        }

        .ux-title {
          display: block;
          color: var(--ux-title);
          font-weight: 900;
          font-size: 1.35rem;
          letter-spacing: -0.02em;
        }

        .ux-text {
          display: block;
          margin-top: 0.85rem;
          color: var(--ux-body);
          font-size: 0.95rem;
          line-height: 1.5;
          font-weight: 600;
        }

        .ux-bottom {
          padding: 10px 12px;
          transform-style: preserve-3d;
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transform: translate3d(0, 0, 26px);
          z-index: 4;
        }

        .ux-social {
          display: flex;
          gap: 10px;
          transform-style: preserve-3d;
        }

        .ux-social-btn {
          width: 32px;
          height: 32px;
          background: #fff;
          border-radius: 50%;
          border: none;
          display: grid;
          place-content: center;
          cursor: pointer;
          box-shadow: rgba(5, 71, 17, 0.45) 0 8px 6px -5px;
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background 0.2s;
        }

        .ux-social-btn svg {
          width: 15px;
          height: 15px;
          fill: var(--ux-fill);
        }

        .ux-social-btn:hover {
          background: #0f172a;
        }
        .ux-social-btn:hover svg {
          fill: #fff;
        }

        .ux-parent:hover .ux-social-btn {
          transform: translate3d(0, 0, 50px);
          box-shadow: rgba(5, 71, 17, 0.25) -5px 20px 12px 0;
        }

        .ux-more {
          display: flex;
          align-items: center;
          gap: 4px;
          justify-content: flex-end;
          transition: transform 0.2s ease;
        }

        .ux-more:hover {
          transform: translate3d(0, 0, 10px);
        }

        .ux-more-btn {
          background: none;
          border: none;
          color: var(--ux-cta);
          font-weight: 800;
          font-size: 0.75rem;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .ux-more svg {
          fill: none;
          stroke: var(--ux-cta);
          stroke-width: 3px;
          max-height: 15px;
          width: 18px;
        }

        /* Six Theme Presets */
        .ux-parent--mint {
          --ux-grad: linear-gradient(135deg, rgb(0, 255, 214) 0%, rgb(8, 226, 96) 100%);
          --ux-title: #006036;
          --ux-body: rgba(0, 96, 54, 0.82);
          --ux-cta: #008f57;
          --ux-orbit: rgba(0, 249, 203, 0.22);
          --ux-fill: #006036;
        }

        .ux-parent--violet {
          --ux-grad: linear-gradient(145deg, #a855f7 0%, #6366f1 40%, #ec4899 100%);
          --ux-title: #2e0854;
          --ux-body: rgba(46, 8, 84, 0.85);
          --ux-cta: #7c3aed;
          --ux-orbit: rgba(216, 180, 254, 0.35);
          --ux-fill: #5b21b6;
        }

        .ux-parent--solar {
          --ux-grad: linear-gradient(135deg, #fbbf24 0%, #f97316 45%, #dc2626 100%);
          --ux-title: #611f0a;
          --ux-body: rgba(97, 31, 10, 0.88);
          --ux-cta: #c2410c;
          --ux-orbit: rgba(254, 243, 199, 0.4);
          --ux-fill: #9a3412;
        }

        .ux-parent--ocean {
          --ux-grad: linear-gradient(155deg, #22d3ee 0%, #0284c7 50%, #1e3a8a 100%);
          --ux-title: #06314a;
          --ux-body: rgba(6, 49, 74, 0.88);
          --ux-cta: #0369a1;
          --ux-orbit: rgba(125, 211, 252, 0.35);
          --ux-fill: #0e7490;
        }

        .ux-parent--prism {
          --ux-grad: conic-gradient(from 200deg at 65% 35%, #22d3ee, #818cf8, #f472b6, #facc15, #22d3ee);
          --ux-title: #0f172a;
          --ux-body: rgba(15, 23, 42, 0.88);
          --ux-cta: #4338ca;
          --ux-orbit: rgba(255, 255, 255, 0.35);
          --ux-fill: #312e81;
        }

        .ux-parent--void {
          --ux-grad: linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%);
          --ux-title: #5eead4;
          --ux-body: rgba(203, 213, 225, 0.82);
          --ux-cta: #c084fc;
          --ux-orbit: rgba(167, 139, 250, 0.25);
          --ux-fill: #c084fc;
          box-shadow: 0 0 0 1px rgba(167, 139, 250, 0.35);
        }

        /* Shape Modifiers */
        .ux-parent--cut .ux-card {
          border-radius: 36px;
          clip-path: polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px);
        }

        .ux-parent--cut .ux-glass {
          border-radius: 32px !important;
          clip-path: polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px);
        }

        .ux-parent--wide .ux-card {
          border-radius: 44px;
        }

        .ux-parent--wide .ux-glass {
          border-radius: 48px;
          border-top-right-radius: 55%;
        }

        .ux-parent--wide .ux-content {
          padding: 2.25rem 52% 0 1.75rem !important;
        }

        [dir="rtl"] .ux-parent--wide .ux-content {
          padding: 2.25rem 1.75rem 0 52% !important;
        }

        .ux-parent--wide .ux-logo .ux-circle:nth-child(1) {
          width: 200px;
          height: 200px;
        }

        /* Carousel Spotlight Deck styles */
        .stage-wrap {
          max-width: 440px;
          margin: 0.75rem auto 0;
          outline: none;
        }

        .stage-shell {
          position: relative;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 0.85rem;
        }

        .stage-viewport {
          overflow: hidden;
          border-radius: 22px;
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(0, 255, 214, 0.22);
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.06) inset,
            0 24px 56px rgba(0, 0, 0, 0.45);
          touch-action: pan-y pinch-zoom;
        }

        .stage-track {
          display: flex;
          flex-direction: row;
          will-change: transform;
          transition: transform 0.55s cubic-bezier(0.2, 0.85, 0.25, 1);
        }

        .stage-card {
          flex: 0 0 100%;
          width: 100%;
          box-sizing: border-box;
          padding: 10px 12px 12px;
        }

        .stage-card__inner {
          min-height: 290px;
          border-radius: 18px;
          padding: 9px;
          background: var(--st-grad, linear-gradient(145deg, #00ffd6, #08e260));
          box-shadow:
            0 20px 48px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
        }

        .stage-card--b { --st-grad: linear-gradient(145deg, #a855f7, #6366f1); }
        .stage-card--c { --st-grad: linear-gradient(145deg, #fbbf24, #f97316); }
        .stage-card--d { --st-grad: linear-gradient(145deg, #22d3ee, #2563eb); }

        .stage-card__body {
          border-radius: 14px;
          padding: 1.35rem 1.2rem 1.1rem;
          background: linear-gradient(168deg, rgba(255, 255, 255, 0.38) 0%, rgba(255, 255, 255, 0.07) 100%);
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-bottom-color: rgba(255, 255, 255, 0.2);
          text-align: left;
        }

        [dir="rtl"] .stage-card__body {
          text-align: right;
        }

        .stage-card__tag {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          opacity: 0.78;
          color: rgba(0, 60, 45, 0.88);
        }

        .stage-card--b .stage-card__tag { color: rgba(59, 7, 100, 0.88); }
        .stage-card--c .stage-card__tag { color: rgba(120, 50, 10, 0.92); }
        .stage-card--d .stage-card__tag { color: rgba(12, 74, 110, 0.92); }

        .stage-card h3 {
          margin: 0.4rem 0 0;
          font-size: 1.35rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: rgba(0, 80, 55, 0.96);
        }

        .stage-card--b h3 { color: #3b0764; }
        .stage-card--c h3 { color: #7c2d12; }
        .stage-card--d h3 { color: #0c4a6e; }

        .stage-card p {
          margin: 0.55rem 0 0;
          font-size: 0.92rem;
          font-weight: 600;
          line-height: 1.5;
          color: rgba(0, 90, 60, 0.84);
        }

        .stage-card--b p { color: rgba(59, 7, 100, 0.8); }
        .stage-card--c p { color: rgba(120, 50, 10, 0.84); }
        .stage-card--d p { color: rgba(12, 74, 110, 0.84); }

        .stage-card__actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1rem;
          padding: 0 0.15rem 0.1rem;
        }

        .stage-card .ux-social-btn svg { fill: #047857; }
        .stage-card--b .ux-social-btn svg { fill: #6d28d9; }
        .stage-card--c .ux-social-btn svg { fill: #c2410c; }
        .stage-card--d .ux-social-btn svg { fill: #0e7490; }

        .stage-card .ux-more-btn {
          color: inherit;
        }

        .stage-fab {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          border-radius: 50%;
          border: 1px solid rgba(0, 255, 214, 0.38);
          background: rgba(0, 0, 0, 0.4);
          color: #e8fff8;
          cursor: pointer;
          display: grid;
          place-items: center;
          transition: box-shadow 0.25s, transform 0.2s, border-color 0.2s;
          box-shadow: 0 0 22px rgba(0, 255, 214, 0.1);
        }

        .stage-fab:hover {
          border-color: rgba(192, 132, 252, 0.55);
          box-shadow: 0 0 32px rgba(192, 132, 252, 0.28);
          transform: scale(1.05);
        }

        .stage-fab svg {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }

        @media (max-width: 520px) {
          .stage-shell {
            grid-template-columns: 1fr;
            justify-items: stretch;
          }

          .stage-fab {
            display: none;
          }

          .stage-wrap {
            max-width: 100%;
          }
        }

        .stage-dots {
          display: flex;
          justify-content: center;
          gap: 0.55rem;
          margin-top: 1.15rem;
        }

        .stage-dots button {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: none;
          padding: 0;
          background: rgba(255, 255, 255, 0.22);
          cursor: pointer;
          transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
        }

        .stage-dots button.is-active {
          background: #fff;
          transform: scale(1.35);
          box-shadow: 0 0 18px rgba(0, 255, 214, 0.55);
        }
      `}</style>

      <div className="max-w-7xl mx-auto text-center" dir={lang === "ar" ? "rtl" : "ltr"}>
        
        {/* Section Title */}
        <div className="max-w-3xl mx-auto mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 mb-4 shadow-[0_0_15px_rgba(0,255,214,0.05)]">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-teal-300 uppercase">
              {lang === "en" ? "Interactive lab" : "مختبر تفاعلي"}
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
            {t["sec.grid"]}
          </h2>
          <p className="text-slate-400 mt-4 text-base max-w-xl mx-auto leading-relaxed">
            {t["sec.grid.sub"]}
          </p>
        </div>

        {/* 3D Shapes Bento Grid (6 structural variants) */}
        <div className="shape-grid mb-32">
          
          {/* Card 1: Mint Orb */}
          <div className="ux-parent ux-parent--mint">
            <div className="ux-card">
              <div className="ux-logo" aria-hidden="true">
                <span className="ux-circle"></span>
                <span className="ux-circle"></span>
                <span className="ux-circle"></span>
                <span className="ux-circle"></span>
                <span className="ux-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29.667 31.69" aria-hidden="true">
                    <path d="M12.827,1.628A1.561,1.561,0,0,1,14.31,0h2.964a1.561,1.561,0,0,1,1.483,1.628v11.9a9.252,9.252,0,0,1-2.432,6.852q-2.432,2.409-6.963,2.409T2.4,20.452Q0,18.094,0,13.669V1.628A1.561,1.561,0,0,1,1.483,0h2.98A1.561,1.561,0,0,1,5.947,1.628V13.191a5.635,5.635,0,0,0,.85,3.451,3.153,3.153,0,0,0,2.632,1.094,3.032,3.032,0,0,0,2.582-1.076,5.836,5.836,0,0,0,.816-3.486Z"/>
                    <path d="M75.207,20.857a1.561,1.561,0,0,1-1.483,1.628h-2.98a1.561,1.561,0,0,1-1.483-1.628V1.628A1.561,1.561,0,0,1,70.743,0h2.98a1.561,1.561,0,0,1,1.483,1.628Z" transform="translate(-45.91 0)"/>
                    <path d="M0,80.018A1.561,1.561,0,0,1,1.483,78.39h26.7a1.561,1.561,0,0,1,1.483,1.628v2.006a1.561,1.561,0,0,1-1.483,1.628H1.483A1.561,1.561,0,0,1,0,82.025Z" transform="translate(0 -51.963)"/>
                  </svg>
                </span>
              </div>
              <div className="ux-glass"></div>
              <div className="ux-content">
                <span className="ux-title">{t["card.orb.title"]}</span>
                <span className="ux-text">{t["card.orb.text"]}</span>
              </div>
              <div className="ux-bottom">
                <div className="ux-social">
                  <button type="button" className="ux-social-btn" aria-label="Instagram">
                    <Icons.Instagram className="w-4 h-4" />
                  </button>
                  <button type="button" className="ux-social-btn" aria-label="X">
                    <Icons.Twitter className="w-4 h-4" />
                  </button>
                  <button type="button" className="ux-social-btn" aria-label="Discord">
                    <Icons.Slack className="w-4 h-4" />
                  </button>
                </div>
                <div className="ux-more">
                  <span className="ux-more-btn">{t["cta.more"]}</span>
                  <Icons.ChevronRight className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Violet Chamfer */}
          <div className="ux-parent ux-parent--violet ux-parent--cut">
            <div className="ux-card">
              <div className="ux-logo" aria-hidden="true">
                <span className="ux-circle"></span>
                <span className="ux-circle"></span>
                <span className="ux-circle"></span>
                <span className="ux-circle"></span>
                <span className="ux-circle">
                  <Icons.Hexagon className="w-5 h-5 text-white" />
                </span>
              </div>
              <div className="ux-glass"></div>
              <div className="ux-content">
                <span className="ux-title">{t["card.chamfer.title"]}</span>
                <span className="ux-text">{t["card.chamfer.text"]}</span>
              </div>
              <div className="ux-bottom">
                <div className="ux-social">
                  <button type="button" className="ux-social-btn" aria-label="A">
                    <Icons.Circle className="w-4 h-4" />
                  </button>
                  <button type="button" className="ux-social-btn" aria-label="B">
                    <Icons.Square className="w-4 h-4" />
                  </button>
                  <button type="button" className="ux-social-btn" aria-label="C">
                    <Icons.Triangle className="w-4 h-4" />
                  </button>
                </div>
                <div className="ux-more">
                  <span className="ux-more-btn">{t["cta.more"]}</span>
                  <Icons.ChevronRight className="w-4 h-4 text-violet-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Solar Neo Surface */}
          <div className="ux-parent ux-parent--solar">
            <div className="ux-card">
              <div className="ux-logo" aria-hidden="true">
                <span className="ux-circle"></span>
                <span className="ux-circle"></span>
                <span className="ux-circle"></span>
                <span className="ux-circle"></span>
                <span className="ux-circle">
                  <Icons.Sun className="w-5 h-5 text-white" />
                </span>
              </div>
              <div className="ux-glass"></div>
              <div className="ux-content">
                <span className="ux-title">{t["card.brutal.title"]}</span>
                <span className="ux-text">{t["card.brutal.text"]}</span>
              </div>
              <div className="ux-bottom">
                <div className="ux-social">
                  <button type="button" className="ux-social-btn" aria-label="A">
                    <Icons.ArrowUpRight className="w-4 h-4" />
                  </button>
                  <button type="button" className="ux-social-btn" aria-label="B">
                    <Icons.Zap className="w-4 h-4" />
                  </button>
                  <button type="button" className="ux-social-btn" aria-label="C">
                    <Icons.Activity className="w-4 h-4" />
                  </button>
                </div>
                <div className="ux-more">
                  <span className="ux-more-btn">{t["cta.more"]}</span>
                  <Icons.ChevronRight className="w-4 h-4 text-amber-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Cinema Wide */}
          <div className="ux-parent ux-parent--wide ux-parent--ocean ux-parent--span-2">
            <div className="ux-card">
              <div className="ux-logo" aria-hidden="true">
                <span className="ux-circle"></span>
                <span className="ux-circle"></span>
                <span className="ux-circle"></span>
                <span className="ux-circle"></span>
                <span className="ux-circle">
                  <Icons.Play className="w-5 h-5 text-white" />
                </span>
              </div>
              <div className="ux-glass"></div>
              <div className="ux-content">
                <span className="ux-title">{t["card.cinema.title"]}</span>
                <span className="ux-text">{t["card.cinema.text"]}</span>
              </div>
              <div className="ux-bottom">
                <div className="ux-social">
                  <button type="button" className="ux-social-btn" aria-label="A">
                    <Icons.Heart className="w-4 h-4" />
                  </button>
                  <button type="button" className="ux-social-btn" aria-label="B">
                    <Icons.MessageSquare className="w-4 h-4" />
                  </button>
                  <button type="button" className="ux-social-btn" aria-label="C">
                    <Icons.Share2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="ux-more">
                  <span className="ux-more-btn">{t["cta.more"]}</span>
                  <Icons.ChevronRight className="w-4 h-4 text-sky-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Crystal Facet */}
          <div className="ux-parent ux-parent--prism">
            <div className="ux-card">
              <div className="ux-logo" aria-hidden="true">
                <span className="ux-circle"></span>
                <span className="ux-circle"></span>
                <span className="ux-circle"></span>
                <span className="ux-circle"></span>
                <span className="ux-circle">
                  <Icons.Sparkles className="w-5 h-5 text-white" />
                </span>
              </div>
              <div className="ux-glass"></div>
              <div className="ux-content">
                <span className="ux-title">{t["card.facet.title"]}</span>
                <span className="ux-text">{t["card.facet.text"]}</span>
              </div>
              <div className="ux-bottom">
                <div className="ux-social">
                  <button type="button" className="ux-social-btn" aria-label="A">
                    <Icons.Grid className="w-4 h-4" />
                  </button>
                  <button type="button" className="ux-social-btn" aria-label="B">
                    <Icons.Target className="w-4 h-4" />
                  </button>
                  <button type="button" className="ux-social-btn" aria-label="C">
                    <Icons.Filter className="w-4 h-4" />
                  </button>
                </div>
                <div className="ux-more">
                  <span className="ux-more-btn">{t["cta.more"]}</span>
                  <Icons.ChevronRight className="w-4 h-4 text-violet-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 6: Layered Stack */}
          <div className="ux-parent ux-parent--void">
            <div className="ux-card">
              <div className="ux-logo" aria-hidden="true">
                <span className="ux-circle"></span>
                <span className="ux-circle"></span>
                <span className="ux-circle"></span>
                <span className="ux-circle"></span>
                <span className="ux-circle">
                  <Icons.Layers className="w-5 h-5 text-teal-400" />
                </span>
              </div>
              <div className="ux-glass"></div>
              <div className="ux-content">
                <span className="ux-title">{t["card.stack.title"]}</span>
                <span className="ux-text">{t["card.stack.text"]}</span>
              </div>
              <div className="ux-bottom">
                <div className="ux-social">
                  <button type="button" className="ux-social-btn" aria-label="A">
                    <Icons.Database className="w-4 h-4" />
                  </button>
                  <button type="button" className="ux-social-btn" aria-label="B">
                    <Icons.Lock className="w-4 h-4" />
                  </button>
                  <button type="button" className="ux-social-btn" aria-label="C">
                    <Icons.Cpu className="w-4 h-4" />
                  </button>
                </div>
                <div className="ux-more">
                  <span className="ux-more-btn">{t["cta.more"]}</span>
                  <Icons.ChevronRight className="w-4 h-4 text-teal-300" />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Carousel: Spotlight deck */}
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4 shadow-[0_0_15px_rgba(167,139,250,0.05)]">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-violet-300 uppercase">
              {lang === "en" ? "Interactive deck" : "العرض التفاعلي"}
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            {t["sec.orbit"]}
          </h2>
          <p className="text-slate-400 mt-4 text-base max-w-lg mx-auto leading-relaxed">
            {t["sec.orbit.sub"]}
          </p>
        </div>

        {/* Spotlight Stage Carousel */}
        <div 
          className="stage-wrap" 
          role="region" 
          aria-roledescription="carousel" 
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <div className="stage-shell">
            <button 
              onClick={prevSlide}
              type="button" 
              className="stage-fab stage-fab--prev" 
              aria-label="Previous Slide"
            >
              <Icons.ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <div 
              className="stage-viewport" 
              ref={carouselContainerRef}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className="stage-track"
                style={{
                  transform: `translate3d(-${carouselIndex * 100}%, 0px, 0px)`,
                }}
              >
                
                {/* Panel 1: Signal */}
                <article className="stage-card stage-card--a">
                  <div className="stage-card__inner">
                    <div className="stage-card__body">
                      <span className="stage-card__tag">01</span>
                      <h3>{t["carousel.1t"]}</h3>
                      <p>{t["carousel.1d"]}</p>
                    </div>
                    <div className="stage-card__actions">
                      <div className="ux-social">
                        <button type="button" className="ux-social-btn" aria-label="a">
                          <Icons.Activity className="w-4 h-4" />
                        </button>
                        <button type="button" className="ux-social-btn" aria-label="b">
                          <Icons.Disc className="w-4 h-4" />
                        </button>
                      </div>
                      <button type="button" className="ux-more-btn">
                        <span className="text-xs font-extrabold text-[#006036] uppercase tracking-wider">{t["cta.more"]}</span>
                      </button>
                    </div>
                  </div>
                </article>

                {/* Panel 2: Mesh */}
                <article className="stage-card stage-card--b">
                  <div className="stage-card__inner">
                    <div className="stage-card__body">
                      <span className="stage-card__tag">02</span>
                      <h3>{t["carousel.2t"]}</h3>
                      <p>{t["carousel.2d"]}</p>
                    </div>
                    <div className="stage-card__actions">
                      <div className="ux-social">
                        <button type="button" className="ux-social-btn" aria-label="a">
                          <Icons.Network className="w-4 h-4" />
                        </button>
                        <button type="button" className="ux-social-btn" aria-label="b">
                          <Icons.Radio className="w-4 h-4" />
                        </button>
                      </div>
                      <button type="button" className="ux-more-btn">
                        <span className="text-xs font-extrabold text-[#2e0854] uppercase tracking-wider">{t["cta.more"]}</span>
                      </button>
                    </div>
                  </div>
                </article>

                {/* Panel 3: Vault */}
                <article className="stage-card stage-card--c">
                  <div className="stage-card__inner">
                    <div className="stage-card__body">
                      <span className="stage-card__tag">03</span>
                      <h3>{t["carousel.3t"]}</h3>
                      <p>{t["carousel.3d"]}</p>
                    </div>
                    <div className="stage-card__actions">
                      <div className="ux-social">
                        <button type="button" className="ux-social-btn" aria-label="a">
                          <Icons.ShieldAlert className="w-4 h-4" />
                        </button>
                        <button type="button" className="ux-social-btn" aria-label="b">
                          <Icons.Key className="w-4 h-4" />
                        </button>
                      </div>
                      <button type="button" className="ux-more-btn">
                        <span className="text-xs font-extrabold text-[#611f0a] uppercase tracking-wider">{t["cta.more"]}</span>
                      </button>
                    </div>
                  </div>
                </article>

                {/* Panel 4: Pulse */}
                <article className="stage-card stage-card--d">
                  <div className="stage-card__inner">
                    <div className="stage-card__body">
                      <span className="stage-card__tag">04</span>
                      <h3>{t["carousel.4t"]}</h3>
                      <p>{t["carousel.4d"]}</p>
                    </div>
                    <div className="stage-card__actions">
                      <div className="ux-social">
                        <button type="button" className="ux-social-btn" aria-label="a">
                          <Icons.HeartPulse className="w-4 h-4" />
                        </button>
                        <button type="button" className="ux-social-btn" aria-label="b">
                          <Icons.Wifi className="w-4 h-4" />
                        </button>
                      </div>
                      <button type="button" className="ux-more-btn">
                        <span className="text-xs font-extrabold text-[#06314a] uppercase tracking-wider">{t["cta.more"]}</span>
                      </button>
                    </div>
                  </div>
                </article>

              </div>
            </div>

            <button 
              onClick={nextSlide}
              type="button" 
              className="stage-fab stage-fab--next" 
              aria-label="Next Slide"
            >
              <Icons.ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="stage-dots" role="group" aria-label="Slide indicators">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={carouselIndex === idx ? "is-active" : ""}
                onClick={() => handleDotClick(idx)}
                aria-label={`Slide ${idx + 1}`}
                aria-selected={carouselIndex === idx}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
