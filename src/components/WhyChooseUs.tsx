import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { AppContent } from '../types';

interface WhyChooseUsProps {
  theme: AppContent['theme'];
  siteName: string;
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blue-500/5 filter blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
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
