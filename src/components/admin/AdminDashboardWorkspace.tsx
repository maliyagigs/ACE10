import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
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
}

const mockTraffic = [
  { day: 'Mon', visits: 0, inquiries: 0 },
  { day: 'Tue', visits: 0, inquiries: 0 },
  { day: 'Wed', visits: 0, inquiries: 0 },
  { day: 'Thu', visits: 0, inquiries: 0 },
  { day: 'Fri', visits: 0, inquiries: 0 },
  { day: 'Sat', visits: 0, inquiries: 0 },
  { day: 'Sun', visits: 0, inquiries: 0 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function AdminDashboardWorkspace() {
  const [clients, setClients] = useState<Client[]>([]);
  const [activeTasks, setActiveTasks] = useState<{ id: string; text: string; done: boolean }[]>([]);
  const [newTaskInput, setNewTaskInput] = useState('');

  // Load live data from CRM and local task trackers
  useEffect(() => {
    const savedClients = localStorage.getItem('ace10_crm_clients');
    if (savedClients) {
      try {
        setClients(JSON.parse(savedClients));
      } catch (e) {
        console.error(e);
      }
    }

    const savedTasks = localStorage.getItem('ace10_dashboard_tasks');
    if (savedTasks) {
      try {
        setActiveTasks(JSON.parse(savedTasks));
      } catch (e) {
        setActiveTasks([]);
      }
    } else {
      const defaultTasks: { id: string; text: string; done: boolean }[] = [];
      setActiveTasks(defaultTasks);
      localStorage.setItem('ace10_dashboard_tasks', JSON.stringify(defaultTasks));
    }
  }, []);

  const saveTasks = (updated: typeof activeTasks) => {
    setActiveTasks(updated);
    localStorage.setItem('ace10_dashboard_tasks', JSON.stringify(updated));
  };

  const handleToggleTask = (id: string) => {
    const updated = activeTasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    saveTasks(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    const added = [
      ...activeTasks,
      { id: 't-' + Date.now(), text: newTaskInput.trim(), done: false }
    ];
    saveTasks(added);
    setNewTaskInput('');
  };

  const handleDeleteTask = (id: string) => {
    const updated = activeTasks.filter(t => t.id !== id);
    saveTasks(updated);
  };

  // Convert budget to visual values for general stats
  const convertToUSD = (val: number, cur: 'USD' | 'LKR' | 'AUD') => {
    if (cur === 'USD') return val;
    if (cur === 'AUD') return val * 0.65;
    if (cur === 'LKR') return val * 0.0033;
    return val;
  };

  const convertToLKR = (val: number, cur: 'USD' | 'LKR' | 'AUD') => {
    if (cur === 'LKR') return val;
    if (cur === 'USD') return val * 300; // rough rate
    if (cur === 'AUD') return val * 198;
    return val;
  };

  const convertToAUD = (val: number, cur: 'USD' | 'LKR' | 'AUD') => {
    if (cur === 'AUD') return val;
    if (cur === 'USD') return val * 1.5;
    if (cur === 'LKR') return val * 0.005;
    return val;
  };

  // Dynamic calculations from live CRM
  const totalSubmissions = clients.length;
  const activeCount = clients.filter(c => c.status === 'active').length;
  const completedCount = clients.filter(c => c.status === 'completed').length;
  const pendingCount = clients.filter(c => c.status === 'pending').length;

  const totalCalculatedRevenueUSD = clients.reduce((acc, c) => acc + convertToUSD(c.budget, c.currency), 0);
  const totalRevenueLKR = clients.reduce((acc, c) => acc + convertToLKR(c.budget, c.currency), 0);
  const totalRevenueAUD = clients.reduce((acc, c) => acc + convertToAUD(c.budget, c.currency), 0);

  const averageProjectProgress = clients.length > 0
    ? Math.round(clients.reduce((acc, c) => acc + c.progress, 0) / clients.length)
    : 0;

  // Pie chart segments representing clients status balance
  const pieData = [
    { name: 'Active Work', value: activeCount || 1 },
    { name: 'Completed', value: completedCount || 0 },
    { name: 'Pending Deals', value: pendingCount || 0 },
  ];

  // Budget breakdown by client
  const barData = clients.map(c => ({
    name: c.name.split(' ')[0], // short name
    BudgetUSD: Math.round(convertToUSD(c.budget, c.currency)),
    Progress: c.progress
  }));

  return (
    <div className="space-y-8 font-sans text-slate-300">
      <AdminSectionHeader 
        title="Admin Central Command" 
        icon={Icons.LayoutDashboard} 
        description="Monitor system traffic grids, track project completions, and review CRM financial calculations in real-time." 
      />

      {/* Primary Analytics Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl relative overflow-hidden group">
          <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500 block mb-1">VISITOR GRAPH</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">0</span>
            <span className="text-[10px] text-slate-550 font-mono font-bold flex items-center shrink-0">
               +0%
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-1">Unique session hits/wk</p>
        </div>

        <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl relative overflow-hidden group">
          <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500 block mb-1">AVG. PROJECT PROGRESS</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-blue-400">{averageProjectProgress}%</span>
            <span className="text-[10px] text-blue-500 font-mono">In Dev</span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${averageProjectProgress}%` }} />
          </div>
        </div>

        <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl relative overflow-hidden group">
          <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500 block mb-1">TOTAL PIPELINE PIPES</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{totalSubmissions}</span>
            <span className="text-[10px] text-slate-500 font-mono">contracts</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-1">Active, Pending, & Completed</p>
        </div>

        <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl relative overflow-hidden group">
          <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500 block mb-1">LATEST VALUATION</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">${Math.round(totalCalculatedRevenueUSD).toLocaleString()}</span>
          </div>
          <div className="space-y-0.5 mt-2">
             <div className="flex justify-between text-[8px] font-mono text-slate-500">
               <span>LKR Equivalent:</span>
               <span className="text-slate-400">Rs.{Math.round(totalRevenueLKR).toLocaleString()}</span>
             </div>
             <div className="flex justify-between text-[8px] font-mono text-slate-500">
               <span>AUD Equivalent:</span>
               <span className="text-slate-400">A${Math.round(totalRevenueAUD).toLocaleString()}</span>
             </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Traffic Area graph - Left/Col1-2 */}
        <div className="lg:col-span-2 space-y-6">
          <AdminControlGroup title="Traffic Trend vs Submissions">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockTraffic} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px' }} />
                  <Area type="monotone" name="Web Traffic" dataKey="visits" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" />
                  <Area type="monotone" name="Inquiries Logged" dataKey="inquiries" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorInq)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-6 justify-center text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-900">
               <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-blue-500/20 border border-blue-500" />
                 <span>WEB TRAFFIC READINGS</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500" />
                 <span>ACTIVE CAPTURE LOGS</span>
               </div>
            </div>
          </AdminControlGroup>

          {/* Budget distribution from crm */}
          <AdminControlGroup title="Individual Client Valuations (USD)">
            {clients.length === 0 ? (
              <div className="p-12 text-center text-slate-600 font-mono text-xs">
                No active CRM client valuations available for mapping. Establish pipeline deals to populate graphs.
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px' }} />
                    <Bar name="Project Budget ($)" dataKey="BudgetUSD" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </AdminControlGroup>
        </div>

        {/* Sidebar widgets - Right - Col 3 */}
        <div className="space-y-6">
          
          {/* Pie Distribution of contract states */}
          <AdminControlGroup title="Contract Status Layout">
            <div className="h-44 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b' }} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Metrics block */}
              <div className="absolute text-center space-y-0.5">
                <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500 block">Total Deals</span>
                <span className="text-xl font-bold font-mono text-white">{clients.length}</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-900 text-[10px] font-mono">
              {pieData.map((item, idx) => (
                <div key={item.name} className="flex justify-between items-center text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-white font-semibold">{item.value} deals</span>
                </div>
              ))}
            </div>
          </AdminControlGroup>

          {/* Interactive To-Do List Widget */}
          <AdminControlGroup title="Production Task Checklist">
            <form onSubmit={handleAddTask} className="flex gap-2 mb-3">
              <input 
                type="text" 
                placeholder="New chore..."
                value={newTaskInput}
                onChange={e => setNewTaskInput(e.target.value)}
                className="flex-grow bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500" 
              />
              <button 
                type="submit" 
                className="px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer"
              >
                +
              </button>
            </form>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {activeTasks.map(task => (
                <div 
                  key={task.id} 
                  className={`flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-900 transition-all ${
                    task.done ? 'opacity-50 border-transparent bg-transparent' : 'hover:border-slate-800'
                  }`}
                >
                  <label className="flex items-center gap-2.5 cursor-pointer text-[11px] font-mono flex-1 text-left">
                    <input 
                      type="checkbox" 
                      checked={task.done}
                      onChange={() => handleToggleTask(task.id)}
                      className="w-3.5 h-3.5 rounded border-slate-800 bg-slate-900 accent-blue-600 cursor-pointer text-blue-600" 
                    />
                    <span className={task.done ? 'line-through text-slate-600' : 'text-slate-300'}>{task.text}</span>
                  </label>
                  
                  <button 
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1 hover:text-red-500 text-slate-600 transition"
                  >
                    <Icons.Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {activeTasks.length === 0 && (
                <div className="text-center p-4 text-[10px] text-slate-600 uppercase font-mono">Checklist clear!</div>
              )}
            </div>
          </AdminControlGroup>

        </div>

      </div>
    </div>
  );
}
