import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth as firebaseAuth } from '../services/firebase';
import { AppContent } from '../types';
import { initialContent } from '../data';
import { API_ENDPOINTS } from '../config';
import { mergeContentWithDefaults } from '../utils/mergeDefaults';

// Modular Workspace Panels
import { AdminHeroWorkspace, AdminServicesWorkspace, AdminPortfolioWorkspace } from './admin/AdminContentPanels';
import { AdminStatsWorkspace, AdminTestimonialsWorkspace, AdminCountriesWorkspace, AdminFooterWorkspace } from './admin/AdminMetaPanels';
import { AdminThemeWorkspace, AdminSyncWorkspace } from './admin/AdminThemeWorkspace';
import { AdminInquiriesWorkspace } from './admin/AdminInquiriesWorkspace';
import { AdminDashboardWorkspace } from './admin/AdminDashboardWorkspace';
import { AdminCRMWorkspace } from './admin/AdminCRMWorkspace';

interface AdminPanelProps {
  content: AppContent;
  setContent: (content: AppContent) => void;
  user: any;
  onClose?: () => void;
}

type TabType = 'hero' | 'services' | 'portfolio' | 'testimonials' | 'stats' | 'countries' | 'footer' | 'theme' | 'sync' | 'inquiries' | 'dashboard' | 'crm';

