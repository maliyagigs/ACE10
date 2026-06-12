import { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';
import { motion } from 'motion/react';
import { AppContent } from '../types';

interface StatsProps {
  stats: AppContent['stats'];
  theme: AppContent['theme'];
}

export default function Stats({ stats, theme }: StatsProps) {
  return (
    <section className="py-20 px-6 md:px-12 bg-slate-950/60 backdrop-blur-3xl border-t border-slate-900 overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, idx) => (
            <StatColumn key={stat.id} stat={stat} theme={theme} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface StatColumnProps {
  stat: AppContent['stats'][0];
  theme: AppContent['theme'];
  index: number;
  key?: string;
}

function StatColumn({ stat, theme, index }: StatColumnProps) {
  const [displayVal, setDisplayVal] = useState<string>("0");
  const columnRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          
          const obj = { val: 0 };
          const isFloat = stat.value % 1 !== 0;

          animate(obj, {
            val: stat.value,
            round: isFloat ? 10 : 1, // Rounding for decimals or integers
            ease: 'easeOutExpo',
            duration: 2500,
            update: () => {
              if (isFloat) {
                setDisplayVal((obj.val / 10).toFixed(1));
              } else {
                setDisplayVal(Math.round(obj.val).toString());
              }
            }
          });
        }
      },
      { threshold: 0.2 }
    );

    if (columnRef.current) {
      observer.observe(columnRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [stat.value]);

  return (
    <motion.div 
      ref={columnRef}
      initial={{ opacity: 0, y: 35, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.7, 
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ 
        y: -6, 
        scale: 1.03, 
        borderColor: theme.secondaryColor,
        boxShadow: `0 15px 35px -5px ${theme.secondaryColor}20` 
      }}
      className="text-center p-6 border border-slate-900/50 rounded-2xl bg-slate-900/20 backdrop-blur-sm group cursor-default transition-colors duration-300"
    >
      <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-2 flex items-center justify-center font-mono">
        <span 
          className="text-transparent bg-clip-text"
          style={{ backgroundImage: `linear-gradient(to right, #ffffff, ${theme.secondaryColor})` }}
        >
          {displayVal}
        </span>
        <span className="text-blue-450 text-2xl sm:text-3xl ml-0.5">{stat.suffix}</span>
      </div>
      <p className="text-xs sm:text-sm font-mono text-slate-400 uppercase tracking-[0.1em] font-semibold">
        {stat.label}
      </p>
    </motion.div>
  );
}
