import { motion, useMotionValue, useMotionTemplate, useScroll, useTransform, useSpring } from 'motion/react';
import * as Icons from 'lucide-react';
import { AppContent } from '../types';
import React, { useRef, useState } from 'react';

interface ServicesProps {
  services: AppContent['services'];
  theme: AppContent['theme'];
  header?: AppContent['servicesHeader'];
}

interface ServiceCardProps {
  service: any;
  theme: any;
  index: number;
  className: string;
  key?: React.Key;
}

function ServiceCard({ service, theme, index, className }: ServiceCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const renderIcon = (iconName?: string) => {
    if (!iconName) return <Icons.Sparkles className="w-5 h-5" />;
    const LucideIcon = (Icons as any)[iconName] || Icons.Sparkles;
    return <LucideIcon className="w-5 h-5" />;
  };

  return (
    <motion.div
      onMouseMove={onMouseMove}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={`group relative p-8 bg-slate-950/80 border border-slate-900 hover:border-slate-850 rounded-[2rem] transition-all duration-500 overflow-hidden flex flex-col justify-between min-h-[320px] ${className}`}
    >
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.06),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-10 text-left">
        <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-10 text-white transition-transform duration-500 group-hover:scale-110">
          {renderIcon(service.icon)}
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
          {service.title}
        </h3>
        
        <p className="text-slate-500 leading-relaxed text-sm group-hover:text-slate-400 transition-colors">
          {service.description}
        </p>
      </div>

      <div className="relative z-10 flex items-center gap-2 mt-auto pt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
        <span>Learn More</span>
        <Icons.Plus className="w-3 h-3 text-blue-500" />
      </div>
    </motion.div>
  );
}

export default function Services({ services, theme, header }: ServicesProps) {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  
  // Fey Scroll Animation Logic
  const { scrollYProgress } = useScroll({
    target: targetElement ? { current: targetElement } : undefined,
    offset: ["start end", "end start"]
  });

  const rotateXRaw = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [15, 0, 0, -15]);
  const scaleRaw = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.8, 1, 1, 0.8]);
  const opacityRaw = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const rotateX = useSpring(rotateXRaw, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const scale = useSpring(scaleRaw, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const opacity = useSpring(opacityRaw, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const cardSpans = [
    'md:col-span-3', // 1
    'md:col-span-3', // 2
    'md:col-span-2', // 3
    'md:col-span-2', // 4
    'md:col-span-2', // 5
    'md:col-span-6', // 6 - Wide feature at bottom
  ];

  const subTitle = header?.subTitle || "Service Suite";
  const title = header?.title || "Engineering\nDigital Excellence.";
  const description = header?.description || "We deploy precision frameworks to scale your infrastructure, optimize conversion lattices, and define market-leading interfaces.";

  return (
      <motion.section 
        ref={setTargetElement} 
        id="services" 
        className="relative py-40 px-6 md:px-12 overflow-visible select-none border-t border-white/[0.03]"
        style={{ perspective: "1500px" }}
      >
      
      {/* 1. Fey Style Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ 
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* 2. Top-down light sweep */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent blur-sm" />

      <motion.div 
        style={{ 
          rotateX,
          scale,
          opacity,
          transformStyle: "preserve-3d"
        }}
        className="max-w-7xl mx-auto relative z-10"
      >
        
        {/* Title Block - Fey Minimalist Style */}
        <div className="max-w-3xl mb-32 text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">{subTitle}</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-[0.9]"
            style={{ whiteSpace: 'pre-line' }}
          >
            {title}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-slate-500 mt-10 text-xl md:text-2xl leading-relaxed max-w-2xl font-medium tracking-tight"
          >
            {description}
          </motion.p>
        </div>

        {/* 3. Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {services.map((service, idx) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              theme={theme} 
              index={idx}
              className={cardSpans[idx % cardSpans.length]}
            />
          ))}
        </div>
      </motion.div>
      </motion.section>
  );
}
