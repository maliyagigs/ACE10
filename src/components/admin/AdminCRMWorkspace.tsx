import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminSectionHeader, AdminControlGroup } from './AdminCommon';

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  projectName: string;
  status: 'active' | 'pending' | 'completed';
  budget: number;
  currency: 'USD' | 'LKR' | 'AUD';
  progress: number;
  dateCreated: string;
  notes?: string;
}

const DEFAULT_CLIENTS: Client[] = [
  {
    id: 'c-1',
    name: 'Sarah Mitchell',
    email: 'sarah@apexventures.io',
    company: 'Apex Ventures LLC',
    projectName: 'Fintech Mobile Subsystem',
    status: 'active',
    budget: 14500,
    currency: 'USD',
    progress: 75,
    dateCreated: '2026-05-12',
    notes: 'Primary phase backend systems and interactive charts are fully integrated. Polishing responsive mobile views.'
  },
  {
    id: 'c-2',
    name: 'Dilhan Perera',
    email: 'dilhan@lankafruit.lk',
    company: 'Lanka Agro Exporters',
    projectName: 'Corporate eCommerce Hub',
    status: 'pending',
    budget: 2400000,
    currency: 'LKR',
    progress: 40,
    dateCreated: '2026-05-28',
    notes: 'Database setups completed. Awaiting payment credentials confirmation to initiate production sync templates.'
  },
  {
    id: 'c-3',
    name: 'Oliver Thorne',
    email: 'oliver@coastalsolutions.com.au',
    company: 'Coastal Solutions Pty',
    projectName: 'AI Logistics Platform',
    status: 'completed',
    budget: 8500,
    currency: 'AUD',
    progress: 100,
    dateCreated: '2026-04-15',
    notes: 'Successful handoff. High-performance caching layers and responsive theme palettes exceeded goals.'
  }
];

