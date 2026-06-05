import React from 'react';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';
import { AppContent } from '../../types';
import { AdminSectionHeader, AdminControlGroup } from './AdminCommon';
import { API_ENDPOINTS } from '../../config';

interface AdminContentPanelProps {
  key?: string;
  content: AppContent;
  updateContent: (modifier: (curr: AppContent) => void) => void;
}

export function AdminThemeWorkspace({ content, updateContent }: AdminContentPanelProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <AdminSectionHeader title="Color & Glassmorphism" icon={Icons.Palette} description="System-wide aesthetic configuration and UI transparency FX." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AdminControlGroup title="Global Palette">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase mb-2">Primary Accent (Brand)</label>
              <div className="flex gap-3">
                <input type="color" value={content.theme.primaryColor} onChange={(e) => updateContent(c => { c.theme.primaryColor = e.target.value; })} className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 p-1 cursor-pointer" />
                <input type="text" value={content.theme.primaryColor} onChange={(e) => updateContent(c => { c.theme.primaryColor = e.target.value; })} className="flex-1 bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-white font-mono uppercase" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase mb-2">Secondary Accent</label>
              <div className="flex gap-3">
                <input type="color" value={content.theme.secondaryColor} onChange={(e) => updateContent(c => { c.theme.secondaryColor = e.target.value; })} className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 p-1 cursor-pointer" />
                <input type="text" value={content.theme.secondaryColor} onChange={(e) => updateContent(c => { c.theme.secondaryColor = e.target.value; })} className="flex-1 bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-white font-mono uppercase" />
              </div>
            </div>
          </div>
        </AdminControlGroup>

        <AdminControlGroup title="Glassmorphism FX">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                 <label className="block text-[10px] font-mono text-slate-500 uppercase">System Transparency</label>
                 <span className="text-xs font-mono font-bold text-blue-400">{Math.round(content.theme.bgOpacity * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0.1" max="1" step="0.05"
                value={content.theme.bgOpacity} 
                onChange={(e) => updateContent(c => { c.theme.bgOpacity = parseFloat(e.target.value); })} 
                className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800/60">
              <div>
                <p className="text-xs font-bold text-white uppercase">Dark Glass Mode</p>
                <p className="text-[10px] text-slate-500 font-mono">Enhance contrast for neon overlays</p>
              </div>
              <button 
                onClick={() => updateContent(c => { c.theme.enableDarkGlass = !c.theme.enableDarkGlass; })}
                className={`w-12 h-6 rounded-full transition-all relative ${content.theme.enableDarkGlass ? 'bg-blue-600' : 'bg-slate-800'}`}
              >
                 <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${content.theme.enableDarkGlass ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </AdminControlGroup>

        <AdminControlGroup title="Visual Preview">
           <div className="h-full flex flex-col items-center justify-center gap-4">
              <div 
                className="w-full h-24 rounded-3xl border border-slate-800 flex items-center justify-center backdrop-blur-xl transition-all"
                style={{ 
                  backgroundColor: content.theme.enableDarkGlass ? `rgba(15, 23, 42, ${content.theme.bgOpacity})` : `rgba(255, 255, 255, ${content.theme.bgOpacity})`,
                  borderColor: content.theme.primaryColor + '40'
                }}
              >
                <div 
                  className="px-4 py-2 rounded-lg font-black text-xs uppercase tracking-[0.2em]"
                  style={{ color: content.theme.primaryColor, backgroundColor: content.theme.primaryColor + '10' }}
                >
                  LIVE PREVIEW
                </div>
              </div>
              <p className="text-[10px] font-mono text-slate-600 text-center uppercase tracking-widest">
                 Real-time theme engine simulation
              </p>
           </div>
        </AdminControlGroup>
      </div>
    </motion.div>
  );
}

export function AdminSyncWorkspace({ isSyncing, systemStatus, handleForceSync, handleReset, key }: { isSyncing: boolean; systemStatus: string; handleForceSync: () => void; handleReset: () => void; key?: string }) {
  const targetUrl = API_ENDPOINTS.saveContent;
  const currentHost = typeof window !== 'undefined' ? window.location.origin : '';
  const isCrossDomain = targetUrl.startsWith('http') && !targetUrl.startsWith(currentHost);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <AdminSectionHeader title="Deployment & Environment" icon={Icons.CloudLightning} description="Unified production commits and workspace synchronization." />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AdminControlGroup title="Cloud Production Sync" className="lg:col-span-2">
           <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
                   <Icons.ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                   <h5 className="text-sm font-bold text-white uppercase">One-Click Production Commit</h5>
                   <p className="text-xs text-slate-400 leading-relaxed">
                     Commit current configurations to the global Firestore cluster and local codebase. Changes are live instantly for users on the production domain.
                   </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <p className="text-[9px] font-mono text-slate-500 uppercase">Target Endpoint</p>
                  <p className="text-[11px] font-mono text-blue-400 truncate" title={targetUrl}>{targetUrl}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <p className="text-[9px] font-mono text-slate-500 uppercase">Connectivity Profile</p>
                  <p className={`text-[11px] font-mono ${isCrossDomain ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {isCrossDomain ? 'Orchestrated (Cross-Domain)' : 'Local Cluster (Direct)'}
                  </p>
                </div>
              </div>

              {isCrossDomain && systemStatus === 'offline' && (
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[11px] text-amber-200/80 leading-relaxed font-mono">
                  <Icons.AlertTriangle className="w-4 h-4 text-amber-500 inline mr-2 mb-0.5" />
                  HINT: If you are using this CMS from an external domain (like Vercel), ensure your 
                  <span className="text-amber-400 mx-1">VITE_API_URL</span> environment variable matches your 
                  Cloud Run backend URL.
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button 
                    disabled={isSyncing || systemStatus === 'offline'}
                    onClick={handleForceSync}
                    className={`flex-1 w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-2xl ${
                      isSyncing || systemStatus === 'offline'
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
                    }`}
                  >
                    {isSyncing ? <Icons.RefreshCw className="w-5 h-5 animate-spin" /> : <Icons.Globe className="w-5 h-5" />}
                    {isSyncing ? 'Synchronizing Cluster...' : 'Push to Production'}
                  </button>
                  <div className={`px-4 py-2 rounded-full border text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-2 ${
                    systemStatus === 'online' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-red-500/5 border-red-500/20 text-red-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${systemStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500 animate-ping'}`} />
                    Cluster: {systemStatus.toUpperCase()}
                  </div>
              </div>
           </div>
        </AdminControlGroup>

        <AdminControlGroup title="System Integrity">
           <div className="space-y-6 flex flex-col h-full justify-between">
              <div className="space-y-2">
                 <h5 className="text-sm font-bold text-red-400 uppercase">Emergency Reset</h5>
                 <p className="text-xs text-slate-500 leading-relaxed">
                   Revert all CMS keys back to ACE10 factory defaults. This wipes current production and local JSON states.
                 </p>
              </div>
              <button 
                onClick={handleReset}
                className="w-full py-4 border border-red-500/30 text-red-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-red-500/5 transition-colors"
              >
                Factory Revert
              </button>
           </div>
        </AdminControlGroup>
      </div>
    </motion.div>
  );
}
