import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContent, Service, PortfolioItem, HeroImageSub } from '../../types';
import { ImageUploader, AdminSectionHeader, AdminControlGroup } from './AdminCommon';

interface AdminContentPanelProps {
  key?: string;
  content: AppContent;
  updateContent: (modifier: (curr: AppContent) => void) => void;
  reorder: <T>(list: T[], index: number, direction: 'up' | 'down') => T[];
}

// 1. HERO WORKSPACE
export function AdminHeroWorkspace({ content, updateContent, reorder }: AdminContentPanelProps) {
  const [newSubImage, setNewSubImage] = useState<Partial<HeroImageSub>>({ url: '', alt: '' });

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <AdminSectionHeader 
        title="Hero & Brand Identity" 
        icon={Icons.Layout} 
        description="Core cognitive branding and top-level entry messaging."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminControlGroup title="Site Identity">
          <div>
            <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-2">Global Logo / Site Name</label>
            <input 
              type="text"
              value={content.siteName}
              onChange={(e) => updateContent(c => { c.siteName = e.target.value; })}
              className="w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500 transition-all font-mono"
            />
          </div>
          <ImageUploader
            label="Main Desktop Hero Asset"
            value={content.hero.image}
            onChange={(val) => updateContent(c => { c.hero.image = val; })}
          />
          <div>
            <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-2">Background Animation</label>
            <select 
              value={content.hero.animationType}
              onChange={(e) => updateContent(c => { c.hero.animationType = e.target.value as any; })}
              className="w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500 transition-all font-mono"
            >
              <option value="particles">Particles</option>
              <option value="gradient">Gradient Flow</option>
              <option value="none">None</option>
            </select>
          </div>
        </AdminControlGroup>

        <AdminControlGroup title="Primary Messaging">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-2">High-Impact Headline</label>
              <input 
                type="text"
                value={content.hero.headline}
                onChange={(e) => updateContent(c => { c.hero.headline = e.target.value; })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-2">Sub-Text Context</label>
              <textarea 
                rows={4}
                value={content.hero.subheadline}
                onChange={(e) => updateContent(c => { c.hero.subheadline = e.target.value; })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500 transition-all resize-none"
              />
            </div>
          </div>
        </AdminControlGroup>
      </div>

      <AdminControlGroup title="Featured Ecosystem Logos (Post-CTA)">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <AnimatePresence>
            {content.hero.subImages?.map((img, idx) => (
              <motion.div 
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 group flex flex-col gap-3 relative overflow-hidden"
              >
                <div className="flex justify-center h-12">
                   <img src={img.url} alt={img.alt} className="max-h-full max-w-full object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-mono text-slate-400 truncate">{img.alt || 'Unnamed Brand'}</p>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => updateContent(c => { c.hero.subImages = reorder(c.hero.subImages, idx, 'up'); })} className="p-1 hover:text-blue-400 transition-colors"><Icons.ChevronLeft className="w-4 h-4" /></button>
                  <button onClick={() => updateContent(c => { c.hero.subImages = reorder(c.hero.subImages, idx, 'down'); })} className="p-1 hover:text-blue-400 transition-colors"><Icons.ChevronRight className="w-4 h-4" /></button>
                  <button onClick={() => updateContent(c => { c.hero.subImages.splice(idx, 1); })} className="p-1 text-red-500/60 hover:text-red-500 transition-colors"><Icons.X className="w-4 h-4" /></button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
          <div className="lg:col-span-2">
            <ImageUploader
              label="Add New Brand Asset"
              value={newSubImage.url || ''}
              onChange={(val) => setNewSubImage({ ...newSubImage, url: val })}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Display Label</label>
              <input 
                type="text"
                value={newSubImage.alt || ''}
                onChange={(e) => setNewSubImage({ ...newSubImage, alt: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-950 rounded-xl text-xs text-white border border-slate-800 focus:outline-none"
                placeholder="Client Name"
              />
            </div>
            <button
              onClick={() => {
                if (!newSubImage.url) return;
                updateContent(c => {
                  if (!c.hero.subImages) c.hero.subImages = [];
                  c.hero.subImages.push({ id: 'sub-' + Date.now(), url: newSubImage.url || '', alt: newSubImage.alt || 'Partner' });
                });
                setNewSubImage({ url: '', alt: '' });
              }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl transition shadow-lg shadow-blue-600/20 uppercase tracking-widest"
            >
              Add Brand
            </button>
          </div>
        </div>
      </AdminControlGroup>
    </motion.div>
  );
}

// 2. SERVICES CMS
export function AdminServicesWorkspace({ content, updateContent, reorder }: AdminContentPanelProps) {
  const [newService, setNewService] = useState<Partial<Service>>({ title: '', description: '', icon: 'Sparkles' });

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <AdminSectionHeader 
        title="Service Suite CMS" 
        icon={Icons.Layers} 
        description="Define and deploy specialized service offerings."
      />

      <AdminControlGroup title="Header Intelligence">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase font-mono text-slate-500 mb-1.5 font-black">Subheading Accent</label>
            <input 
              type="text"
              value={content.servicesHeader?.subTitle || ""}
              onChange={(e) => updateContent(c => { if (!c.servicesHeader) c.servicesHeader = { subTitle: '', title: '', description: '' }; c.servicesHeader.subTitle = e.target.value; })}
              className="w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-mono text-slate-500 mb-1.5 font-black">Main Title Heading</label>
            <input 
              type="text"
              value={content.servicesHeader?.title || ""}
              onChange={(e) => updateContent(c => { if (!c.servicesHeader) c.servicesHeader = { subTitle: '', title: '', description: '' }; c.servicesHeader.title = e.target.value; })}
              className="w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-white text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase font-mono text-slate-500 mb-1.5 font-black">Description Context</label>
            <textarea 
              rows={2}
              value={content.servicesHeader?.description || ""}
              onChange={(e) => updateContent(c => { if (!c.servicesHeader) c.servicesHeader = { subTitle: '', title: '', description: '' }; c.servicesHeader.description = e.target.value; })}
              className="w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-white text-sm resize-none"
            />
          </div>
        </div>
      </AdminControlGroup>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <AdminControlGroup title="Deploy New Offering">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-mono text-slate-500 mb-1.5 font-black">Service Title</label>
                <input 
                  type="text"
                  value={newService.title || ''}
                  onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  placeholder="e.g. UX Design"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono text-slate-500 mb-1.5 font-black">Icon Category</label>
                <select 
                  value={newService.icon || 'Sparkles'}
                  onChange={(e) => setNewService({ ...newService, icon: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                >
                  <option value="Layout">Layout</option>
                  <option value="Cpu">Processing</option>
                  <option value="Palette">Creative</option>
                  <option value="Sparkles">Premium</option>
                  <option value="Code">Engineering</option>
                  <option value="TrendingUp">Analytics</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono text-slate-500 mb-1.5 font-black">Service Summary</label>
                <textarea 
                  rows={4}
                  value={newService.description || ''}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm resize-none"
                  placeholder="Deliverable details..."
                />
              </div>
              <button
                onClick={() => {
                  if (!newService.title) return;
                  updateContent(c => { c.services.push({ id: 's-' + Date.now(), title: newService.title || '', description: newService.description || '', icon: newService.icon }); });
                  setNewService({ title: '', description: '', icon: 'Sparkles' });
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl transition uppercase tracking-widest"
              >
                Launch Service
              </button>
            </div>
          </AdminControlGroup>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest px-2">Active Services Matrix</h4>
          <div className="grid grid-cols-1 gap-4">
            {content.services.map((s, idx) => (
              <motion.div 
                key={s.id}
                layout
                className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-start gap-4 group hover:border-blue-500/30 transition-all"
              >
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-all transform group-hover:scale-110">
                  {React.createElement((Icons as any)[s.icon || 'Sparkles'] || Icons.CheckCircle, { className: 'w-5 h-5' })}
                </div>
                <div className="flex-1 space-y-2">
                  <input 
                    type="text"
                    value={s.title}
                    onChange={(e) => updateContent(c => { c.services[idx].title = e.target.value; })}
                    className="w-full bg-transparent font-bold text-white text-lg focus:outline-none"
                  />
                  <textarea 
                    rows={2}
                    value={s.description}
                    onChange={(e) => updateContent(c => { c.services[idx].description = e.target.value; })}
                    className="w-full bg-transparent text-sm text-slate-400 focus:outline-none resize-none"
                  />
                </div>
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => updateContent(c => { c.services = reorder(c.services, idx, 'up'); })} className="p-2 bg-slate-950 rounded-lg hover:text-blue-400"><Icons.ArrowUp className="w-4 h-4" /></button>
                   <button onClick={() => updateContent(c => { c.services = reorder(c.services, idx, 'down'); })} className="p-2 bg-slate-950 rounded-lg hover:text-blue-400"><Icons.ArrowDown className="w-4 h-4" /></button>
                   <button onClick={() => updateContent(c => { c.services.splice(idx, 1); })} className="p-2 bg-red-950/40 rounded-lg text-red-500"><Icons.Trash2 className="w-4 h-4" /></button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-900 pt-8 mt-8 space-y-8">
        <h3 className="text-sm font-mono font-black text-blue-500 uppercase tracking-widest px-2">3D Neon Lab & Spotlight Deck Customizations</h3>

        {/* 3D Shapes & Spotlight Deck CMS Customizations */}
        <AdminControlGroup title="3D Interactive Suite Titles & Headers">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Section 1 */}
            <div className="space-y-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800">
              <h5 className="text-[11px] font-mono font-bold text-teal-400 uppercase tracking-wider">Shape System Section (Bento Grid)</h5>
              <div>
                <label className="block text-[9px] font-mono text-slate-500 uppercase font-bold mb-1">Title (English)</label>
                <input 
                  type="text"
                  value={content.servicesLab?.secGridTitleEn || ""}
                  onChange={(e) => updateContent(c => { if(!c.servicesLab) c.servicesLab={}; c.servicesLab.secGridTitleEn = e.target.value; })}
                  className="w-full px-3 py-2 bg-slate-950 rounded-xl text-xs text-white border border-slate-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[9px] font-mono text-slate-500 uppercase font-bold mb-1">Title (Arabic)</label>
                <input 
                  type="text"
                  value={content.servicesLab?.secGridTitleAr || ""}
                  onChange={(e) => updateContent(c => { if(!c.servicesLab) c.servicesLab={}; c.servicesLab.secGridTitleAr = e.target.value; })}
                  className="w-full px-3 py-2 bg-slate-950 rounded-xl text-xs text-white border border-slate-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Subtitle (English)</label>
                <textarea 
                  rows={2}
                  value={content.servicesLab?.secGridSubEn || ""}
                  onChange={(e) => updateContent(c => { if(!c.servicesLab) c.servicesLab={}; c.servicesLab.secGridSubEn = e.target.value; })}
                  className="w-full px-3 py-2 bg-slate-950 rounded-xl text-xs text-white border border-slate-800 focus:outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Subtitle (Arabic)</label>
                <textarea 
                  rows={2}
                  value={content.servicesLab?.secGridSubAr || ""}
                  onChange={(e) => updateContent(c => { if(!c.servicesLab) c.servicesLab={}; c.servicesLab.secGridSubAr = e.target.value; })}
                  className="w-full px-3 py-2 bg-slate-950 rounded-xl text-xs text-white border border-slate-800 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800">
              <h5 className="text-[11px] font-mono font-bold text-violet-400 uppercase tracking-wider">Spotlight Deck Section (Carousel)</h5>
              <div>
                <label className="block text-[9px] font-mono text-slate-500 uppercase font-bold mb-1">Title (English)</label>
                <input 
                  type="text"
                  value={content.servicesLab?.secOrbitTitleEn || ""}
                  onChange={(e) => updateContent(c => { if(!c.servicesLab) c.servicesLab={}; c.servicesLab.secOrbitTitleEn = e.target.value; })}
                  className="w-full px-3 py-2 bg-slate-950 rounded-xl text-xs text-white border border-slate-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[9px] font-mono text-slate-500 uppercase font-bold mb-1">Title (Arabic)</label>
                <input 
                  type="text"
                  value={content.servicesLab?.secOrbitTitleAr || ""}
                  onChange={(e) => updateContent(c => { if(!c.servicesLab) c.servicesLab={}; c.servicesLab.secOrbitTitleAr = e.target.value; })}
                  className="w-full px-3 py-2 bg-slate-950 rounded-xl text-xs text-white border border-slate-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Subtitle (English)</label>
                <textarea 
                  rows={2}
                  value={content.servicesLab?.secOrbitSubEn || ""}
                  onChange={(e) => updateContent(c => { if(!c.servicesLab) c.servicesLab={}; c.servicesLab.secOrbitSubEn = e.target.value; })}
                  className="w-full px-3 py-2 bg-slate-950 rounded-xl text-xs text-white border border-slate-800 focus:outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Subtitle (Arabic)</label>
                <textarea 
                  rows={2}
                  value={content.servicesLab?.secOrbitSubAr || ""}
                  onChange={(e) => updateContent(c => { if(!c.servicesLab) c.servicesLab={}; c.servicesLab.secOrbitSubAr = e.target.value; })}
                  className="w-full px-3 py-2 bg-slate-950 rounded-xl text-xs text-white border border-slate-800 focus:outline-none resize-none"
                />
              </div>
            </div>
            
            {/* CTA edit */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800">
              <div>
                <label className="block text-[9px] font-mono text-slate-500 uppercase font-bold mb-1">"Open/CTA" Label (English)</label>
                <input 
                  type="text"
                  value={content.servicesLab?.ctaMoreEn || ""}
                  onChange={(e) => updateContent(c => { if(!c.servicesLab) c.servicesLab={}; c.servicesLab.ctaMoreEn = e.target.value; })}
                  className="w-full px-4 py-2.5 bg-slate-950 rounded-xl text-xs text-white border border-slate-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[9px] font-mono text-slate-500 uppercase font-bold mb-1">"Open/CTA" Label (Arabic)</label>
                <input 
                  type="text"
                  value={content.servicesLab?.ctaMoreAr || ""}
                  onChange={(e) => updateContent(c => { if(!c.servicesLab) c.servicesLab={}; c.servicesLab.ctaMoreAr = e.target.value; })}
                  className="w-full px-4 py-2.5 bg-slate-950 rounded-xl text-xs text-white border border-slate-800 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </AdminControlGroup>

        <AdminControlGroup title="6 Shape System Bento Card Textures">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {(content.servicesLab?.cards || []).map((card, idx) => (
              <div key={card.id || idx} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-3">
                <span className="text-[10px] font-mono font-bold text-teal-400">Card 0{idx+1} Layout Preset: {idx === 0 ? 'Orb Mint' : idx === 1 ? 'Chamfer Violet' : idx === 2 ? 'Solar' : idx === 3 ? 'Cinema Wide' : idx === 4 ? 'Prism' : 'Void'}</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[8px] font-mono text-slate-500 mb-1">Title (En)</label>
                    <input 
                      type="text"
                      value={card.titleEn}
                      onChange={(e) => updateContent(c => { if (c.servicesLab?.cards?.[idx]) { c.servicesLab.cards[idx].titleEn = e.target.value; } })}
                      className="w-full px-2.5 py-1.5 bg-slate-950 text-xs rounded-lg text-white border border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-mono text-slate-500 mb-1">Title (Ar)</label>
                    <input 
                      type="text"
                      value={card.titleAr}
                      onChange={(e) => updateContent(c => { if (c.servicesLab?.cards?.[idx]) { c.servicesLab.cards[idx].titleAr = e.target.value; } })}
                      className="w-full px-2.5 py-1.5 bg-slate-950 text-xs rounded-lg text-white border border-slate-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[8px] font-mono text-slate-500 mb-1">Description (En)</label>
                  <textarea 
                    rows={2}
                    value={card.textEn}
                    onChange={(e) => updateContent(c => { if (c.servicesLab?.cards?.[idx]) { c.servicesLab.cards[idx].textEn = e.target.value; } })}
                    className="w-full px-2.5 py-1.5 bg-slate-950 text-xs rounded-lg text-white border border-slate-800 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-mono text-slate-500 mb-1">Description (Ar)</label>
                  <textarea 
                    rows={2}
                    value={card.textAr}
                    onChange={(e) => updateContent(c => { if (c.servicesLab?.cards?.[idx]) { c.servicesLab.cards[idx].textAr = e.target.value; } })}
                    className="w-full px-2.5 py-1.5 bg-slate-950 text-xs rounded-lg text-white border border-slate-800 resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </AdminControlGroup>

        <AdminControlGroup title="4 Spotlight Deck Panels">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {(content.servicesLab?.carousel || []).map((panel, idx) => (
              <div key={panel.id || idx} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-3">
                <span className="text-[10px] font-mono font-bold text-violet-400">Spotlight Panel 0{idx+1}</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[8px] font-mono text-slate-500 mb-1">Title (En)</label>
                    <input 
                      type="text"
                      value={panel.titleEn}
                      onChange={(e) => updateContent(c => { if (c.servicesLab?.carousel?.[idx]) { c.servicesLab.carousel[idx].titleEn = e.target.value; } })}
                      className="w-full px-2.5 py-1.5 bg-slate-950 text-xs rounded-lg text-white border border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-mono text-slate-500 mb-1">Title (Ar)</label>
                    <input 
                      type="text"
                      value={panel.titleAr}
                      onChange={(e) => updateContent(c => { if (c.servicesLab?.carousel?.[idx]) { c.servicesLab.carousel[idx].titleAr = e.target.value; } })}
                      className="w-full px-2.5 py-1.5 bg-slate-950 text-xs rounded-lg text-white border border-slate-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[8px] font-mono text-slate-500 mb-1">Description (En)</label>
                  <textarea 
                    rows={2}
                    value={panel.textEn}
                    onChange={(e) => updateContent(c => { if (c.servicesLab?.carousel?.[idx]) { c.servicesLab.carousel[idx].textEn = e.target.value; } })}
                    className="w-full px-2.5 py-1.5 bg-slate-950 text-xs rounded-lg text-white border border-slate-800 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-mono text-slate-500 mb-1">Description (Ar)</label>
                  <textarea 
                    rows={2}
                    value={panel.textAr}
                    onChange={(e) => updateContent(c => { if (c.servicesLab?.carousel?.[idx]) { c.servicesLab.carousel[idx].textAr = e.target.value; } })}
                    className="w-full px-2.5 py-1.5 bg-slate-950 text-xs rounded-lg text-white border border-slate-800 resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </AdminControlGroup>
      </div>
    </motion.div>
  );
}

// 3. PORTFOLIO MANAGER
export function AdminPortfolioWorkspace({ content, updateContent, reorder }: AdminContentPanelProps) {
  const [newProject, setNewProject] = useState<Partial<PortfolioItem>>({ title: '', description: '', image: '', webUrl: '', category: 'Web App' });

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <AdminSectionHeader 
        title="Showcase Portfolio" 
        icon={Icons.Camera} 
        description="High-fidelity 3D immersive project manager."
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <AdminControlGroup title="Deploy Visual Case Study">
            <div className="space-y-4">
              <input 
                type="text"
                value={newProject.title || ''}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                placeholder="Project Title"
              />
              <ImageUploader
                value={newProject.image || ''}
                onChange={(val) => setNewProject({ ...newProject, image: val })}
                placeholder="Project Image"
              />
              <input 
                type="text"
                value={newProject.category || ''}
                onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono uppercase"
                placeholder="Category"
              />
              <textarea 
                rows={4}
                value={newProject.description || ''}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm resize-none"
                placeholder="Summary..."
              />
              <button
                onClick={() => {
                  if (!newProject.title) return;
                  updateContent(c => { c.portfolio.push({ id: 'p-' + Date.now(), title: newProject.title || '', description: newProject.description || '', image: newProject.image || '', webUrl: newProject.webUrl || '#', category: newProject.category || 'App' }); });
                  setNewProject({ title: '', description: '', image: '', webUrl: '', category: 'Web App' });
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl transition uppercase tracking-widest"
              >
                Commit Project
              </button>
            </div>
          </AdminControlGroup>
        </div>

        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.portfolio.map((p, idx) => (
              <motion.div 
                key={p.id}
                layout
                className="group relative h-80 rounded-3xl overflow-hidden border border-slate-800/60 bg-slate-900 shadow-2xl"
              >
                <img src={p.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 flex flex-col justify-end gap-2">
                  <div className="flex items-center gap-2">
                     <span className="px-2 py-0.5 rounded bg-blue-500/20 border border-blue-500/30 text-[9px] font-mono font-bold text-blue-400 uppercase tracking-widest">{p.category}</span>
                  </div>
                  <input 
                    type="text"
                    value={p.title}
                    onChange={(e) => updateContent(c => { c.portfolio[idx].title = e.target.value; })}
                    className="bg-transparent font-bold text-white text-xl focus:outline-none"
                  />
                  <textarea 
                    rows={2}
                    value={p.description}
                    onChange={(e) => updateContent(c => { c.portfolio[idx].description = e.target.value; })}
                    className="bg-transparent text-xs text-slate-400 focus:outline-none resize-none"
                  />
                </div>
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                   <button onClick={() => updateContent(c => { c.portfolio = reorder(c.portfolio, idx, 'up'); })} className="p-2 bg-slate-950/80 backdrop-blur-md rounded-full border border-slate-800 text-white hover:text-blue-400"><Icons.ChevronUp className="w-4 h-4" /></button>
                   <button onClick={() => updateContent(c => { c.portfolio = reorder(c.portfolio, idx, 'down'); })} className="p-2 bg-slate-950/80 backdrop-blur-md rounded-full border border-slate-800 text-white hover:text-blue-400"><Icons.ChevronDown className="w-4 h-4" /></button>
                   <button onClick={() => updateContent(c => { c.portfolio.splice(idx, 1); })} className="p-2 bg-red-950/80 backdrop-blur-md rounded-full border border-slate-800 text-red-500 hover:bg-red-500 hover:text-white"><Icons.Trash2 className="w-4 h-4" /></button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
