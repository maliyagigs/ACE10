import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth as firebaseAuth } from '../services/firebase';
import { AppContent } from '../types';
import { initialContent } from '../data';
import { API_ENDPOINTS } from '../config';

// Modular Workspace Panels
import { AdminHeroWorkspace, AdminServicesWorkspace, AdminPortfolioWorkspace } from './admin/AdminContentPanels';
import { AdminStatsWorkspace, AdminTestimonialsWorkspace, AdminCountriesWorkspace, AdminFooterWorkspace } from './admin/AdminMetaPanels';
import { AdminThemeWorkspace, AdminSyncWorkspace } from './admin/AdminThemeWorkspace';

interface AdminPanelProps {
  content: AppContent;
  setContent: (content: AppContent) => void;
  user: any;
  onClose?: () => void;
}

type TabType = 'hero' | 'services' | 'portfolio' | 'testimonials' | 'stats' | 'countries' | 'footer' | 'theme' | 'sync';

export default function AdminPanel({ content, setContent, user, onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [isSyncing, setIsSyncing] = useState(false);
  const [systemStatus, setSystemStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  // Heartbeat to ensure CMS backend is reachable
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.health);
        if (res.ok) setSystemStatus('online');
        else setSystemStatus('offline');
      } catch (e) {
        setSystemStatus('offline');
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleForceSync = async () => {
    setIsSyncing(true);
    try {
      if (!user) throw new Error("User session not found. Please log in first.");
      const currentUser = firebaseAuth.currentUser;
      if (!currentUser) throw new Error("Firebase runtime session not found.");
      // Admin Check
      if (user.email !== "maliyagigs@gmail.com" && user.uid !== "iksKSWvbtSbHCDglRJAwENbSYUx1") {
        throw new Error("Unauthorized: Admin privileges required.");
      }

      const idToken = await currentUser.getIdToken();
      
      const response = await fetch(API_ENDPOINTS.saveContent, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(content)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      setTimeout(() => {
        setIsSyncing(false);
        alert('CMS Synchronized. changes are now live on production cluster.');
      }, 800);
      
    } catch (err: any) {
      console.error(err);
      setIsSyncing(false);
      alert('Sync Failure: ' + (err.message || err));
    }
  };

  const updateContent = (modifier: (curr: AppContent) => void) => {
    const copy = JSON.parse(JSON.stringify(content));
    modifier(copy);
    setContent(copy);
  };

  const reorder = <T,>(list: T[], index: number, direction: 'up' | 'down'): T[] => {
    const result = [...list];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return list;
    const [removed] = result.splice(index, 1);
    result.splice(targetIdx, 0, removed);
    return result;
  };

  const handleReset = () => {
    if (confirm("Revert all dynamic modifications back to ACE10 factory defaults?")) {
      setContent(initialContent);
    }
  };

  const tabs = [
    { id: 'hero', label: 'Identity', icon: Icons.Layout },
    { id: 'services', label: 'Services', icon: Icons.Layers },
    { id: 'portfolio', label: 'Portfolio', icon: Icons.Briefcase },
    { id: 'testimonials', label: 'Reviews', icon: Icons.MessageCircle },
    { id: 'stats', label: 'Metrics', icon: Icons.BarChart3 },
    { id: 'countries', label: 'Nodes', icon: Icons.Globe },
    { id: 'footer', label: 'Footer', icon: Icons.HardDrive },
    { id: 'theme', label: 'Aesthetics', icon: Icons.Palette },
    { id: 'sync', label: 'Production', icon: Icons.CloudLightning },
  ] as const;

  return (
    <div className="w-full min-h-screen bg-slate-950 font-sans text-slate-200 overflow-hidden flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-900 bg-slate-950 p-6 flex flex-col gap-8 h-auto md:h-screen sticky top-0"
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Icons.Activity className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-glass font-black tracking-widest text-white uppercase">ACE10</h1>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">Central Control</p>
            </div>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Close CMS"
            >
              <Icons.X className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto scrollbar-hide py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer group ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/10' 
                  : 'text-slate-500 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-slate-600 group-hover:text-blue-400'}`} />
              <span className="uppercase tracking-widest font-mono">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div layoutId="tab-pill" className="ml-auto w-1 h-4 bg-white/40 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-900">
           <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[10px] font-mono transition-all ${
              systemStatus === 'online' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-red-500/5 border-red-500/20 text-red-400'
           }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${systemStatus === 'online' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
              CORE: {systemStatus.toUpperCase()}
           </div>
        </div>
      </motion.aside>

      {/* Main Workspace */}
      <main className="flex-1 overflow-y-auto p-4 md:p-12 relative h-screen scrollbar-hide pb-24 md:pb-12">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
             {activeTab === 'hero' && <AdminHeroWorkspace key="hero" content={content} updateContent={updateContent} reorder={reorder} />}
             {activeTab === 'services' && <AdminServicesWorkspace key="services" content={content} updateContent={updateContent} reorder={reorder} />}
             {activeTab === 'portfolio' && <AdminPortfolioWorkspace key="portfolio" content={content} updateContent={updateContent} reorder={reorder} />}
             {activeTab === 'testimonials' && <AdminTestimonialsWorkspace key="testimonials" content={content} updateContent={updateContent} reorder={reorder} />}
             {activeTab === 'stats' && <AdminStatsWorkspace key="stats" content={content} updateContent={updateContent} reorder={reorder} />}
             {activeTab === 'countries' && <AdminCountriesWorkspace key="countries" content={content} updateContent={updateContent} reorder={reorder} />}
             {activeTab === 'footer' && <AdminFooterWorkspace key="footer" content={content} updateContent={updateContent} />}
             {activeTab === 'theme' && <AdminThemeWorkspace key="theme" content={content} updateContent={updateContent} />}
             {activeTab === 'sync' && <AdminSyncWorkspace key="sync" isSyncing={isSyncing} systemStatus={systemStatus} handleForceSync={handleForceSync} handleReset={handleReset} />}
          </AnimatePresence>
        </div>

        {/* Global Action Bar Placeholder - for Save button if we want it floating */}
        <div className="fixed bottom-6 right-6 md:hidden">
            <button 
              onClick={() => setActiveTab('sync')}
              className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-2xl flex items-center justify-center border-4 border-slate-950"
            >
               <Icons.Save className="w-6 h-6" />
            </button>
        </div>
      </main>
    </div>
  );
}
