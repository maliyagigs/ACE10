import { motion } from 'motion/react';
import { AppContent } from '../types';
import GlowingArtwork from './GlowingArtwork';

interface ServedCountriesProps {
  countries: AppContent['countries'];
  theme: AppContent['theme'];
  header?: AppContent['countriesHeader'];
}

export default function ServedCountries({ countries, theme, header }: ServedCountriesProps) {
  const subTitle = header?.subTitle || "GLOBAL FOOTPRINT";
  const title = header?.title || "Served Countries & Offices";
  const description = header?.description || "We operate fully remote digital sprints connecting state-of-the-art websites to elite scale-ups across global centers.";

  return (
    <section className="py-24 px-6 md:px-12 bg-slate-950/40 backdrop-blur-3xl border-t border-slate-900 overflow-hidden relative">
      
      {/* Glowing Neon Line Art Background Underneath the Section */}
      <GlowingArtwork isBackground={true} />
      
      {/* Background World Map Vector Grid Lines */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        
        <div className="max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-emerald-400 font-semibold">{subTitle}</span>
          <h2 className="text-3xl md:text-5xl font-glass text-white mt-3 tracking-wider uppercase">{title}</h2>
          <p className="text-slate-400 text-base mt-4">
            {description}
          </p>
        </div>

        {/* Dynamic circular country flag badges */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {countries.map((c, idx) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, type: 'spring', stiffness: 100 }}
              whileHover={{ 
                scale: 1.15,
                y: -5,
                borderColor: theme.secondaryColor,
                boxShadow: `0 0 25px ${theme.secondaryColor}25`
              }}
              className="flex items-center gap-4 px-6 py-4 rounded-full bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl transition-all cursor-pointer shadow-lg shadow-black/10 group"
            >
              {/* Official Flag Image via safe CDN */}
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/15 flex-shrink-0">
                <img 
                  src={`https://flagcdn.com/w80/${c.code.toLowerCase()}.png`} 
                  alt={`${c.name} flag`} 
                  className="w-full h-full object-cover scale-110"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to a clean placeholder with initial letter if image fails
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{c.name}</p>
                <p className="text-[10px] font-mono text-slate-500 text-left">ZONE ACTIVE</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
