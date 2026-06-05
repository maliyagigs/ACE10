import React, { useState } from 'react';
import { AppContent, QuoteInquiry } from '../../types';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminInquiriesWorkspaceProps {
  content: AppContent;
  updateContent: (modifier: (curr: AppContent) => void) => void;
}

export function AdminInquiriesWorkspace({ content, updateContent }: AdminInquiriesWorkspaceProps) {
  const inquiries = content.quoteInquiries || [];
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleConvertToCRM = (inq: QuoteInquiry) => {
    try {
      // 1. Get current clients
      const saved = localStorage.getItem('ace10_crm_clients');
      let clients = [];
      if (saved) {
        clients = JSON.parse(saved);
      }

      // Check if already exist
      if (clients.some((c: any) => c.email === inq.email)) {
        alert(`A pipeline deal for ${inq.email} already exists inside the CRM database.`);
        return;
      }

      // 2. Formulate new client profile
      const newClient = {
        id: 'c-' + Date.now(),
        name: inq.name,
        email: inq.email,
        company: inq.company || 'Independent Visitor',
        projectName: 'Dispatched: ' + inq.message.substring(0, 32) + '...',
        status: 'pending',
        budget: 5000, // Default baseline budget
        currency: 'USD',
        progress: 15,
        dateCreated: new Date().toISOString().split('T')[0],
        notes: `Converted from interactive Contact Request. Original details: "${inq.message}"`
      };

      // 3. Save to LocalStorage CRM pipeline
      localStorage.setItem('ace10_crm_clients', JSON.stringify([newClient, ...clients]));
      alert(`Success! Onboarded "${inq.name}" into the CRM system under "Pending Deals". You can now adjust budgets, currencies, and project progress in the CRM tab.`);
    } catch (err) {
      console.error(err);
      alert('CRM Integration Error: Unable to sync pipeline metrics.');
    }
  };

  const handleDeleteInquiry = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this inquiry? You will need to click "Production Sync" to save changes back to the cloud.')) {
      updateContent(c => {
        c.quoteInquiries = c.quoteInquiries.filter(i => i.id !== id);
      });
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Icons.MailOpen className="text-blue-500 w-6 h-6" />
            Inbound Quote inquiries
          </h2>
          <p className="text-xs text-slate-500 font-mono uppercase mt-1">
            Persisted contacts: {inquiries.length} profiles logged
          </p>
        </div>
        <div className="text-xs font-mono bg-blue-900/10 border border-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg">
          CLOUD VERIFIED
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="p-16 border-2 border-dashed border-slate-800 rounded-3xl text-center text-slate-600 font-mono space-y-3">
          <Icons.Inbox className="w-10 h-10 text-slate-700 mx-auto" />
          <p className="uppercase tracking-widest text-xs">No active inquiries</p>
          <p className="text-[10px] lowercase text-slate-500">Submit a request through the website landing page contact form to see entries</p>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {inquiries.map((inquiry: QuoteInquiry, idx) => (
              <motion.div 
                key={inquiry.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onMouseEnter={() => setHoveredId(inquiry.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="p-6 bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800/80 rounded-2xl space-y-4 transition-all relative overflow-hidden group"
              >
                {/* Visual Glass Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 filter blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-white">{inquiry.name}</h3>
                      {inquiry.company && (
                        <span className="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800 text-slate-400">
                          {inquiry.company}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-blue-400 font-mono block hover:underline cursor-pointer">
                      {inquiry.email}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-900 shrink-0">
                    {inquiry.date || 'Today'}
                  </span>
                </div>

                <div className="bg-slate-950/40 p-4 border border-slate-900 rounded-xl">
                  <span className="text-[9px] uppercase font-mono text-slate-600 block mb-1">Project Spec Requirements</span>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-mono">{inquiry.message}</p>
                </div>

                <div className="flex flex-wrap justify-between items-center gap-4 pt-2 border-t border-slate-900/60">
                  <span className="text-[9px] font-mono text-slate-600 uppercase">
                    System ID: {inquiry.id}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleConvertToCRM(inquiry)}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/10 hover:border-blue-500 text-[10px] font-bold font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/5"
                    >
                      <Icons.UserCheck className="w-3.5 h-3.5" />
                      Convert to CRM Client
                    </button>

                    <button
                      onClick={() => handleDeleteInquiry(inquiry.id)}
                      className="p-1.5 rounded-lg bg-red-950/20 hover:bg-red-500 text-red-400/80 hover:text-white border border-red-500/10 hover:border-red-500 transition-all cursor-pointer"
                      title="Delete Inquiry Profile"
                    >
                      <Icons.Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
