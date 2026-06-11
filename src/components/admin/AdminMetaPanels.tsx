import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContent, Testimonial, Stat, Country } from '../../types';
import { ImageUploader, AdminSectionHeader, AdminControlGroup } from './AdminCommon';

interface AdminContentPanelProps {
  key?: string;
  content: AppContent;
  updateContent: (modifier: (curr: AppContent) => void) => void;
  reorder: <T>(list: T[], index: number, direction: 'up' | 'down') => T[];
}

// 1. STATS CMS
export function AdminStatsWorkspace({ content, updateContent, reorder }: AdminContentPanelProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <AdminSectionHeader title="KPI & Stats Counters" icon={Icons.BarChart3} description="Success metrics displayed across the dashboard." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {content.stats.map((s, idx) => (
          <div key={s.id}>
            <AdminControlGroup title={`Metric #${idx + 1}`}>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-[9px] uppercase font-mono text-slate-500 mb-1">Value</label>
                    <input type="number" value={s.value} onChange={(e) => updateContent(c => { c.stats[idx].value = parseInt(e.target.value); })} className="w-full bg-slate-950 px-3 py-2 rounded-lg text-white border border-slate-800" />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-mono text-slate-500 mb-1">Suffix</label>
                    <input type="text" value={s.suffix} onChange={(e) => updateContent(c => { c.stats[idx].suffix = e.target.value; })} className="w-20 bg-slate-950 px-3 py-2 rounded-lg text-white border border-slate-800 text-center font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-mono text-slate-500 mb-1">Descriptor Label</label>
                  <input type="text" value={s.label} onChange={(e) => updateContent(c => { c.stats[idx].label = e.target.value; })} className="w-full bg-slate-950 px-3 py-2 rounded-lg text-white border border-slate-800" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => updateContent(c => { c.stats = reorder(c.stats, idx, 'up'); })} className="p-1.5 hover:text-white"><Icons.ChevronLeft className="w-4 h-4" /></button>
                  <button onClick={() => updateContent(c => { c.stats = reorder(c.stats, idx, 'down'); })} className="p-1.5 hover:text-white"><Icons.ChevronRight className="w-4 h-4" /></button>
                  <button onClick={() => updateContent(c => { c.stats.splice(idx, 1); })} className="p-1.5 text-red-500/60 hover:text-red-500"><Icons.Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </AdminControlGroup>
          </div>
        ))}
        <button onClick={() => updateContent(c => { c.stats.push({ id: 'st-' + Date.now(), value: 0, suffix: '+', label: 'New Metric' }); })} className="border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-600 hover:text-slate-400 hover:border-slate-600 transition-all gap-2 group">
           <Icons.Plus className="w-8 h-8 group-hover:scale-125 transition-transform" />
           <span className="text-xs font-mono font-bold uppercase tracking-widest">Add Metric</span>
        </button>
      </div>
    </motion.div>
  );
}

