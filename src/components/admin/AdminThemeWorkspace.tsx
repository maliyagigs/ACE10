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
  const isMissingApiUrl = !import.meta.env.VITE_API_URL && typeof window !== 'undefined' && !window.location.hostname.includes('run.app');
  const [showConfig, setShowConfig] = React.useState(false);

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
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 relative group">
                  <p className="text-[9px] font-mono text-slate-500 uppercase">Target Endpoint</p>
                  <p className={`text-[11px] font-mono truncate ${isMissingApiUrl ? 'text-red-400 font-bold' : 'text-blue-400'}`} title={targetUrl}>{targetUrl}</p>
                  <button 
                    onClick={() => { navigator.clipboard.writeText(targetUrl); alert('Endpoint copied to clipboard'); }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-blue-400"
                  >
                    <Icons.Copy className="w-3 h-3" />
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <p className="text-[9px] font-mono text-slate-500 uppercase">Connectivity Profile</p>
                  <p className={`text-[11px] font-mono ${isCrossDomain ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {isMissingApiUrl ? 'Disconnected (Local Fallback)' : (isCrossDomain ? 'Orchestrated (Cross-Domain)' : 'Local Cluster (Direct)')}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button 
                    disabled={isSyncing || systemStatus === 'offline' || isMissingApiUrl}
                    onClick={handleForceSync}
                    className={`flex-1 w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-2xl ${
                      isSyncing || systemStatus === 'offline' || isMissingApiUrl
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20 active:scale-95'
                    }`}
                  >
                    {isSyncing ? <Icons.RefreshCw className="w-5 h-5 animate-spin" /> : <Icons.Globe className="w-5 h-5" />}
                    {isSyncing ? 'Synchronizing Cluster...' : (isMissingApiUrl ? 'Configuration Missing' : 'Push to Production')}
                  </button>
                  <div className={`px-4 py-2 rounded-full border text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-2 ${
                    systemStatus === 'online' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-red-500/5 border-red-500/20 text-red-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${systemStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500 animate-ping'}`} />
                    Cluster: {systemStatus.toUpperCase()}
                  </div>
              </div>

              {(systemStatus === 'offline' || isMissingApiUrl) && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 rounded-2xl border space-y-4 shadow-xl ${isMissingApiUrl ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}
                >
                  <div className={`flex items-center gap-3 ${isMissingApiUrl ? 'text-red-500' : 'text-amber-500'}`}>
                    <Icons.AlertTriangle className="w-5 h-5 animate-pulse" />
                    <h6 className="text-[11px] font-black uppercase tracking-[0.15em]">
                       {isMissingApiUrl ? 'CRITICAL: Bridge Undefined' : 'Vercel Cloud Connectivity Required'}
                    </h6>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">
                    {isMissingApiUrl 
                      ? "Your Vercel deployment cannot reach the Cloud Run backend because VITE_API_URL is missing. This is why you see 405 Errors."
                      : "Your Vercel deployment cannot find the CMS backend. You must configure the cross-domain bridge in your Vercel Dashboard."}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                       <h7 className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">Frontend &rarr; Backend Bridge</h7>
                       <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
                         Required on Vercel to allow the CMS to reach your Cloud Run containers.
                       </p>
                       <div className="space-y-2">
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                          <code className="text-[11px] text-white font-mono font-bold">VITE_API_URL</code>
                          <button onClick={() => { navigator.clipboard.writeText('VITE_API_URL'); alert('Copied key'); }} className="text-[9px] text-slate-500 hover:text-white">COPY KEY</button>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center group">
                          <code className="text-[10px] text-emerald-400 font-mono truncate mr-2">{currentHost}</code>
                          <button onClick={() => { navigator.clipboard.writeText(currentHost); alert('Copied value'); }} className="text-[9px] text-emerald-400 font-bold hover:underline shrink-0">COPY VALUE</button>
                        </div>
                       </div>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                       <div className="flex justify-between items-center">
                         <h7 className="text-[10px] font-black text-amber-500 uppercase tracking-widest block">Firebase Authentication</h7>
                         <button onClick={() => setShowConfig(!showConfig)} className="text-[9px] text-slate-500 hover:text-white">{showConfig ? 'HIDE' : 'REVEAL CONFIG'}</button>
                       </div>
                       <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
                         If login or database access fails on Vercel, add these Firebase keys.
                       </p>
                       
                       {showConfig && (
                         <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-300">
                           <p className="text-[9px] text-slate-600 font-mono italic">Add these to Vercel Environment Variables:</p>
                           {[
                             ['VITE_FIREBASE_API_KEY', 'AIzaSyCS4wKnmPeWFuxt48uov3lzIwpphJ7anRM'],
                             ['VITE_FIREBASE_PROJECT_ID', 'gen-lang-client-0630059227'],
                             ['VITE_FIREBASE_AUTH_DOMAIN', 'gen-lang-client-0630059227.firebaseapp.com'],
                             ['VITE_FIREBASE_APP_ID', '1:241771979796:web:0e0f21cca5879edf26b301'],
                             ['VITE_FIREBASE_FIRESTORE_DATABASE_ID', 'ai-studio-ac46ae93-722e-4804-9745-89ea4afa6c38'],
                             ['VITE_FIREBASE_STORAGE_BUCKET', 'gen-lang-client-0630059227.firebasestorage.app'],
                             ['VITE_FIREBASE_MESSAGING_SENDER_ID', '241771979796']
                           ].map(([key, val]) => (
                             <div key={key} className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex flex-col gap-1">
                               <div className="flex justify-between text-[8px] font-mono text-slate-600">
                                 <span>{key}</span>
                                 <button onClick={() => { navigator.clipboard.writeText(val); alert(`Copied ${key}`); }} className="hover:text-white">COPY</button>
                               </div>
                               <code className="text-[9px] text-slate-400 truncate">{val}</code>
                             </div>
                           ))}
                         </div>
                       )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <a 
                      href={`https://vercel.com/dashboard`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      Open Vercel Dashboard <Icons.ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <p className="text-[9px] text-slate-500 text-center italic leading-relaxed">
                    Step 1: Copy the key and value.<br/>
                    Step 2: Add them to Vercel &rarr; Project Settings &rarr; Environment Variables.<br/>
                    Step 3: <span className="text-white font-bold underline">REDEPLOY</span> your site for changes to take effect.
                  </p>
                </motion.div>
              )}
           </div>
        </AdminControlGroup>

        <div className="space-y-6">
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

          <AdminControlGroup title="Auth Profiles">
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-[9px] font-mono text-slate-500 uppercase mb-1">Active Admin</p>
                <p className="text-[11px] text-white font-mono break-all">maliyagigs@gmail.com</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-[9px] font-mono text-slate-500 uppercase mb-1">ID Validation</p>
                <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-mono">
                  <Icons.CheckCircle2 className="w-3 h-3" />
                  PROPERLY SCOPED
                </div>
              </div>
            </div>
          </AdminControlGroup>
        </div>
      </div>
    </motion.div>
  );
}
