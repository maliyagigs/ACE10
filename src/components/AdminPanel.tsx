import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { auth as firebaseAuth } from '../services/firebase';
import { AppContent, Service, PortfolioItem, Testimonial, Stat, HeroImageSub, Country } from '../types';
import { initialContent } from '../data';

interface AdminPanelProps {
  content: AppContent;
  setContent: (content: AppContent) => void;
  user: any;
}

type TabType = 'hero' | 'services' | 'portfolio' | 'testimonials' | 'stats' | 'countries' | 'footer' | 'theme' | 'sync';

interface ImageUploaderProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: 'compact' | 'normal';
  accept?: string;
}

function ImageUploader({ label, value, onChange, placeholder = "https://...", className = "", size = "normal", accept = "image/*" }: ImageUploaderProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const objectUrl = URL.createObjectURL(file);
        onChange(objectUrl);
      } catch (err) {
        console.error("Failed to generate Object URL representation:", err);
      }
    }
  };

  const isLocal = value && (value.startsWith('data:image/') || value.startsWith('blob:'));

  if (size === 'compact') {
    return (
      <div className={`relative flex items-center gap-2 ${className}`}>
        <div className="relative flex-1">
          <input
            type="text"
            value={isLocal ? '[Local Image Uploaded]' : value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isLocal}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-300 focus:outline-none"
            placeholder={placeholder}
          />
          {isLocal && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 text-[9px] font-mono uppercase bg-red-950/40 text-red-500 hover:bg-red-900/30 px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-750 text-slate-300 hover:text-white rounded-lg transition shrink-0 cursor-pointer"
          title="Upload Local File"
        >
          <Icons.Upload className="w-3.5 h-3.5" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">
            {label}
          </label>
          {isLocal && (
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Local Device File
            </span>
          )}
        </div>
      )}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={isLocal ? '[Local Target Payload]' : value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isLocal}
            className={`w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500 placeholder:text-slate-600 ${isLocal ? 'cursor-not-allowed opacity-90' : ''}`}
            placeholder={placeholder}
          />
          {isLocal && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[10px] font-mono uppercase bg-red-950/40 text-red-400 hover:bg-red-900/30 px-2.5 py-1 rounded border border-red-900/20"
            >
              Clear
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Icons.Upload className="w-4 h-4" />
          <span className="hidden sm:inline">Upload File</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
        />
      </div>
      {/* Live Preview block */}
      {value && (
        <div className="flex items-center gap-2.5 bg-slate-950/40 p-2 rounded-xl border border-slate-900 animate-fadeIn">
          {accept.includes('video') ? (
            <video
              src={value}
              className="w-10 h-10 rounded-lg object-cover border border-slate-800"
              muted
              playsInline
            />
          ) : (
            <img
              src={value}
              alt="Preview"
              className="w-10 h-10 rounded-lg object-cover border border-slate-800"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=40&auto=format&fit=crop';
              }}
              referrerPolicy="no-referrer"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-mono text-slate-400 leading-none uppercase">{accept.includes('video') ? 'Video' : 'Image'} Source Preview</p>
            <p className="text-[10px] font-mono text-slate-600 truncate mt-1">
              {value.startsWith('data:') || value.startsWith('blob:') ? `local_device_payload.${accept.includes('video') ? 'mp4' : 'png'}` : value}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPanel({ content, setContent, user }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('hero');

  // Input state creators for new items
  const [newService, setNewService] = useState<Partial<Service>>({ title: '', description: '', icon: 'Sparkles' });
  const [newProject, setNewProject] = useState<Partial<PortfolioItem>>({ title: '', description: '', image: '', webUrl: '', category: 'Web App' });
  const [newTestimonial, setNewTestimonial] = useState<Partial<Testimonial>>({ name: '', company: '', quote: '', image: '' });
  const [newCountry, setNewCountry] = useState<Partial<Country>>({ code: '', name: '' });
  const [newSubImage, setNewSubImage] = useState<Partial<HeroImageSub>>({ url: '', alt: '' });

  // Sync state tracking
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const handleForceSync = async () => {
    setIsSyncing(true);
    setSyncMessage('Authenticating & Writing CMS configs...');
    
    try {
      // 1. Validate session from props first (UI Layer)
      if (!user) {
        throw new Error("User session not found. Please log in first.");
      }

      const currentUser = firebaseAuth.currentUser;
      
      if (!currentUser) {
        throw new Error("Firebase runtime session not found. Re-establishing connection...");
      }

      if (user.email !== "maliyagigs@gmail.com") {
        throw new Error("Unauthorized: Only the admin (maliyagigs@gmail.com) can commit changes to persistent storage.");
      }

      const idToken = await currentUser.getIdToken();

      // Simplified API detection: Uses relative path for same-origin full-stack deployments
      // which is the standard behavior in AI Studio's container runtime.
      const apiBase = '';

      const response = await fetch(`${apiBase}/api/save-content`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(content)
      }).catch(err => {
        throw new Error("Could not connect to the backend server. Please ensure you are online and the server is running.");
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Server responded with status ' + response.status);
      }
      
      setSyncMessage('Changes pushed to production!');
      
      setTimeout(() => {
        setIsSyncing(false);
        setSyncMessage('');
        alert('Changes saved securely to your Production Cloud Database!\n\n1. Your live website now reflects these changes immediately.\n2. Edits have also been written to your workspace data.ts file.\n3. To permanently update your GitHub/Vercel codebase, click "Export" -> "Save to GitHub" in the AI Studio menu.');
      }, 1000);
      
    } catch (err: any) {
      console.error(err);
      setSyncMessage('');
      setIsSyncing(false);
      alert('CMS Sync Failed: ' + (err.message || err));
    }
  };

  // Update whole config
  const updateContent = (modifier: (curr: AppContent) => void) => {
    const copy = JSON.parse(JSON.stringify(content));
    modifier(copy);
    setContent(copy);
  };

  // Reordering index helpers
  const reorder = <T,>(list: T[], index: number, direction: 'up' | 'down'): T[] => {
    const result = [...list];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return list;
    const [removed] = result.splice(index, 1);
    result.splice(targetIdx, 0, removed);
    return result;
  };

  const handleReset = () => {
    if (confirm("Revert all dynamic modifications back to ACE10 factory default settings? This cannot be undone.")) {
      setContent(initialContent);
    }
  };

  return (
    <div className="p-4 sm:p-6 w-full mx-auto bg-slate-900/60 backdrop-blur-xl shadow-2xl min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-800 mb-8">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-mono text-sm uppercase">
            <Icons.Settings className="w-4 h-4 animate-spin-slow" />
            <span>CORE CENTRAL SYSTEM COGNITION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-glass text-white tracking-wider mt-1 uppercase">
            ACE10 CMS Panel
          </h2>
          <p className="text-slate-450 text-sm">
            Modify any text, delete/add projects, change color themes, and reorder core widgets instantly.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button 
            disabled={isSyncing}
            onClick={handleForceSync}
            className={`text-xs font-mono font-bold px-6 py-3 rounded-full transition-all cursor-pointer flex items-center justify-center gap-2 ${
              isSyncing
                ? 'bg-slate-800/80 border border-slate-700 text-slate-400 pointer-events-none'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
            }`}
          >
            {isSyncing ? (
              <>
                <Icons.RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                <span>SAVING...</span>
              </>
            ) : (
              <span>SAVE CHANGES</span>
            )}
          </button>
          
          <button 
            onClick={handleReset}
            className="text-xs font-mono font-bold px-4 py-3 border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/15 rounded-full transition-colors cursor-pointer"
          >
            RESET TO DEFAULT
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 items-start">
        
        {/* Top Side: Dynamic Workspace Rails */}
        <div className="w-full flex-shrink-0">
          <div className="flex flex-row overflow-x-auto pb-4 gap-2 border-b border-slate-800 scrollbar-hide">
            {(
              [
                { id: 'hero', label: 'Hero Workspace', icon: 'Layout' },
                { id: 'services', label: 'Services CMS', icon: 'Layers' },
                { id: 'portfolio', label: 'Portfolio Previews', icon: 'Code' },
                { id: 'testimonials', label: 'Client Reviews', icon: 'MessageSquare' },
                { id: 'stats', label: 'Stats Counters', icon: 'BarChart' },
                { id: 'countries', label: 'Served Footprint', icon: 'Globe' },
                { id: 'footer', label: 'Footer & Agency Info', icon: 'FolderOpen' },
                { id: 'theme', label: 'Color & Glass FX', icon: 'Palette' },
                { id: 'sync', label: 'Vercel & GitHub Sync', icon: 'CloudLightning' },
              ] as const
            ).map((t) => {
              const LucideIcon = (Icons as any)[t.icon] || Icons.CheckCircle;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl flex items-center gap-2 font-semibold text-xs whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === t.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' 
                      : 'bg-slate-900/40 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <LucideIcon className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Bottom: Active Workspace panel */}
        <div className="w-full p-4 md:p-6 bg-slate-950/40 border border-slate-800/80 rounded-3xl space-y-6">
          
          {/* ================= HERO WORKSPACE ================= */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-slate-900 pb-2 flex items-center gap-2">
                <Icons.Layout className="w-5 h-5 text-blue-400" />
                <span>Hero & Brand Identity Workspace</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-slate-550 uppercase tracking-wider mb-2 font-bold text-slate-400">Site Title / Logo</label>
                  <input 
                    type="text"
                    value={content.siteName}
                    onChange={(e) => updateContent(c => { c.siteName = e.target.value; })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500"
                    placeholder="ACE10"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <ImageUploader
                    label="Main Hero Image URL / Local Upload"
                    value={content.hero.image}
                    onChange={(val) => updateContent(c => { c.hero.image = val; })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-550 uppercase tracking-wider mb-2 font-bold text-slate-400">Main Bold Headline</label>
                <input 
                  type="text"
                  value={content.hero.headline}
                  onChange={(e) => updateContent(c => { c.hero.headline = e.target.value; })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500"
                  placeholder="We Build Websites That Grow Your Business"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-550 uppercase tracking-wider mb-2 font-bold text-slate-400">Subheadline Paragraph</label>
                <textarea 
                  rows={3}
                  value={content.hero.subheadline}
                  onChange={(e) => updateContent(c => { c.hero.subheadline = e.target.value; })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Crafting digital experiences..."
                />
              </div>

              {/* Sub images underneath CTAs */}
              <div className="border-t border-slate-900 pt-6 space-y-4">
                <h4 className="text-sm font-bold text-slate-200">Featured Partner Logos Underneath CTA</h4>
                
                {/* Existing list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.hero.subImages?.map((img, idx) => (
                    <div key={img.id} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between gap-4">
                      <img src={img.url} alt={img.alt} className="h-8 max-w-[80px] object-contain rounded bg-slate-950/80 p-1" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white truncate font-mono">{img.alt || 'No Name'}</p>
                        <p className="text-[10px] text-slate-500 truncate">{img.url}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button 
                          onClick={() => updateContent(c => { c.hero.subImages = reorder(c.hero.subImages, idx, 'up'); })}
                          className="p-1 hover:text-white"
                        >
                          <Icons.ChevronUp className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => updateContent(c => { c.hero.subImages = reorder(c.hero.subImages, idx, 'down'); })}
                          className="p-1 hover:text-white"
                        >
                          <Icons.ChevronDown className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => updateContent(c => { c.hero.subImages.splice(idx, 1); })}
                          className="p-1 text-red-400 hover:text-red-300"
                        >
                          <Icons.Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add new subimage */}
                <div className="p-4 rounded-2xl bg-slate-905 border border-slate-800/40 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <div className="md:col-span-2">
                    <ImageUploader
                      label="New Partner Image URL / Local Upload"
                      value={newSubImage.url || ''}
                      onChange={(val) => setNewSubImage({ ...newSubImage, url: val })}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-slate-500 mb-1">Label Name</label>
                    <input 
                      type="text"
                      value={newSubImage.alt || ''}
                      onChange={(e) => setNewSubImage({ ...newSubImage, alt: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 rounded-lg text-xs text-white border border-slate-800 focus:outline-none"
                      placeholder="e.g. Partner X"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!newSubImage.url) return;
                      updateContent(c => {
                        if (!c.hero.subImages) c.hero.subImages = [];
                        c.hero.subImages.push({
                          id: 'sub-' + Date.now(),
                          url: newSubImage.url || '',
                          alt: newSubImage.alt || 'Partner'
                        });
                      });
                      setNewSubImage({ url: '', alt: '' });
                    }}
                    className="md:col-span-3 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition"
                  >
                    Add Brand Logo Underneath
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* ================= SERVICES CMS ================= */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-slate-900 pb-2 flex items-center gap-2">
                <Icons.Layers className="w-5 h-5 text-blue-400" />
                <span>Services Management Console</span>
              </h3>

              {/* Services Section Header Controls */}
              <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Services Section Intro Copy</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Section Subheading Accent</label>
                    <input 
                      type="text"
                      value={content.servicesHeader?.subTitle || "Service Suite"}
                      onChange={(e) => updateContent(c => { 
                        if (!c.servicesHeader) c.servicesHeader = { subTitle: '', title: '', description: '' };
                        c.servicesHeader.subTitle = e.target.value; 
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 text-white text-xs border border-slate-850"
                      placeholder="Service Suite"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Section Title Heading (supports \n newline breaks)</label>
                    <input 
                      type="text"
                      value={content.servicesHeader?.title || "Engineering\nDigital Excellence."}
                      onChange={(e) => updateContent(c => { 
                        if (!c.servicesHeader) c.servicesHeader = { subTitle: '', title: '', description: '' };
                        c.servicesHeader.title = e.target.value; 
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 text-white text-xs border border-slate-850"
                      placeholder="Engineering\nDigital Excellence."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-slate-400 mb-1">Intro Description Paragraph</label>
                    <textarea 
                      rows={2}
                      value={content.servicesHeader?.description || "We deploy precision frameworks to scale your infrastructure, optimize conversion lattices, and define market-leading interfaces."}
                      onChange={(e) => updateContent(c => { 
                        if (!c.servicesHeader) c.servicesHeader = { subTitle: '', title: '', description: '' };
                        c.servicesHeader.description = e.target.value; 
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 text-white text-xs border border-slate-850 resize-none"
                      placeholder="Intro details..."
                    />
                  </div>
                </div>
              </div>

              {/* Add New Service Form */}
              <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Deploy New Service</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Service Title</label>
                    <input 
                      type="text"
                      value={newService.title || ''}
                      onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 text-white text-xs border border-slate-850"
                      placeholder="Custom Website Development"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Lucide Icon String</label>
                    <select 
                      value={newService.icon || 'Sparkles'}
                      onChange={(e) => setNewService({ ...newService, icon: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 text-white text-xs border border-slate-850"
                    >
                      <option value="Layout">Layout (Browser mockup)</option>
                      <option value="ShoppingBag">ShoppingBag (E-Commerce)</option>
                      <option value="Cpu">Cpu (Technical Core)</option>
                      <option value="FileText">FileText (CMS)</option>
                      <option value="Palette">Palette (Art design)</option>
                      <option value="Activity">Activity (Maintenance)</option>
                      <option value="Sparkles">Sparkles (Creative)</option>
                      <option value="ShieldAlert">Shield (Security)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Service Details Description</label>
                  <textarea 
                    rows={2}
                    value={newService.description || ''}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 text-white text-xs border border-slate-850 resize-none"
                    placeholder="Elaborate service deliverables..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!newService.title || !newService.description) return;
                    updateContent(c => {
                      c.services.push({
                        id: 's-' + Date.now(),
                        title: newService.title || '',
                        description: newService.description || '',
                        icon: newService.icon || 'Sparkles'
                      });
                    });
                    setNewService({ title: '', description: '', icon: 'Sparkles' });
                  }}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition"
                >
                  Confirm & Deploy Service
                </button>
              </div>

              {/* Services List Manager */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Existing Services Queue</h4>
                <div className="space-y-3">
                  {content.services.map((s, idx) => (
                    <div key={s.id} className="p-4 bg-slate-905 border border-slate-850 rounded-xl flex items-start gap-4">
                      <div className="flex-1 space-y-2">
                        <input 
                          type="text"
                          value={s.title}
                          onChange={(e) => updateContent(c => { c.services[idx].title = e.target.value; })}
                          className="bg-transparent font-bold text-white text-sm focus:underline focus:outline-none w-full border-b border-transparent focus:border-slate-800 pb-1"
                        />
                        <textarea 
                          rows={2}
                          value={s.description}
                          onChange={(e) => updateContent(c => { c.services[idx].description = e.target.value; })}
                          className="bg-transparent text-xs text-slate-400 focus:outline-none w-full resize-none line-clamp-2 focus:line-clamp-none focus:bg-slate-950 p-1 rounded"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 self-center">
                        <button 
                          onClick={() => updateContent(c => { c.services = reorder(c.services, idx, 'up'); })}
                          className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                          title="Move up"
                        >
                          <Icons.ChevronUp className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => updateContent(c => { c.services = reorder(c.services, idx, 'down'); })}
                          className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                          title="Move down"
                        >
                          <Icons.ChevronDown className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => updateContent(c => { c.services.splice(idx, 1); })}
                          className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-350"
                          title="Delete Service"
                        >
                          <Icons.Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================= PORTFOLIO PREVIEWS ================= */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-slate-900 pb-2 flex items-center gap-2">
                <Icons.Code className="w-5 h-5 text-blue-400" />
                <span>Portfolio & Slideshow Manager</span>
              </h3>

              {/* Portfolio Section Header Controls */}
              <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Portfolio Intro Copy</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Portfolio Main Heading</label>
                    <input 
                      type="text"
                      value={content.portfolioHeader?.title || "Featured Portfolio"}
                      onChange={(e) => updateContent(c => { 
                        if (!c.portfolioHeader) c.portfolioHeader = { title: '', description: '' };
                        c.portfolioHeader.title = e.target.value; 
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 text-white text-xs border border-slate-850"
                      placeholder="Featured Portfolio"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Portfolio Description Subtitle</label>
                    <input 
                      type="text"
                      value={content.portfolioHeader?.description || "Spin through our latest designs. Drag left or right, use your scroll wheel inside the area, or use the controls below to discover our work in an immersive 3D cylinder."}
                      onChange={(e) => updateContent(c => { 
                        if (!c.portfolioHeader) c.portfolioHeader = { title: '', description: '' };
                        c.portfolioHeader.description = e.target.value; 
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 text-white text-xs border border-slate-850"
                      placeholder="Portfolio details..."
                    />
                  </div>
                </div>
              </div>

              {/* Add New Project Card */}
              <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Incorporate New Showcase Project</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Project Name</label>
                    <input 
                      type="text"
                      value={newProject.title || ''}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 rounded-lg text-xs text-white border border-slate-850"
                      placeholder="Solaria Energy Webapp UI"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Live Web URL Preview</label>
                    <input 
                      type="text"
                      value={newProject.webUrl || ''}
                      onChange={(e) => setNewProject({ ...newProject, webUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 rounded-lg text-xs text-white border border-slate-850"
                      placeholder="https://solaria-hq.com"
                    />
                  </div>
                  <div>
                    <ImageUploader
                      label="Vertical Image Mockup URL / Local Upload"
                      value={newProject.image || ''}
                      onChange={(val) => setNewProject({ ...newProject, image: val })}
                      placeholder="https://image-source.com/mock.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Category Bracket</label>
                    <input 
                      type="text"
                      value={newProject.category || ''}
                      onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 rounded-lg text-xs text-white border border-slate-850"
                      placeholder="e.g., E-Commerce / Web App"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Project Short Summary Details</label>
                  <textarea 
                    rows={2}
                    value={newProject.description || ''}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 rounded-lg text-xs text-white border border-slate-850 resize-none"
                    placeholder="Describe specific engineering/design wins..."
                  />
                </div>
                <button
                  onClick={() => {
                    if (!newProject.title || !newProject.description) return;
                    updateContent(c => {
                      c.portfolio.push({
                        id: 'p-' + Date.now(),
                        title: newProject.title || '',
                        description: newProject.description || '',
                        image: newProject.image || 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=400&auto=format&fit=crop',
                        webUrl: newProject.webUrl || '#',
                        category: newProject.category || 'Web App'
                      });
                    });
                    setNewProject({ title: '', description: '', image: '', webUrl: '', category: 'Web App' });
                  }}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition hover:shadow-lg"
                >
                  Verify & Push Project to Slideshow
                </button>
              </div>

              {/* Project Queue list */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Project Slideshow Slider Stack</h4>
                <div className="space-y-4">
                  {content.portfolio.map((p, idx) => (
                    <div key={p.id} className="p-5 bg-slate-905 border border-slate-850 rounded-xl space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-mono text-slate-500 uppercase px-1">Project Name</span>
                          <input 
                            type="text"
                            value={p.title}
                            onChange={(e) => updateContent(c => { c.portfolio[idx].title = e.target.value; })}
                            className="bg-slate-950 font-bold text-white text-xs sm:text-sm focus:underline focus:outline-none px-2.5 py-2 rounded-xl border border-slate-900"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-mono text-slate-500 uppercase px-1">Target Live URL</span>
                          <input 
                            type="text"
                            value={p.webUrl}
                            onChange={(e) => updateContent(c => { c.portfolio[idx].webUrl = e.target.value; })}
                            className="bg-slate-950 text-xs text-blue-400 focus:outline-none px-2.5 py-2 rounded-xl border border-slate-900 italic font-mono"
                            placeholder="Website Target URL"
                          />
                        </div>
                        <div className="md:col-span-2 flex flex-col gap-1">
                          <span className="text-[10px] font-mono text-slate-500 uppercase px-1">Project Mock Image / Local Upload</span>
                          <ImageUploader
                            value={p.image}
                            onChange={(val) => updateContent(c => { c.portfolio[idx].image = val; })}
                            placeholder="Mock Image asset URL"
                            size="compact"
                          />
                        </div>
                        <div className="md:col-span-2 flex flex-col gap-1">
                          <span className="text-[10px] font-mono text-slate-500 uppercase px-1">Category Bracket</span>
                          <input 
                            type="text"
                            value={p.category}
                            onChange={(e) => updateContent(c => { c.portfolio[idx].category = e.target.value; })}
                            className="bg-slate-950 text-xs text-slate-350 focus:outline-none px-2.5 py-2 rounded-xl border border-slate-900"
                            placeholder="Category Bracket"
                          />
                        </div>
                      </div>
                      <textarea 
                        rows={2}
                        value={p.description}
                        onChange={(e) => updateContent(c => { c.portfolio[idx].description = e.target.value; })}
                        className="w-full bg-transparent text-xs text-slate-400 focus:outline-none focus:bg-slate-950 p-2 rounded resize-none"
                      />
                      <div className="flex justify-end gap-1.5 pt-2 border-t border-slate-950">
                        <button 
                          onClick={() => updateContent(c => { c.portfolio = reorder(c.portfolio, idx, 'up'); })}
                          className="p-1 px-2.5 rounded bg-slate-950 text-slate-490 hover:text-white text-[10px] uppercase font-mono font-bold"
                        >
                          Up
                        </button>
                        <button 
                          onClick={() => updateContent(c => { c.portfolio = reorder(c.portfolio, idx, 'down'); })}
                          className="p-1 px-2.5 rounded bg-slate-950 text-slate-490 hover:text-white text-[10px] uppercase font-mono font-bold"
                        >
                          Down
                        </button>
                        <button 
                          onClick={() => updateContent(c => { c.portfolio.splice(idx, 1); })}
                          className="p-1 px-2.5 rounded bg-red-950/40 text-red-400 hover:text-red-350 text-[10px] uppercase font-mono font-bold"
                        >
                          delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================= TESTIMONIALS CMS ================= */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-slate-900 pb-2 flex items-center gap-2">
                <Icons.MessageSquare className="w-5 h-5 text-blue-400" />
                <span>Client Endorsements & Reviews CMS</span>
              </h3>

              {/* Testimonials Section Header Controls */}
              <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Testimonials Intro Copy</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Testimonials Section Headline</label>
                    <input 
                      type="text"
                      value={content.testimonialsHeader?.title || "Client Success Testimonials"}
                      onChange={(e) => updateContent(c => { 
                        if (!c.testimonialsHeader) c.testimonialsHeader = { title: '', description: '' };
                        c.testimonialsHeader.title = e.target.value; 
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 text-white text-xs border border-slate-850"
                      placeholder="Client Success Testimonials"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Testimonials Subsection Subtitle</label>
                    <input 
                      type="text"
                      value={content.testimonialsHeader?.description || "Leading brands grow because we build systems that generate immediate value and sustained authority."}
                      onChange={(e) => updateContent(c => { 
                        if (!c.testimonialsHeader) c.testimonialsHeader = { title: '', description: '' };
                        c.testimonialsHeader.description = e.target.value; 
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 text-white text-xs border border-slate-850"
                      placeholder="Details..."
                    />
                  </div>
                </div>
              </div>

              {/* Add New Testimonial Form */}
              <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Acknowledge New Testimonial Profile</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Client Name</label>
                    <input 
                      type="text"
                      value={newTestimonial.name || ''}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 rounded-lg text-xs text-white border border-slate-850"
                      placeholder="Sophia Lindqvist"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Company & Title</label>
                    <input 
                      type="text"
                      value={newTestimonial.company || ''}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, company: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 rounded-lg text-xs text-white border border-slate-850"
                      placeholder="Director, Aura Corp"
                    />
                  </div>
                  <div>
                    <ImageUploader
                      label="Face Photo URL / Local Upload"
                      value={newTestimonial.image || ''}
                      onChange={(val) => setNewTestimonial({ ...newTestimonial, image: val })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Endorsement Quote Details</label>
                  <textarea 
                    rows={2}
                    value={newTestimonial.quote || ''}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 rounded-lg text-xs text-white border border-slate-850 resize-none"
                    placeholder="ACE10 is exceptional..."
                  />
                </div>
                <button
                  onClick={() => {
                    if (!newTestimonial.name || !newTestimonial.quote) return;
                    updateContent(c => {
                      c.testimonials.push({
                        id: 't-' + Date.now(),
                        name: newTestimonial.name || '',
                        company: newTestimonial.company || '',
                        quote: newTestimonial.quote || '',
                        image: newTestimonial.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
                      });
                    });
                    setNewTestimonial({ name: '', company: '', quote: '', image: '' });
                  }}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition"
                >
                  Confirm & Host Testimonial
                </button>
              </div>

              {/* Endorsements List */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Satisfied Client Review queue</h4>
                <div className="space-y-4">
                  {content.testimonials.map((t, idx) => (
                    <div key={t.id} className="p-4 bg-slate-905 border border-slate-850 rounded-xl space-y-3">
                      <div className="flex gap-4 items-center">
                        <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover bg-slate-905 border border-slate-800" />
                        <div className="grid grid-cols-2 gap-2 flex-1">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] font-mono text-slate-500 uppercase px-1">Name</span>
                            <input 
                              type="text"
                              value={t.name}
                              onChange={(e) => updateContent(c => { c.testimonials[idx].name = e.target.value; })}
                              className="bg-slate-950 text-white font-bold text-xs focus:underline focus:outline-none px-2 py-1 rounded border border-slate-900"
                            />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] font-mono text-slate-500 uppercase px-1">Role / Company</span>
                            <input 
                              type="text"
                              value={t.company}
                              onChange={(e) => updateContent(c => { c.testimonials[idx].company = e.target.value; })}
                              className="bg-slate-950 text-xs text-slate-300 focus:outline-none px-2 py-1 rounded border border-slate-900"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono text-slate-450 uppercase px-1">Endorsement Client Pic Link / Local Image Upload</span>
                        <ImageUploader
                          value={t.image}
                          onChange={(val) => updateContent(c => { c.testimonials[idx].image = val; })}
                          placeholder="Face Photo URL"
                          size="compact"
                        />
                      </div>
                      <textarea 
                        rows={2}
                        value={t.quote}
                        onChange={(e) => updateContent(c => { c.testimonials[idx].quote = e.target.value; })}
                        className="w-full bg-transparent text-xs text-slate-300 focus:outline-none focus:bg-slate-950 p-2 rounded resize-none"
                      />
                      <div className="flex justify-end gap-1.5 pt-2 border-t border-slate-950">
                        <button 
                          onClick={() => updateContent(c => { c.testimonials = reorder(c.testimonials, idx, 'up'); })}
                          className="p-1 px-2 rounded bg-slate-950 text-slate-400 hover:text-white text-[10px] font-mono"
                        >
                          UP
                        </button>
                        <button 
                          onClick={() => updateContent(c => { c.testimonials = reorder(c.testimonials, idx, 'down'); })}
                          className="p-1 px-2 rounded bg-slate-950 text-slate-400 hover:text-white text-[10px] font-mono"
                        >
                          DOWN
                        </button>
                        <button 
                          onClick={() => updateContent(c => { c.testimonials.splice(idx, 1); })}
                          className="p-1 px-2 rounded bg-red-950/40 text-red-400 hover:text-red-300 text-[10px] font-mono"
                        >
                          DELETE
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================= STATS PANEL ================= */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-slate-900 pb-2 flex items-center gap-2">
                <Icons.BarChart className="w-5 h-5 text-blue-400" />
                <span>Stats & Numerical Counters Console</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.stats.map((stat, idx) => (
                  <div key={stat.id} className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-3">
                    <h4 className="text-xs font-mono text-slate-450 uppercase font-bold text-slate-400 mb-1">
                      Stat Frame #{idx + 1}
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Target Value</label>
                        <input 
                          type="number"
                          step="any"
                          value={stat.value}
                          onChange={(e) => updateContent(c => { c.stats[idx].value = Number(e.target.value); })}
                          className="w-full px-3 py-2 bg-slate-950 rounded-lg text-xs text-white border border-slate-800 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Suffix Symbol</label>
                        <input 
                          type="text"
                          value={stat.suffix}
                          onChange={(e) => updateContent(c => { c.stats[idx].suffix = e.target.value; })}
                          className="w-full px-3 py-2 bg-slate-950 rounded-lg text-xs text-white border border-slate-800 focus:outline-none font-mono"
                          placeholder="e.g. +, %"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Label Title</label>
                      <input 
                        type="text"
                        value={stat.label}
                        onChange={(e) => updateContent(c => { c.stats[idx].label = e.target.value; })}
                        className="w-full px-3 py-2 bg-slate-950 rounded-lg text-xs text-white border border-slate-800 focus:outline-none"
                        placeholder="Projects Served"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= SERVED FOOTPRINT ================= */}
          {activeTab === 'countries' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-slate-900 pb-2 flex items-center gap-2">
                <Icons.Globe className="w-5 h-5 text-blue-400" />
                <span>Served Global Footprint</span>
              </h3>

              {/* Countries Section Header Controls */}
              <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Served Countries Intro Copy</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Section Subheading</label>
                    <input 
                      type="text"
                      value={content.countriesHeader?.subTitle || "GLOBAL FOOTPRINT"}
                      onChange={(e) => updateContent(c => { 
                        if (!c.countriesHeader) c.countriesHeader = { subTitle: '', title: '', description: '' };
                        c.countriesHeader.subTitle = e.target.value; 
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 text-white text-xs border border-slate-850"
                      placeholder="GLOBAL FOOTPRINT"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Section Title</label>
                    <input 
                      type="text"
                      value={content.countriesHeader?.title || "Served Countries & Offices"}
                      onChange={(e) => updateContent(c => { 
                        if (!c.countriesHeader) c.countriesHeader = { subTitle: '', title: '', description: '' };
                        c.countriesHeader.title = e.target.value; 
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 text-white text-xs border border-slate-850"
                      placeholder="Served Countries & Offices"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-slate-400 mb-1">Section Paragraph Description</label>
                    <textarea 
                      rows={2}
                      value={content.countriesHeader?.description || "We operate fully remote digital sprints connecting state-of-the-art websites to elite scale-ups across global centers."}
                      onChange={(e) => updateContent(c => { 
                        if (!c.countriesHeader) c.countriesHeader = { subTitle: '', title: '', description: '' };
                        c.countriesHeader.description = e.target.value; 
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 text-white text-xs border border-slate-850 resize-none"
                      placeholder="Description details..."
                    />
                  </div>
                </div>
              </div>

              {/* Add New Country */}
              <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Country Name</label>
                  <input 
                    type="text"
                    value={newCountry.name || ''}
                    onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 rounded-lg text-xs text-white border border-slate-850"
                    placeholder="e.g. Germany"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">ISO 2-Letter Code (For Flag)</label>
                  <input 
                    type="text"
                    value={newCountry.code || ''}
                    onChange={(e) => setNewCountry({ ...newCountry, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-950 rounded-lg text-xs text-white border border-slate-850 font-mono"
                    maxLength={2}
                    placeholder="e.g. DE, US, FR"
                  />
                </div>
                <button
                  onClick={() => {
                    if (!newCountry.name || !newCountry.code) return;
                    updateContent(c => {
                      c.countries.push({
                        id: 'c-' + Date.now(),
                        code: newCountry.code || 'US',
                        name: newCountry.name || ''
                      });
                    });
                    setNewCountry({ name: '', code: '' });
                  }}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition"
                >
                  Verify & Map Country
                </button>
              </div>

              {/* Existing badged list */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-350">Mapped Global Badges</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {content.countries.map((c, idx) => (
                    <div key={c.id} className="p-3 rounded-xl bg-slate-905 border border-slate-850 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <img 
                          src={`https://flagcdn.com/w80/${c.code.toLowerCase()}.png`} 
                          alt="flag" 
                          className="w-6 h-4 object-cover" 
                        />
                        <span className="text-xs font-bold text-white">{c.name}</span>
                        <span className="text-[9px] font-mono bg-slate-950 px-1 py-0.5 rounded text-slate-500">{c.code}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => updateContent(c => { c.countries = reorder(c.countries, idx, 'up'); })}
                          className="p-0.5 hover:text-white"
                        >
                          <Icons.ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => updateContent(c => { c.countries = reorder(c.countries, idx, 'down'); })}
                          className="p-0.5 hover:text-white"
                        >
                          <Icons.ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => updateContent(c => { c.countries.splice(idx, 1); })}
                          className="p-0.5 text-red-400 hover:text-red-300"
                        >
                          <Icons.Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================= FOOTER & AGENCY INFO ================= */}
          {activeTab === 'footer' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-slate-900 pb-2 flex items-center gap-2">
                <Icons.FolderOpen className="w-5 h-5 text-blue-400" />
                <span>Detailed Footer & Agency Information</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-2">HQ Address</label>
                  <input 
                    type="text"
                    value={content.footer.address}
                    onChange={(e) => updateContent(c => { c.footer.address = e.target.value; })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-white text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-2">HQ phone</label>
                  <input 
                    type="text"
                    value={content.footer.phone}
                    onChange={(e) => updateContent(c => { c.footer.phone = e.target.value; })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-white text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-2">HQ Central Email</label>
                  <input 
                    type="text"
                    value={content.footer.email}
                    onChange={(e) => updateContent(c => { c.footer.email = e.target.value; })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-white text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Copyright Line</label>
                  <input 
                    type="text"
                    value={content.footer.copyrightText}
                    onChange={(e) => updateContent(c => { c.footer.copyrightText = e.target.value; })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-white text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Footer About Context Area</label>
                <textarea 
                  rows={2}
                  value={content.footer.aboutText}
                  onChange={(e) => updateContent(c => { c.footer.aboutText = e.target.value; })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-white text-sm focus:outline-none resize-none"
                />
              </div>

              {/* Editable links sections */}
              <div className="border-t border-slate-900 pt-6 space-y-4">
                <h4 className="text-sm font-bold text-slate-350">Footer Link Matrix Columns</h4>
                {content.footer.sections.map((sec, secIdx) => (
                  <div key={sec.id} className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500">Column Title</span>
                      <input 
                        type="text"
                        value={sec.title}
                        onChange={(e) => updateContent(c => { c.footer.sections[secIdx].title = e.target.value; })}
                        className="bg-transparent font-bold text-xs text-white border-b border-transparent focus:border-slate-850 focus:outline-none px-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {sec.links.map((lnk, lnkIdx) => (
                        <div key={lnk.id} className="p-2 rounded bg-slate-950/80 border border-slate-900 grid grid-cols-2 gap-2">
                          <input 
                            type="text"
                            value={lnk.label}
                            onChange={(e) => updateContent(c => { c.footer.sections[secIdx].links[lnkIdx].label = e.target.value; })}
                            className="bg-transparent text-[11px] text-white focus:outline-none focus:bg-slate-900 rounded font-bold px-1"
                            title="Link name"
                          />
                          <input 
                            type="text"
                            value={lnk.url}
                            onChange={(e) => updateContent(c => { c.footer.sections[secIdx].links[lnkIdx].url = e.target.value; })}
                            className="bg-transparent text-[10px] text-slate-450 focus:outline-none focus:bg-slate-900 rounded font-mono px-1 truncate"
                            title="Target address"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* editable contact form title */}
              <div className="border-t border-slate-900 pt-6 space-y-4">
                <h4 className="text-sm font-bold text-slate-350">Contact Quote Form Copy Settings</h4>
                <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Headline Quote Form</label>
                    <input 
                      type="text"
                      value={content.contactHeader?.title || "Inquire a Digital Quote"}
                      onChange={(e) => updateContent(c => { 
                        if (!c.contactHeader) c.contactHeader = { title: '', description: '', submitSuccessTitle: '', submitSuccessDescription: '' };
                        c.contactHeader.title = e.target.value; 
                      })}
                      className="w-full px-3 py-2 bg-slate-950 rounded-lg text-xs text-white border border-slate-850 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Sub-heading Description Copy</label>
                    <input 
                      type="text"
                      value={content.contactHeader?.description || "Brief us regarding your system specs, custom pages, or scale aspirations. Our technical lead responds within one rapid business sprint cycle."}
                      onChange={(e) => updateContent(c => { 
                        if (!c.contactHeader) c.contactHeader = { title: '', description: '', submitSuccessTitle: '', submitSuccessDescription: '' };
                        c.contactHeader.description = e.target.value; 
                      })}
                      className="w-full px-3 py-2 bg-slate-950 rounded-lg text-xs text-white border border-slate-850 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Success Alert Header</label>
                    <input 
                      type="text"
                      value={content.contactHeader?.submitSuccessTitle || "System Logs: Submission Received"}
                      onChange={(e) => updateContent(c => { 
                        if (!c.contactHeader) c.contactHeader = { title: '', description: '', submitSuccessTitle: '', submitSuccessDescription: '' };
                        c.contactHeader.submitSuccessTitle = e.target.value; 
                      })}
                      className="w-full px-3 py-2 bg-slate-950 rounded-lg text-xs text-white border border-slate-850 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Success Alert Body Content</label>
                    <input 
                      type="text"
                      value={content.contactHeader?.submitSuccessDescription || "Our servers successfully logged your digital profile. A representative of ACE10 will contact you immediately."}
                      onChange={(e) => updateContent(c => { 
                        if (!c.contactHeader) c.contactHeader = { title: '', description: '', submitSuccessTitle: '', submitSuccessDescription: '' };
                        c.contactHeader.submitSuccessDescription = e.target.value; 
                      })}
                      className="w-full px-3 py-2 bg-slate-950 rounded-lg text-xs text-white border border-slate-850 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* editable why choose us benefits options */}
              <div className="border-t border-slate-900 pt-6 space-y-4">
                <h4 className="text-sm font-bold text-slate-350">Why Choose Us Benefits Options</h4>
                <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Typewriter Headline Prefix (appends site title dynamically)</label>
                      <input 
                        type="text"
                        value={content.whyChooseUs?.headline || "Why Hundreds of Leaders Trust"}
                        onChange={(e) => updateContent(c => { 
                          if (!c.whyChooseUs) c.whyChooseUs = { headline: '', description: '', benefits: [] };
                          c.whyChooseUs.headline = e.target.value; 
                        })}
                        className="w-full px-3 py-2 bg-slate-950 rounded-lg text-xs text-white border border-slate-850 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Description Paragraph Copy</label>
                      <input 
                        type="text"
                        value={content.whyChooseUs?.description || "We operate at the intersection of technological logic and aesthetic brilliance. No mock layout simulations, only state-of-the-art results tailored to your market."}
                        onChange={(e) => updateContent(c => { 
                          if (!c.whyChooseUs) c.whyChooseUs = { headline: '', description: '', benefits: [] };
                          c.whyChooseUs.description = e.target.value; 
                        })}
                        className="w-full px-3 py-2 bg-slate-950 rounded-lg text-xs text-white border border-slate-850 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="block text-xs font-mono text-slate-500 uppercase font-bold">List of Benefits</span>
                    {(content.whyChooseUs?.benefits || []).map((b, bIdx) => (
                      <div key={b.id || bIdx} className="p-3 bg-slate-950/80 border border-slate-900 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono text-slate-500 mb-1">Benefit Headline Title</label>
                          <input 
                            type="text"
                            value={b.title}
                            onChange={(e) => updateContent(c => { 
                              if (c.whyChooseUs?.benefits[bIdx]) {
                                c.whyChooseUs.benefits[bIdx].title = e.target.value;
                              }
                            })}
                            className="w-full px-2 py-1 bg-slate-900 rounded text-xs text-white focus:outline-none border border-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-slate-500 mb-1">Lucide Icon (e.g. ShieldCheck, Gauge, Smartphone, Compass)</label>
                          <input 
                            type="text"
                            value={b.icon}
                            onChange={(e) => updateContent(c => { 
                              if (c.whyChooseUs?.benefits[bIdx]) {
                                c.whyChooseUs.benefits[bIdx].icon = e.target.value;
                              }
                            })}
                            className="w-full px-2 py-1 bg-slate-900 rounded text-xs text-white focus:outline-none border border-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-slate-500 mb-1">Benefit Description Detailed Copy</label>
                          <textarea 
                            rows={1}
                            value={b.description}
                            onChange={(e) => updateContent(c => { 
                              if (c.whyChooseUs?.benefits[bIdx]) {
                                c.whyChooseUs.benefits[bIdx].description = e.target.value;
                              }
                            })}
                            className="w-full px-2 py-1 bg-slate-900 rounded text-xs text-white focus:outline-none border border-slate-800 resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* footer contactTitle and legal labels settings */}
              <div className="border-t border-slate-900 pt-6 space-y-4">
                <h4 className="text-sm font-bold text-slate-350">Footer Column Titles & Secondary Link Labels</h4>
                <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Address Column Header Label</label>
                    <input 
                      type="text"
                      value={content.footer.contactsTitle || "HQ Studio Contacts"}
                      onChange={(e) => updateContent(c => { c.footer.contactsTitle = e.target.value; })}
                      className="w-full px-3 py-2 bg-slate-950 rounded-lg text-xs text-white border border-slate-850 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Legal link label 1 (Cookies)</label>
                    <input 
                      type="text"
                      value={content.footer.legalCookiesLabel || "Legal Cookies"}
                      onChange={(e) => updateContent(c => { c.footer.legalCookiesLabel = e.target.value; })}
                      className="w-full px-3 py-2 bg-slate-950 rounded-lg text-xs text-white border border-slate-850 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Legal link label 2 (Security Audit)</label>
                    <input 
                      type="text"
                      value={content.footer.securityAuditLabel || "Security Audit"}
                      onChange={(e) => updateContent(c => { c.footer.securityAuditLabel = e.target.value; })}
                      className="w-full px-3 py-2 bg-slate-950 rounded-lg text-xs text-white border border-slate-850 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= THEME CUSTOMIZER ================= */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-slate-900 pb-2 flex items-center gap-2">
                <Icons.Palette className="w-5 h-5 text-blue-400" />
                <span>Theming, Visual Palettes & Glass multipliers</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Primary Color */}
                <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl text-center space-y-3">
                  <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold text-slate-400">Primary Slate / Glow Color</span>
                  <div className="w-14 h-14 rounded-full mx-auto border-2 border-white/20" style={{ backgroundColor: content.theme.primaryColor }} />
                  <input 
                    type="color"
                    value={content.theme.primaryColor}
                    onChange={(e) => updateContent(c => { c.theme.primaryColor = e.target.value; })}
                    className="w-full h-8 bg-transparent cursor-pointer border-0"
                  />
                  <input 
                    type="text" 
                    value={content.theme.primaryColor} 
                    onChange={(e) => updateContent(c => { c.theme.primaryColor = e.target.value; })}
                    className="w-full text-center font-mono text-xs text-white bg-slate-950 p-1.5 rounded focus:outline-none"
                  />
                </div>

                {/* Secondary Color */}
                <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl text-center space-y-3">
                  <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold text-slate-400">Secondary Flow Color</span>
                  <div className="w-14 h-14 rounded-full mx-auto border-2 border-white/20" style={{ backgroundColor: content.theme.secondaryColor }} />
                  <input 
                    type="color"
                    value={content.theme.secondaryColor}
                    onChange={(e) => updateContent(c => { c.theme.secondaryColor = e.target.value; })}
                    className="w-full h-8 bg-transparent cursor-pointer border-0"
                  />
                  <input 
                    type="text" 
                    value={content.theme.secondaryColor} 
                    onChange={(e) => updateContent(c => { c.theme.secondaryColor = e.target.value; })}
                    className="w-full text-center font-mono text-xs text-white bg-slate-950 p-1.5 rounded focus:outline-none"
                  />
                </div>

                {/* Accent Color */}
                <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl text-center space-y-3">
                  <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold text-slate-400">Accent Highlight Color</span>
                  <div className="w-14 h-14 rounded-full mx-auto border-2 border-white/20" style={{ backgroundColor: content.theme.accentColor }} />
                  <input 
                    type="color"
                    value={content.theme.accentColor}
                    onChange={(e) => updateContent(c => { c.theme.accentColor = e.target.value; })}
                    className="w-full h-8 bg-transparent cursor-pointer border-0"
                  />
                  <input 
                    type="text" 
                    value={content.theme.accentColor} 
                    onChange={(e) => updateContent(c => { c.theme.accentColor = e.target.value; })}
                    className="w-full text-center font-mono text-xs text-white bg-slate-950 p-1.5 rounded focus:outline-none"
                  />
                </div>

              </div>

              {/* Opacity multi config */}
              <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-slate-450 uppercase mb-2 font-bold text-slate-450">Cyberglass Blur Opacity Multiplier: <strong>{content.theme.bgOpacity}</strong></label>
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={content.theme.bgOpacity}
                    onChange={(e) => updateContent(c => { c.theme.bgOpacity = Number(e.target.value); })}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">Full-Dark Immersive Canvas</p>
                    <p className="text-[10px] text-slate-500">Enable high-contrast glass filters</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={content.theme.enableDarkGlass}
                    onChange={(e) => updateContent(c => { c.theme.enableDarkGlass = e.target.checked; })}
                    className="w-5 h-5 rounded border-slate-850 accent-blue-600 bg-slate-950"
                  />
                </div>
              </div>

            </div>
          )}

          {/* ================= VERCEL & GITHUB SYNC WORKSPACE ================= */}
          {activeTab === 'sync' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-slate-900 pb-2 flex items-center gap-2">
                <Icons.CloudLightning className="w-5 h-5 text-blue-400 animate-pulse" />
                <span>Save Edits to Source Code</span>
              </h3>

              {/* Realtime 1-Click Publisher */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-blue-950/30 to-slate-900/60 border border-blue-500/20 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div className="space-y-1.5 max-w-xl">
                    <h4 className="text-base font-black text-white flex items-center gap-2">
                      <Icons.Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                      <span>Save Config to AI Studio Workspace</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Click the button below to write your current layout, colors, and content modifications directly into the filesystem (<code className="bg-slate-950/80 px-1 py-0.5 rounded text-blue-400">src/data.ts</code>). <strong>Then, you must Export to GitHub</strong> via the top right menu to trigger your Vercel deploy.
                    </p>
                  </div>
                  <button
                    disabled={isSyncing}
                    onClick={handleForceSync}
                    className={`px-6 py-4 rounded-2xl text-xs font-mono font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-3 shrink-0 cursor-pointer text-white shadow-lg ${
                      isSyncing 
                        ? 'bg-slate-800/80 border border-slate-700 pointer-events-none' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.02] shadow-blue-500/15'
                    }`}
                  >
                    {isSyncing ? (
                      <>
                        <Icons.RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                        <span>SAVING...</span>
                      </>
                    ) : (
                      <>
                        <Icons.Zap className="w-4 h-4 text-amber-300 fill-amber-350 animate-bounce" />
                        <span>SAVE WORKSPACE CODE</span>
                      </>
                    )}
                  </button>
                </div>
                {isSyncing && (
                  <div className="pt-3.5 border-t border-slate-800 flex items-center gap-2 text-xs font-mono text-blue-400 animate-pulse">
                    <Icons.Settings className="w-4 h-4 animate-spin text-blue-400" />
                    <span className="font-bold">STATUS:</span>
                    <span>{syncMessage}</span>
                  </div>
                )}
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                    <Icons.Info className="w-6 h-6 shrink-0" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">How to actually trigger Vercel:</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      This panel allows you to customize the content in real time. Saving to the workspace writes your settings to the AI Studio container. 
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed mt-2 font-semibold text-amber-500">
                       To publish live to Vercel, you must manually push these changes to GitHub: Look for the "Export" or "Share" menu at the top right of the AI Studio interface and select "Save to GitHub". (AI Studio does not push to your GitHub account automatically behind the scenes).
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Option 1: Live Clipboard Transfer */}
                <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/80 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">1</div>
                      <h4 className="font-bold text-sm text-slate-200">Copy & Ask AI to Apply</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Click the button below to copy your custom CMS configuration. Then simply <strong>paste it</strong> into your chat with me (the AI Coder) and ask: 
                      <em className="block text-slate-350 bg-slate-955/60 p-2 rounded mt-2 border border-slate-900 not-italic font-mono text-[11px]">
                        "Please update my default project settings with this current configuration"
                      </em>
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const fileContent = `import { AppContent } from './types';\n\nexport const initialContent: AppContent = ${JSON.stringify(content, null, 2)};\n`;
                      navigator.clipboard.writeText(fileContent)
                        .then(() => alert("CMS Configuration copied to clipboard! Paste it in the chat and ask me to apply it."))
                        .catch(() => alert("Could not copy automatically. Please copy the code manually from the text block below."));
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-extrabold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Icons.Copy className="w-4 h-4 animate-pulse" />
                    <span>COPY CODE FOR AI CHAT</span>
                  </button>
                </div>

                {/* Option 2: Code File Downloader */}
                <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/80 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs font-mono font-bold">2</div>
                      <h4 className="font-bold text-sm text-slate-200">Download data.ts File</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Alternatively, click below to generate a replacement <code className="bg-slate-950 px-1 text-blue-400">data.ts</code> file representing all your changes. You can drag-and-drop or replace the file in your IDE / workspace manually before pushing to GitHub.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const fileContent = `import { AppContent } from './types';\n\nexport const initialContent: AppContent = ${JSON.stringify(content, null, 2)};\n`;
                      const blob = new Blob([fileContent], { type: 'text/typescript' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'data.ts';
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-mono font-extrabold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Icons.Download className="w-4 h-4" />
                    <span>DOWNLOAD CUSTOM DATA.TS</span>
                  </button>
                </div>
              </div>

              {/* Raw JSON Code Block display */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider font-extrabold">Raw Configuration Payload (data.ts)</h4>
                  <span className="text-[10px] text-slate-550 font-mono">Lines: {JSON.stringify(content, null, 2).split('\n').length + 3}</span>
                </div>
                <div className="relative">
                  <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-900/60 max-h-[160px] overflow-y-auto text-[10px] font-mono text-slate-400 select-all scrollbar-thin">
                    {`import { AppContent } from './types';\n\nexport const initialContent: AppContent = ${JSON.stringify(content, null, 2)};`}
                  </pre>
                  <div className="absolute right-3.5 bottom-3 text-[9px] uppercase tracking-wider font-mono text-slate-650 pointer-events-none">
                    Select All to copy
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