// 2. TESTIMONIALS
export function AdminTestimonialsWorkspace({ content, updateContent, reorder }: AdminContentPanelProps) {
  const [newTestimonial, setNewTestimonial] = useState<Partial<Testimonial>>({ name: '', company: '', quote: '', image: '' });
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <AdminSectionHeader title="Client Endorsements" icon={Icons.MessageCircle} description="Manage visual reviews and trust indicators." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminControlGroup title="Deploy Review">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 space-y-4">
                <input type="text" value={newTestimonial.name || ''} onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })} className="w-full bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-white text-sm" placeholder="Reviewer Name" />
                <input type="text" value={newTestimonial.company || ''} onChange={(e) => setNewTestimonial({ ...newTestimonial, company: e.target.value })} className="w-full bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-white text-sm font-mono" placeholder="Internal Group / Agency" />
              </div>
              <ImageUploader placeholder="Avatar URL" value={newTestimonial.image || ''} onChange={(val) => setNewTestimonial({ ...newTestimonial, image: val })} />
            </div>
            <textarea rows={4} value={newTestimonial.quote || ''} onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })} className="w-full bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-white text-sm resize-none" placeholder="Content quote..." />
            <button onClick={() => { if (!newTestimonial.name) return; updateContent(c => { c.testimonials.push({ id: 't-' + Date.now(), name: newTestimonial.name || '', quote: newTestimonial.quote || '', company: newTestimonial.company || '', image: newTestimonial.image || '' }); }); setNewTestimonial({ name: '', company: '', quote: '', image: '' }); }} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl transition uppercase tracking-widest">Commit Review</button>
          </div>
        </AdminControlGroup>
        <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-hide pr-2">
          {content.testimonials.map((t, idx) => (
            <div key={t.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-start gap-4">
              <img 
                src={t.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"} 
                className="w-12 h-12 rounded-full border border-slate-800 shrink-0 object-cover" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop";
                }}
              />
              <div className="flex-1 space-y-2">
                <input value={t.name} onChange={(e) => updateContent(c => { c.testimonials[idx].name = e.target.value; })} className="bg-transparent font-bold text-white text-sm focus:outline-none" />
                <input value={t.company} onChange={(e) => updateContent(c => { c.testimonials[idx].company = e.target.value; })} className="bg-transparent text-[10px] font-mono text-slate-500 uppercase focus:outline-none block" />
                <textarea rows={2} value={t.quote} onChange={(e) => updateContent(c => { c.testimonials[idx].quote = e.target.value; })} className="w-full bg-transparent text-xs text-slate-400 focus:outline-none resize-none" />
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => updateContent(c => { c.testimonials = reorder(c.testimonials, idx, 'up'); })} className="p-1 hover:text-white"><Icons.ChevronUp className="w-4 h-4" /></button>
                <button onClick={() => updateContent(c => { c.testimonials = reorder(c.testimonials, idx, 'down'); })} className="p-1 hover:text-white"><Icons.ChevronDown className="w-4 h-4" /></button>
                <button onClick={() => updateContent(c => { c.testimonials.splice(idx, 1); })} className="p-1 text-red-500/60 hover:text-red-500"><Icons.X className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// 3. COUNTRIES FOOTPRINT
export function AdminCountriesWorkspace({ content, updateContent, reorder }: AdminContentPanelProps) {
  const [newCountry, setNewCountry] = useState<Partial<Country>>({ code: '', name: '' });
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <AdminSectionHeader title="Global Footprint" icon={Icons.Globe} description="Manage the countries/regions linked to our active node map." />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AdminControlGroup title="Add Node Location" className="lg:col-span-1">
          <div className="space-y-4">
             <input value={newCountry.name || ''} onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })} className="w-full bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-white text-sm" placeholder="Country Name" />
             <input value={newCountry.code || ''} onChange={(e) => setNewCountry({ ...newCountry, code: e.target.value.toUpperCase() })} maxLength={2} className="w-full bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-white text-sm font-mono" placeholder="ISO Code (e.g. US)" />
             <button onClick={() => { if (!newCountry.name || !newCountry.code) return; updateContent(c => { c.countries.push({ id: 'c-' + Date.now(), name: newCountry.name || '', code: newCountry.code || '' }); }); setNewCountry({ name: '', code: '' }); }} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl transition uppercase tracking-widest">Connect Node</button>
          </div>
        </AdminControlGroup>
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {content.countries.map((c, idx) => (
            <div key={c.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-col gap-1 relative group">
              <span className="text-xl">{c.code === 'US' ? '🇺🇸' : c.code === 'GB' ? '🇬🇧' : '📍'}</span>
              <span className="text-xs font-bold text-white uppercase tracking-tighter truncate">{c.name}</span>
              <span className="text-[9px] font-mono text-slate-500">{c.code}</span>
              <button onClick={() => updateContent(cArr => { cArr.countries.splice(idx, 1); })} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Icons.XCircle className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// 4. FOOTER & AGENCY INFO
export function AdminFooterWorkspace({ content, updateContent }: Omit<AdminContentPanelProps, 'reorder'>) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <AdminSectionHeader title="Global Footer Architecture" icon={Icons.HardDrive} description="Manage the base navigation layer and organizational metadata." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AdminControlGroup title="Agency Branding">
           <textarea rows={3} value={content.footer.aboutText} onChange={(e) => updateContent(c => { c.footer.aboutText = e.target.value; })} className="w-full bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-white text-sm resize-none" placeholder="About agency..." />
           <div className="space-y-4">
             <input value={content.footer.email} onChange={(e) => updateContent(c => { c.footer.email = e.target.value; })} className="w-full bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-white text-sm" placeholder="Contact Email" />
             <input value={content.footer.address} onChange={(e) => updateContent(c => { c.footer.address = e.target.value; })} className="w-full bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-white text-sm" placeholder="Physical HQ Address" />
             <input value={content.footer.copyrightText} onChange={(e) => updateContent(c => { c.footer.copyrightText = e.target.value; })} className="w-full bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-white text-xs font-mono" placeholder="Copyright String" />
           </div>
        </AdminControlGroup>
        <AdminControlGroup title="Social Media Connections">
            <div className="grid grid-cols-1 gap-2">
            {content.footer.socials.map((soc, sIdx) => (
                <div key={soc.id} className="flex gap-2">
                    <input value={soc.provider} onChange={(e) => updateContent(c => { c.footer.socials[sIdx].provider = e.target.value; })} className="w-24 bg-slate-900 px-2 py-1.5 rounded text-[10px] text-slate-300 border border-slate-800" placeholder="Provider" />
                    <input value={soc.url} onChange={(e) => updateContent(c => { c.footer.socials[sIdx].url = e.target.value; })} className="flex-1 bg-slate-900 px-2 py-1.5 rounded text-[10px] text-slate-300 border border-slate-800" placeholder="URL" />
                    <button onClick={() => updateContent(c => { c.footer.socials.splice(sIdx, 1); })} className="text-red-500/50 hover:text-red-500"><Icons.X size={14}/></button>
                </div>
            ))}
            <button onClick={() => updateContent(c => { c.footer.socials.push({ id: 's-' + Date.now(), provider: 'New', url: '#' }); })} className="text-[10px] uppercase font-mono font-bold text-blue-400 hover:text-blue-300 py-1.5 border border-dashed border-blue-500/20 rounded">+ Add Social Link</button>
            </div>
        </AdminControlGroup>
        <AdminControlGroup title="Navigation Columns">
          <div className="space-y-6">
            {content.footer.sections.map((section, sIdx) => (
              <div key={section.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <input value={section.title} onChange={(e) => updateContent(c => { c.footer.sections[sIdx].title = e.target.value; })} className="bg-transparent font-bold text-white text-sm border-b border-slate-800 w-full pb-1 focus:outline-none" />
                <div className="grid grid-cols-2 gap-2">
                  {section.links.map((link, lIdx) => (
                    <div key={link.id} className="flex gap-1 items-center">
                      <input value={link.label} onChange={(e) => updateContent(c => { c.footer.sections[sIdx].links[lIdx].label = e.target.value; })} className="flex-1 bg-slate-900 px-2 py-1.5 rounded text-[10px] text-slate-300 border border-slate-800" />
                      <input value={link.url} onChange={(e) => updateContent(c => { c.footer.sections[sIdx].links[lIdx].url = e.target.value; })} className="flex-1 bg-slate-900 px-2 py-1.5 rounded text-[10px] text-slate-300 border border-slate-800" placeholder="URL" />
                      <button onClick={() => updateContent(c => { c.footer.sections[sIdx].links.splice(lIdx, 1); })} className="text-red-500/50 hover:text-red-500"><Icons.X size={14}/></button>
                    </div>
                  ))}
                  <button onClick={() => updateContent(c => { c.footer.sections[sIdx].links.push({ id: 'l-' + Date.now(), label: 'New Link', url: '#' }); })} className="text-[10px] uppercase font-mono font-bold text-blue-400 hover:text-blue-300 py-1.5 border border-dashed border-blue-500/20 rounded col-span-2">+ Add Link</button>
                </div>
              </div>
            ))}
          </div>
        </AdminControlGroup>
      </div>
    </motion.div>
  );
}
