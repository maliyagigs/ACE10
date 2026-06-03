import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { AppContent } from '../types';

interface ServicesProps {
  services: AppContent['services'];
  theme: AppContent['theme'];
}

export default function Services({ services, theme }: ServicesProps) {

  // Dynamically resolve lucide icons
  const renderIcon = (iconName?: string) => {
    if (!iconName) return <Icons.Sparkles className="w-6 h-6" />;
    const LucideIcon = (Icons as any)[iconName] || Icons.Sparkles;
    return <LucideIcon className="w-6 h-6" />;
  };

  return (
    <section id="services" className="relative py-28 px-6 md:px-12 overflow-hidden bg-slate-950/40 backdrop-blur-2xl border-t border-slate-900">
      
      {/* 2. Abstract Morphing Vector Blobs Section Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Blob 1 */}
        <svg 
          className="absolute -top-1/4 -right-1/4 w-[60%;] aspect-square opacity-20 filter blur-3xl animate-pulse" 
          viewBox="0 0 100 100"
          style={{ transform: 'scale(1.2) translateZ(0)', willChange: 'transform, opacity' }}
        >
          <path fill={theme.secondaryColor}>
            <animate 
              attributeName="d" 
              dur="12s" 
              repeatCount="indefinite"
              values="
                M25,-30 C45,-25 55,-10 60,10 C65,30 50,55 30,60 C10,65 -15,55 -30,40 C-45,25 -50,5 -45,-15 C-40,-35 -15,-40 25,-30 Z;
                M30,-25 C50,-20 60,-5 62,15 C64,35 44,50 24,58 C4,66 -16,60 -28,48 C-40,36 -44,18 -38,-2 C-32,-22 -12,-30 30,-25 Z;
                M25,-30 C45,-25 55,-10 60,10 C65,30 50,55 30,60 C10,65 -15,55 -30,40 C-45,25 -50,5 -45,-15 C-40,-35 -15,-40 25,-30 Z
              "
            />
          </path>
        </svg>

        {/* Blob 2 */}
        <svg 
          className="absolute -bottom-1/4 -left-1/4 w-[60%;] aspect-square opacity-20 filter blur-3xl" 
          viewBox="0 0 100 100"
          style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
        >
          <path fill={theme.accentColor}>
            <animate 
              attributeName="d" 
              dur="14s" 
              repeatCount="indefinite"
              values="
                M20,-20 C40,-15 50,5 45,25 C40,45 20,55 -5,55 C-30,55 -45,40 -45,20 C-45,0 -30,-15 -10,-20 C10,-25 0,-25 20,-20 Z;
                M25,-15 C45,-10 55,10 50,30 C45,50 25,60 0,60 C-25,60 -40,45 -45,25 C-50,5 -35,-15 -15,-20 C5,-25 5,-20 25,-15 Z;
                M20,-20 C40,-15 50,5 45,25 C40,45 20,55 -5,55 C-30,55 -45,40 -45,20 C-45,0 -30,-15 -10,-20 C10,-25 0,-25 20,-20 Z
              "
            />
          </path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-glass text-white tracking-wider mt-2 uppercase">
            Services We Provide
          </h2>
          <p className="text-slate-400 mt-4 text-lg">
            We merge design artistry with cutting-edge engineering matrices to construct experiences that foster exponential success.
          </p>
        </div>

        {/* 1. Intersection Scroll Slide-Up Cards with Stagger and Card Hover Glows */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 0.8, 
                ease: [0.16, 1, 0.3, 1], // Custom expo easing as requested
                delay: idx * 0.1 
              }}
              whileHover={{ 
                y: -10,
                boxShadow: `0 20px 40px -15px rgba(59, 130, 246, 0.2)`
              }}
              className="group relative p-8 bg-slate-900/50 hover:bg-slate-900/85 backdrop-blur-xl border border-slate-850 hover:border-blue-500/40 rounded-3xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              {/* Card trace glow asset */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"
              />

              <div>
                {/* Floating Icon Frame with spring popup style on hover */}
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-8 border border-slate-800 bg-slate-900 group-hover:scale-110 transition-transform duration-500"
                  style={{ color: theme.secondaryColor }}
                >
                  {renderIcon(service.icon)}
                </div>

                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-slate-400 leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>

              {/* Read more indicator inside card */}
              <div className="flex items-center gap-1 mt-8 text-xs font-semibold text-slate-500 group-hover:text-white transition-colors">
                <span>Discover More</span>
                <Icons.ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
