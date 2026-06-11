import React from 'react';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';

interface ImageUploaderProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: 'compact' | 'normal';
  accept?: string;
}

export function ImageUploader({ label, value, onChange, placeholder = "https://...", className = "", size = "normal", accept = "image/*" }: ImageUploaderProps) {
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
            className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-1.5 text-[11px] font-mono text-slate-300 focus:outline-none focus:border-blue-500/50 transition-colors"
            placeholder={placeholder}
          />
          {isLocal && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-1.5 top-1/2 transform -translate-y-1/2 text-[9px] font-mono uppercase bg-red-950/60 text-red-400 hover:bg-red-900/50 px-2 py-0.5 rounded border border-red-900/20"
            >
              Clear
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-lg transition shrink-0 cursor-pointer"
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
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
            {label}
          </label>
          {isLocal && (
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              Live Asset
            </span>
          )}
        </div>
      )}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={isLocal ? 'blob:local-device-asset-01' : value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isLocal}
            className={`w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-700 ${isLocal ? 'cursor-not-allowed opacity-80' : ''}`}
            placeholder={placeholder}
          />
          {isLocal && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[10px] font-mono uppercase bg-red-950/60 text-red-400 hover:bg-red-900/50 px-3 py-1 rounded border border-red-900/30 transition-all"
            >
              Reset
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-3 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-lg"
        >
          <Icons.Upload className="w-4 h-4" />
          <span className="hidden sm:inline font-mono">UPLOAD</span>
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
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/50 shadow-inner"
        >
          {accept.includes('video') ? (
            <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Icons.Video className="w-6 h-6 text-slate-500" />
            </div>
          ) : (
            <img
              src={value}
              alt="Preview"
              className="w-12 h-12 rounded-lg object-cover border border-slate-800 shadow-md"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=40&auto=format&fit=crop';
              }}
              referrerPolicy="no-referrer"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-mono text-slate-500 leading-none uppercase tracking-tighter">
              {accept.includes('video') ? 'Video' : 'Image'} Asset Loaded
            </p>
            <p className="text-[10px] font-mono text-slate-600 truncate mt-1">
              {value.startsWith('data:') || value.startsWith('blob:') ? `internal_binary_payload.${accept.includes('video') ? 'mp4' : 'png'}` : value}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export function AdminSectionHeader({ title, icon: Icon, description }: { title: string; icon: any; description?: string }) {
  return (
    <div className="space-y-1 pb-4 border-b border-slate-900/60 mb-6">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-glass font-bold text-white tracking-wide uppercase">
          {title}
        </h3>
      </div>
      {description && (
        <p className="text-slate-500 text-xs font-mono pl-11">
          {description}
        </p>
      )}
    </div>
  );
}

export function AdminControlGroup({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-6 bg-slate-900/40 border border-slate-800 shadow-xl rounded-2xl space-y-4 ${className}`}>
      <h4 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.2em] pb-2 border-b border-slate-800/50">
        {title}
      </h4>
      {children}
    </div>
  );
}
