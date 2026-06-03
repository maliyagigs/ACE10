import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { AppContent } from '../types';

interface FooterProps {
  footer: AppContent['footer'];
  theme: AppContent['theme'];
  siteName: string;
}

export default function Footer({ footer, theme, siteName }: FooterProps) {
  
  const scrollToTop = () => {
    if (typeof (window as any).__triggerInertiaScroll === 'function') {
      (window as any).__triggerInertiaScroll(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getSocialIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'twitter':
        return <Icons.Twitter className="w-5 h-5" />;
      case 'linkedin':
        return <Icons.Linkedin className="w-5 h-5" />;
      case 'github':
        return <Icons.Github className="w-5 h-5" />;
      default:
        return <Icons.Globe className="w-5 h-5" />;
    }
  };

  return (
    <footer className="bg-slate-950 pt-20 pb-10 border-t border-slate-900 overflow-hidden relative">
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-500/[0.02] filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Upper section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-slate-900">
          
          {/* Main info block */}
          <div className="lg:col-span-4 space-y-6 text-left">
            <h1 className="text-2xl font-black tracking-tight text-white">{siteName}</h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {footer.aboutText}
            </p>
            
            {/* Social media connections */}
            {footer.socials && footer.socials.length > 0 && (
              <div className="flex items-center gap-3">
                {footer.socials.map((social) => (
                  <motion.a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.15, backgroundColor: theme.secondaryColor }}
                    className="w-10 h-10 rounded-full border border-slate-800 bg-slate-900/60 flex items-center justify-center text-slate-400 hover:text-white hover:border-transparent transition-colors"
                  >
                    {getSocialIcon(social.provider)}
                  </motion.a>
                ))}
              </div>
            )}
          </div>

          {/* Links blocks */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8 text-left">
            {footer.sections.map((section) => (
              <div key={section.id} className="space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500 font-bold">
                  {section.title}
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.id}>
                      <a 
                        href={link.url} 
                        className="text-sm text-slate-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contacts information block */}
          <div className="lg:col-span-3 text-left space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500 font-bold">
              HQ SStudio Contacts
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-2.5 text-slate-400">
                <Icons.MapPin className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                <span>{footer.address}</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-400">
                <Icons.Phone className="w-5 h-5 text-slate-500 flex-shrink-0" />
                <a href={`tel:${footer.phone}`} className="hover:text-white transition-colors">
                  {footer.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-slate-400">
                <Icons.Mail className="w-5 h-5 text-slate-500 flex-shrink-0" />
                <a href={`mailto:${footer.email}`} className="hover:text-white transition-colors">
                  {footer.email}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Lower section */}
        <div className="pt-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <p className="text-xs text-slate-500">
            {footer.copyrightText}
          </p>

          <div className="flex items-center gap-6">
            <ul className="flex items-center gap-6 text-xs text-slate-500">
              <li><a href="#" className="hover:text-white transition-colors">Legal Cookies</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security Audit</a></li>
            </ul>

            {/* Back to top with Smooth Scroll support requested by user */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -3 }}
              className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-full flex items-center gap-1 text-slate-450 hover:text-white text-xs font-mono font-bold cursor-pointer transition-colors"
            >
              <span>Back To Top</span>
              <Icons.ChevronUp className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>

      </div>
    </footer>
  );
}
