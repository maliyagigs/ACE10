import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { AppContent } from '../types';

interface TestimonialsProps {
  testimonials: AppContent['testimonials'];
  theme: AppContent['theme'];
}

export default function Testimonials({ testimonials, theme }: TestimonialsProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-28 px-6 md:px-12 bg-slate-950/20 backdrop-blur-3xl border-t border-slate-900 overflow-hidden relative">
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-rose-500/5 filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-glass text-white tracking-wider leading-tight uppercase">
            Client Success Testimonials
          </h2>
          <p className="text-slate-400 text-lg mt-4 leading-relaxed">
            Leading brands grow because we build systems that generate immediate value and sustained authority.
          </p>
        </div>

        {/* Testimonials Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              whileHover={{ y: -5, borderColor: 'rgba(255,255,255,0.15)' }}
              className="p-8 md:p-10 rounded-[2rem] bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 hover:bg-slate-900/60 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Five Stars Rating display */}
                <div className="flex items-center gap-1.5 mb-6 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Icons.Star key={i} className="w-4 h-4 fill-current text-yellow-500" />
                  ))}
                </div>

                <p className="text-slate-300 text-lg italic leading-relaxed mb-8">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-slate-800/40">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/10 flex-shrink-0">
                  <img 
                    src={t.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"} 
                    alt={t.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base">{t.name}</h4>
                  <p className="text-slate-500 text-sm font-mono">{t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