export function AdminCRMWorkspace() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'completed'>('all');
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formProject, setFormProject] = useState('');
  const [formBudget, setFormBudget] = useState('5000');
  const [formCurrency, setFormCurrency] = useState<'USD' | 'LKR' | 'AUD'>('USD');
  const [formNotes, setFormNotes] = useState('');

  // Load clients
  useEffect(() => {
    const saved = localStorage.getItem('ace10_crm_clients');
    if (saved) {
      try {
        setClients(JSON.parse(saved));
      } catch (e) {
        setClients(DEFAULT_CLIENTS);
      }
    } else {
      setClients(DEFAULT_CLIENTS);
      localStorage.setItem('ace10_crm_clients', JSON.stringify(DEFAULT_CLIENTS));
    }
  }, []);

  // Save clients helper
  const saveClients = (newClients: Client[]) => {
    setClients(newClients);
    localStorage.setItem('ace10_crm_clients', JSON.stringify(newClients));
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formProject) {
      alert('Please fill out Name, Email, and Project title.');
      return;
    }

    const newClient: Client = {
      id: 'c-' + Date.now(),
      name: formName,
      email: formEmail,
      company: formCompany || 'Independent',
      projectName: formProject,
      status: 'pending',
      budget: parseFloat(formBudget) || 0,
      currency: formCurrency,
      progress: 10,
      dateCreated: new Date().toISOString().split('T')[0],
      notes: formNotes
    };

    const updated = [newClient, ...clients];
    saveClients(updated);
    
    // Clear form
    setFormName('');
    setFormEmail('');
    setFormCompany('');
    setFormProject('');
    setFormBudget('5000');
    setFormNotes('');
    setShowAddForm(false);
  };

  const handleUpdateStatus = (id: string, status: Client['status']) => {
    const updated = clients.map(c => c.id === id ? { ...c, status, progress: status === 'completed' ? 100 : c.progress } : c);
    saveClients(updated);
    if (selectedClient && selectedClient.id === id) {
      setSelectedClient({ ...selectedClient, status, progress: status === 'completed' ? 100 : selectedClient.progress });
    }
  };

  const handleUpdateProgress = (id: string, val: number) => {
    const updated = clients.map(c => c.id === id ? { ...c, progress: val, status: val === 100 ? 'completed' : c.status === 'completed' ? 'active' : c.status } : c);
    saveClients(updated);
    if (selectedClient && selectedClient.id === id) {
      setSelectedClient({ 
        ...selectedClient, 
        progress: val, 
        status: val === 100 ? 'completed' : selectedClient.status === 'completed' ? 'active' : selectedClient.status 
      });
    }
  };

  const handleDeleteClient = (id: string) => {
    if (confirm('Are you sure you want to remove this client from the CRM?')) {
      const updated = clients.filter(c => c.id !== id);
      saveClients(updated);
      setSelectedClient(null);
    }
  };

  // Convert budget to visual USD fallback for unified calculations
  const getUnifiedValueUSD = (client: Client) => {
    if (client.currency === 'USD') return client.budget;
    if (client.currency === 'AUD') return client.budget * 0.65; // Approx rate
    if (client.currency === 'LKR') return client.budget * 0.0033; // Approx rate
    return client.budget;
  };

  const activeClients = clients.filter(c => c.status === 'active');
  const totalSubmissions = clients.length;
  const pendingDeals = clients.filter(c => c.status === 'pending');
  
  // Calculate total active backlog valuation under unified USD
  const pipelineValuationUSD = clients.reduce((acc, c) => {
    return acc + getUnifiedValueUSD(c);
  }, 0);

  // Search/Filter logic
  const filteredClients = clients.filter(c => {
    const matchesFilter = filter === 'all' || c.status === filter;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.company.toLowerCase().includes(search.toLowerCase()) ||
                          c.projectName.toLowerCase().includes(search.toLowerCase()) ||
                          c.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 font-sans">
      <AdminSectionHeader 
        title="CRM & Pipeline Engine" 
        icon={Icons.Users} 
        description="Administer high-value clients, modify project progress, and track contract volumes globally." 
      />

      {/* CRM Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-gradient-to-br from-blue-950/20 to-slate-900/60 border border-slate-900 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Active Engagements</span>
            <h3 className="text-2xl font-bold text-white font-mono">{activeClients.length} <span className="text-xs text-slate-400 font-normal">clients</span></h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Icons.UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-gradient-to-br from-emerald-950/10 to-slate-900/60 border border-slate-900 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Pipeline Valuation</span>
            <h3 className="text-2xl font-bold text-emerald-400 font-mono">
              ${pipelineValuationUSD.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              <span className="text-[10px] text-slate-500 font-normal block">Combined Value equivalents (USD)</span>
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Icons.BadgeDollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-gradient-to-br from-amber-950/10 to-slate-900/60 border border-slate-900 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Pending Contracts</span>
            <h3 className="text-2xl font-bold text-amber-500 font-mono">{pendingDeals.length} <span className="text-xs text-slate-400 font-normal">deals</span></h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Icons.Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main List Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 bg-slate-900/30 border border-slate-900 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Icons.Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
              <input 
                type="text" 
                placeholder="Search CRM..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-slate-950/80 p-0.5 rounded-xl border border-slate-800 self-stretch md:self-auto">
              {(['all', 'active', 'pending', 'completed'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${
                    filter === f ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <AdminControlGroup title="Active Client Pipeline">
            {filteredClients.length === 0 ? (
              <div className="p-12 text-center text-slate-600 font-mono text-xs">
                No matching CRM profiles found. Click Add to establish a client.
              </div>
            ) : (
              <div className="divide-y divide-slate-900">
                {filteredClients.map(c => (
                  <div 
                    key={c.id} 
                    onClick={() => setSelectedClient(c)}
                    className={`p-4 hover:bg-slate-900/30 transition-all rounded-xl cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border ${
                      selectedClient?.id === c.id ? 'bg-slate-900/40 border-slate-800' : 'border-transparent'
                    }`}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{c.name}</h4>
                        <span className="text-[10px] text-slate-500 font-mono">@{c.company}</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">{c.projectName}</p>
                      
                      {/* Interactive Progress Indicators */}
                      <div className="flex items-center gap-3 pt-2">
                        <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 transition-all duration-500" 
                            style={{ width: `${c.progress}%` }} 
                          />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{c.progress}% Complete</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end md:self-auto">
                      <div className="text-right">
                        <p className="text-xs text-slate-500 font-mono">Budget Contract</p>
                        <p className="text-sm font-semibold text-white font-mono">
                          {c.currency === 'USD' ? '$' : c.currency === 'AUD' ? 'AU$' : 'Rs. '}
                          {c.budget.toLocaleString()}
                        </p>
                      </div>

                      {/* Status Badges */}
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        c.status === 'active' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        c.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AdminControlGroup>
        </div>

        {/* Sidebar Controls/Action Column */}
        <div className="space-y-4">
          
          {/* Action Trigger */}
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-mono uppercase tracking-widest text-xs font-bold py-4 rounded-xl shadow-lg shadow-blue-600/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {showAddForm ? (
              <>
                <Icons.ListCollapse className="w-4 h-4" />
                Close Setup Form
              </>
            ) : (
              <>
                <Icons.UserPlus className="w-4 h-4" />
                Onboard New Client
              </>
            )}
          </button>

          <AnimatePresence mode="wait">
            {showAddForm ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-5 bg-slate-900/60 border border-slate-900 rounded-2xl space-y-4"
              >
                <h4 className="text-xs uppercase font-mono font-bold text-slate-400 tracking-wider pb-2 border-b border-slate-800">New Client Onboarding</h4>
                <form onSubmit={handleAddClient} className="space-y-3 font-mono text-[11px]">
                  <div>
                    <label className="block text-slate-500 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formName}
                      onChange={e => setFormName(e.target.value)}
                      placeholder="e.g. Ruwan Weerasinghe"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-xs outline-none focus:border-blue-500" 
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">Client Email</label>
                    <input 
                      type="email" 
                      required
                      value={formEmail}
                      onChange={e => setFormEmail(e.target.value)}
                      placeholder="e.g. ruwan@itlabs.lk"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-xs outline-none focus:border-blue-500" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-500 mb-1">Company</label>
                      <input 
                        type="text" 
                        value={formCompany}
                        onChange={e => setFormCompany(e.target.value)}
                        placeholder="e.g. IT Labs"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-xs outline-none focus:border-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Budget Val</label>
                      <input 
                        type="number" 
                        value={formBudget}
                        onChange={e => setFormBudget(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-xs outline-none focus:border-blue-500 text-center font-mono" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-500 mb-1">Currency</label>
                      <select 
                        value={formCurrency}
                        onChange={e => setFormCurrency(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-xs outline-none focus:border-blue-500 text-center font-mono"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="LKR">LKR (Rs.)</option>
                        <option value="AUD">AUD (A$)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Initial Status</label>
                      <div className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-400 text-xs text-center font-bold">
                        PENDING DEAL
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">Project Assignment</label>
                    <input 
                      type="text" 
                      required
                      value={formProject}
                      onChange={e => setFormProject(e.target.value)}
                      placeholder="e.g. Web Landing and CRM Integration"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-xs outline-none focus:border-blue-500" 
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">Scope Details / Notes (Optional)</label>
                    <textarea 
                      value={formNotes}
                      onChange={e => setFormNotes(e.target.value)}
                      rows={3}
                      placeholder="Scope constraints..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-xs outline-none focus:border-blue-500 resize-none font-mono"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-mono uppercase text-xs font-bold py-2 rounded-lg transition mt-2 cursor-pointer"
                  >
                    Onboard Lead
                  </button>
                </form>
              </motion.div>
            ) : selectedClient ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 bg-gradient-to-b from-slate-900/50 to-slate-900/20 border border-slate-800 rounded-2xl space-y-4"
              >
                <div className="flex justify-between items-start pb-2 border-b border-slate-800">
                  <div>
                    <h4 className="text-sm font-bold text-white">{selectedClient.name}</h4>
                    <p className="text-[10px] text-slate-500 font-mono">{selectedClient.email}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteClient(selectedClient.id)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-red-500 hover:bg-slate-950 transition"
                    title="Delete record"
                  >
                    <Icons.Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Project Deliverable</span>
                    <span className="text-white font-bold">{selectedClient.projectName}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Contract Value</span>
                      <span className="text-emerald-400 font-bold block">
                        {selectedClient.currency === 'USD' ? '$' : selectedClient.currency === 'AUD' ? 'A$' : 'Rs. '}
                        {selectedClient.budget.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Date Created</span>
                      <span className="text-slate-400 block text-[10px]">{selectedClient.dateCreated}</span>
                    </div>
                  </div>

                  {/* Move Contract States */}
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase mb-1.5">Change Pipeline Stage</span>
                    <div className="grid grid-cols-3 gap-1">
                      {(['pending', 'active', 'completed'] as const).map(st => (
                        <button
                          key={st}
                          onClick={() => handleUpdateStatus(selectedClient.id, st)}
                          className={`py-1 text-[9px] font-bold uppercase border rounded-lg transition-all ${
                            selectedClient.status === st
                              ? 'bg-blue-600 text-white border-blue-600 font-bold'
                              : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {st === 'pending' ? 'Deal' : st === 'active' ? 'Work' : 'Done'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Progress Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-slate-500 uppercase">Interactive Progress</span>
                      <span className="text-[10px] text-blue-400 font-bold">{selectedClient.progress}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      step="5"
                      value={selectedClient.progress}
                      onChange={(e) => handleUpdateProgress(selectedClient.id, parseInt(e.target.value))}
                      className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg cursor-pointer appearance-none outline-none" 
                    />
                  </div>

                  {/* Client Project Notes */}
                  {selectedClient.notes && (
                    <div className="pt-2 border-t border-slate-800/60">
                      <span className="text-[9px] text-slate-500 block uppercase mb-1">Project Milestone Logs</span>
                      <p className="text-[10px] text-slate-400 leading-normal bg-slate-950/60 p-2 border border-slate-900 rounded-xl max-h-24 overflow-y-auto">
                        {selectedClient.notes}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="p-8 border border-dashed border-slate-800 rounded-2xl text-center text-slate-500 font-mono text-[10px] uppercase tracking-widest leading-relaxed">
                <Icons.UserCheck className="w-8 h-8 text-slate-700 mx-auto mb-2 animate-pulse" />
                Select a client pipeline member to process statuses, alter progress values, and update deliverables.
              </div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}
