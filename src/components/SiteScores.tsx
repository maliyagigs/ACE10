import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Play, ShieldCheck, CheckCircle, Zap, Eye, Code, Compass, Search } from 'lucide-react';
import { AppContent } from '../types';

interface SiteScoresProps {
  theme?: AppContent['theme'];
}

export default function SiteScores({ theme }: SiteScoresProps) {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Scores state
  const [scores, setScores] = useState({
    performance: 99,
    accessibility: 100,
    bestPractices: 100,
    seo: 100,
    security: 100
  });

  const runAudit = () => {
    if (isAuditing) return;
    setIsAuditing(true);
    setAuditProgress(0);
    setAuditLogs([]);

    const logMessages = [
      "⚡ Initializing Google Lighthouse Core Web Vitals engine...",
      "🔍 Auditing DOM structure & CSS selector paths...",
      "🎨 Computing First Contentful Paint (FCP) - Target: <0.6s...",
      "📈 Calculating Cumulative Layout Shift (CLS): 0.00 (Perfect)...",
      "👁️ Auditing ARIA tags, contrast ratios, and color harmony...",
      "🛡️ Validating SSL certificates, HTTP/3, and secure CORS policy...",
      "🏷️ Checking sitemaps.xml, viewport, and meta descriptions...",
      "🎉 Optimization complete! High-performance client-side bundle loaded."
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      setAuditProgress(prev => {
        const next = prev + 12.5;
        if (next >= 100) {
          clearInterval(interval);
          setIsAuditing(false);
          setScores({
            performance: 100,
            accessibility: 100,
            bestPractices: 100,
            seo: 100,
            security: 100
          });
          return 100;
        }
        return next;
      });

      if (currentLogIndex < logMessages.length) {
        setAuditLogs(prev => [...prev, logMessages[currentLogIndex]]);
        currentLogIndex++;
      }
    }, 450);
  };

  const metricDetails = [
    {
      id: 'perf',
      name: 'Performance',
      score: scores.performance,
      description: 'First Input Delay & Speed Index optimized to the absolute maximum. Bundle stripped of unused JS/CSS.',
      icon: Zap,
      color: 'from-blue-500 to-indigo-600',
      glow: 'shadow-blue-500/20',
      ringColor: 'stroke-blue-500'
    },
    {
      id: 'access',
      name: 'Accessibility',
      score: scores.accessibility,
      description: 'Generates beautiful contrast ratios, semantic headers, and complete keyboard-friendly navigation trees.',
      icon: Eye,
      color: 'from-pink-500 to-rose-600',
      glow: 'shadow-pink-500/20',
      ringColor: 'stroke-pink-500'
    },
    {
      id: 'best',
      name: 'Best Practices',
      score: scores.bestPractices,
      description: 'Build outputs align with strict container configurations, HTTPS/3 protocol, and zero console warnings.',
      icon: Code,
      color: 'from-fuchsia-500 to-pink-600',
      glow: 'shadow-fuchsia-500/20',
      ringColor: 'stroke-fuchsia-500'
    },
    {
      id: 'seo',
      name: 'SEO Grade',
      score: scores.seo,
      description: 'Crawlable site layout, structured metadata schema, canonical declarations, and sitemap generation standard.',
      icon: Search,
      color: 'from-blue-600 to-pink-600',
      glow: 'shadow-pink-500/20',
      ringColor: 'stroke-pink-500'
    },
    {
      id: 'sec',
      name: 'Site Security',
      score: scores.security,
      description: 'Enforces complete protection against CSP injectors, encrypted DB transport, and sandboxed iframe parameters.',
      icon: ShieldCheck,
      color: 'from-indigo-500 to-purple-600',
      glow: 'shadow-indigo-500/20',
      ringColor: 'stroke-indigo-500'
    }
  ];

  return (
    <section id="site-scores" className="py-24 px-6 md:px-12 bg-slate-950/60 border-t border-b border-slate-900 overflow-hidden relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-pink-500/20 to-transparent" />
      
      {/* Decorative blurry nodes with blue & dark pink glow */}
      <div className="absolute -top-40 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-pink-500/10 border border-blue-500/20 mb-4 shadow-[0_0_15px_rgba(37,99,235,0.08)]">
            <Sparkles className="w-4 h-4 text-pink-400 animate-spin-slow" />
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-400 uppercase">
              Web Vitals & Performance Scorecard
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            We Deliver <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-pink-400 to-rose-400">Perfect Scores</span> For Everything On Site
          </h2>
          <p className="text-slate-400 mt-4 text-base leading-relaxed">
            Every digital product we deploy undergoes rigorous algorithmic optimization for load velocities, semantic rendering, search indices, and structural integrity.
          </p>
        </div>

        {/* Diagnostic Control Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          
          {/* Circular Gauges Panel */}
          <div className="lg:col-span-8 p-6 md:p-8 rounded-3xl bg-slate-900/40 border border-slate-900 backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-lg font-bold text-white font-mono">Live Site Audit Panel</h3>
                  <p className="text-xs text-slate-400 mt-1">Simulated test based on dynamic site bundles</p>
                </div>
                
                <button
                  onClick={runAudit}
                  disabled={isAuditing}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all relative overflow-hidden group ${
                    isAuditing 
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-500 hover:to-pink-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-pink-500/30'
                  }`}
                >
                  {isAuditing ? (
                    <>
                      <div className="w-4.5 h-4.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                      <span>AUDITING BUNDLES ({Math.round(auditProgress)}%)</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>RUN LIVE CORE AUDIT</span>
                    </>
                  )}
                </button>
              </div>

              {/* Gauges Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-items-center my-6">
                {metricDetails.map((metric) => {
                  const strokeDasharray = 2 * Math.PI * 34; // r=34 -> ~213.6
                  const strokeDashoffset = strokeDasharray - (metric.score / 100) * strokeDasharray;

                  return (
                    <motion.div 
                      key={metric.id}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setExpandedCard(expandedCard === metric.id ? null : metric.id)}
                      className="flex flex-col items-center p-3 rounded-2xl bg-slate-950/40 border border-slate-900/60 hover:border-slate-800 cursor-pointer transition-all w-full text-center group"
                    >
                      <div className="relative w-20 h-20 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="34"
                            className="stroke-slate-800"
                            strokeWidth="4"
                            fill="transparent"
                          />
                          <motion.circle
                            cx="40"
                            cy="40"
                            r="34"
                            className={metric.ringColor}
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray={strokeDasharray}
                            initial={{ strokeDashoffset: strokeDasharray }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute font-mono font-black text-white text-base">
                          {metric.score}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-1">
                        <metric.icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-pink-400 transition-colors" />
                        <span className="text-xs font-bold text-slate-300 font-mono">{metric.name}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Selected Metric Details Panel */}
            <div className="mt-8 pt-6 border-t border-slate-900/60 min-h-[80px]">
              {expandedCard ? (
                (() => {
                  const current = metricDetails.find(m => m.id === expandedCard)!;
                  const Icon = current.icon;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-4"
                    >
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${current.color} text-white`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                          {current.name} Audit Parameters
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">Perfect Pass</span>
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {current.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })()
              ) : (
                <div className="text-center text-xs text-slate-500 py-3 italic">
                  Tip: Click on any score ring to expand optimization rules & parameters.
                </div>
              )}
            </div>

          </div>

          {/* Simulated Code-Terminal Panel */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-950 border border-slate-900 font-mono text-[11px] flex flex-col justify-between overflow-hidden text-sky-300/90 relative min-h-[300px]">
            <div className="absolute top-0 inset-x-0 h-10 bg-slate-900/40 border-b border-slate-900 px-4 flex items-center gap-1.5 justify-start">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-[10px] text-slate-500 font-semibold ml-2 font-sans select-none">lighthouse-v10.3.sh</span>
            </div>

            <div className="pt-10 flex-1 overflow-y-auto space-y-2 mt-2 leading-relaxed h-[200px] select-none pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {auditLogs.length === 0 ? (
                <div className="text-slate-600 italic mt-4 text-center">
                  Terminal ready. Press "Run Live Core Audit" to execute Lighthouse simulator logs.
                </div>
              ) : (
                auditLogs.map((log, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className={idx === auditLogs.length - 1 ? "text-emerald-400 font-bold" : "text-slate-350"}
                  >
                    {log}
                  </motion.div>
                ))
              )}
            </div>

            <div className="border-t border-slate-900 pt-4 flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-semibold text-slate-500">ENGINE STATE</span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Vitals Secure
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