export default function AdminPanel({ content, setContent, user, onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
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

      // Helper to recursively remove undefined values which Firestore rejects
      const cleanFirestoreData = (data: any): any => {
        if (data === undefined) return null;
        if (data === null) return null;
        if (Array.isArray(data)) return data.map(cleanFirestoreData);
        if (typeof data === 'object') {
          const clean: any = {};
          for (const key of Object.keys(data)) {
            if (data[key] !== undefined) {
              clean[key] = cleanFirestoreData(data[key]);
            }
          }
          return clean;
        }
        return data;
      };

      // Direct write to Firestore ensures reliability and bypasses CORS/405 redirect issues
      const cmsRef = doc(db, "cms", "latest");
      await setDoc(cmsRef, {
        content: cleanFirestoreData(content),
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      setTimeout(() => {
        setIsSyncing(false);
        alert('CMS Synchronized. Changes are now live on production cluster.');
      }, 800);
      
    } catch (err: any) {
      console.error(err);
      setIsSyncing(false);
      alert('Sync Failure: ' + (err.message || err));
    }
  };

  const updateContent = (modifier: (curr: AppContent) => void) => {
    let copy = JSON.parse(JSON.stringify(content));
    copy = mergeContentWithDefaults(copy, initialContent);
    modifier(copy);
    setContent(copy);
  };

  const reorder = <T,>(list: T[] | undefined, index: number, direction: 'up' | 'down'): T[] => {
    if (!list) return [];
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

  // State elements to control Accordions inside the Navigation Bar
  const [isOperationsOpen, setIsOperationsOpen] = useState(true);
  const [isContentOpen, setIsContentOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);

  const operationsTabs = [
    { id: 'dashboard', label: 'Monitor', icon: Icons.LayoutDashboard },
    { id: 'crm', label: 'CRM Tracking', icon: Icons.Users },
    { id: 'inquiries', label: 'Inbound Leads', icon: Icons.Mail },
  ] as const;

  const contentTabs = [
    { id: 'hero', label: 'Hero Branding', icon: Icons.Layout },
    { id: 'services', label: 'Services Suite', icon: Icons.Layers },
    { id: 'portfolio', label: 'Work Showcase', icon: Icons.Briefcase },
    { id: 'testimonials', label: 'Testimonials', icon: Icons.MessageCircle },
    { id: 'stats', label: 'KPI Counters', icon: Icons.BarChart3 },
    { id: 'countries', label: 'Node Map', icon: Icons.Globe },
    { id: 'footer', label: 'Base Footer', icon: Icons.HardDrive },
  ] as const;

  const settingsTabs = [
    { id: 'theme', label: 'Aesthetics', icon: Icons.Palette },
    { id: 'sync', label: 'Cloud Sync', icon: Icons.CloudLightning },
  ] as const;

  const renderTabButton = (tab: { id: string; label: string; icon: any }) => {
    const isActive = activeTab === tab.id;
    return (
      <button
        key={tab.id}
        type="button"
        onClick={() => setActiveTab(tab.id as TabType)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group select-none relative ${
          isActive 
            ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/15' 
            : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
        }`}
      >
        <tab.icon className={`w-4 h-4 shrink-0 transition-all group-hover:scale-105 duration-200 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`} />
        <span className="uppercase tracking-widest font-mono text-[9px] text-left leading-none">{tab.label}</span>
        {isActive && (
          <motion.div layoutId="tab-pill" className="ml-auto w-1 h-3.5 bg-white/45 rounded-full" />
        )}
      </button>
    );
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 font-sans text-slate-200 overflow-hidden flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-900 bg-slate-950 p-6 flex flex-col gap-6 h-auto md:h-screen sticky top-0"
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

        <nav className="flex flex-col gap-4 flex-1 overflow-y-auto scrollbar-hide py-2 pr-1">
          
          {/* Section A: Operations & CRM monitoring */}
          <div className="space-y-1.5">
            <button 
              type="button"
              onClick={() => setIsOperationsOpen(!isOperationsOpen)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors cursor-pointer select-none"
            >
              <span className="flex items-center gap-1.5"><Icons.Shield className="w-3.5 h-3.5 text-blue-500" /> Operations</span>
              <Icons.ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOperationsOpen ? '' : '-rotate-90'}`} />
            </button>
            <AnimatePresence initial={false}>
              {isOperationsOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-1 overflow-hidden"
                >
                  {operationsTabs.map(renderTabButton)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Section B: Page Content Subcategories (Dynamic foldable list) */}
          <div className="space-y-1.5">
            <button 
              type="button"
              onClick={() => setIsContentOpen(!isContentOpen)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors cursor-pointer select-none"
            >
              <span className="flex items-center gap-1.5"><Icons.Layers className="w-3.5 h-3.5 text-blue-500" /> CMS Sections</span>
              <Icons.ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isContentOpen ? '' : '-rotate-90'}`} />
            </button>
            <AnimatePresence initial={false}>
              {isContentOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-1 overflow-hidden"
                >
                  {contentTabs.map(renderTabButton)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Section C: Master Theme & Production settings */}
          <div className="space-y-1.5">
            <button 
              type="button"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors cursor-pointer select-none"
            >
              <span className="flex items-center gap-1.5"><Icons.Settings className="w-3.5 h-3.5 text-blue-500" /> System settings</span>
              <Icons.ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isSettingsOpen ? '' : '-rotate-90'}`} />
            </button>
            <AnimatePresence initial={false}>
              {isSettingsOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-1 overflow-hidden"
                >
                  {settingsTabs.map(renderTabButton)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
             {activeTab === 'dashboard' && <AdminDashboardWorkspace />}
             {activeTab === 'crm' && <AdminCRMWorkspace />}
             {activeTab === 'hero' && <AdminHeroWorkspace content={content} updateContent={updateContent} reorder={reorder} />}
             {activeTab === 'services' && <AdminServicesWorkspace content={content} updateContent={updateContent} reorder={reorder} />}
             {activeTab === 'portfolio' && <AdminPortfolioWorkspace content={content} updateContent={updateContent} reorder={reorder} />}
             {activeTab === 'testimonials' && <AdminTestimonialsWorkspace content={content} updateContent={updateContent} reorder={reorder} />}
             {activeTab === 'stats' && <AdminStatsWorkspace content={content} updateContent={updateContent} reorder={reorder} />}
             {activeTab === 'countries' && <AdminCountriesWorkspace content={content} updateContent={updateContent} reorder={reorder} />}
             {activeTab === 'footer' && <AdminFooterWorkspace content={content} updateContent={updateContent} />}
             {activeTab === 'theme' && <AdminThemeWorkspace content={content} updateContent={updateContent} />}
             {activeTab === 'inquiries' && <AdminInquiriesWorkspace content={content} updateContent={updateContent} />}
             {activeTab === 'sync' && <AdminSyncWorkspace isSyncing={isSyncing} systemStatus={systemStatus} handleForceSync={handleForceSync} handleReset={handleReset} />}
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
