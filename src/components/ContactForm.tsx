import React, { useState } from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { AppContent } from '../types';
import { API_ENDPOINTS } from '../config';

interface ContactFormProps {
  theme: AppContent['theme'];
  header?: AppContent['contactHeader'];
}

export default function ContactForm({ theme, header }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectDetails: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  // Field focus states to trigger float/draw rules
  const [focusFields, setFocusFields] = useState<Record<string, boolean>>({});

  const handleFocus = (field: string) => {
    setFocusFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: string, value: string) => {
    if (!value) {
      setFocusFields((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSubmissionError('');
    try {
      const response = await fetch(API_ENDPOINTS.submitInquiry, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('The secure gateway was unable to capture your request. Please try again.');
      }

      setIsSubmitted(true);
      setFormData({ name: '', email: '', company: '', projectDetails: '' });
      setFocusFields({});

      // Auto-clear success message after 6 seconds to restore inquiry form
      setTimeout(() => {
        setIsSubmitted(false);
      }, 6000);
    } catch (err: any) {
      console.error('[Inquiry System Error]', err);
      setSubmissionError(err.message || 'System uplink failed. Check your connection or contact direct support.');
    } finally {
      setIsSending(false);
    }
  };

  const title = header?.title || "Inquire a Digital Quote";
  const description = header?.description || "Brief us regarding your system specs, custom pages, or scale aspirations. Our technical lead responds within one rapid business sprint cycle.";
  const submitSuccessTitle = header?.submitSuccessTitle || "System Logs: Submission Received";
  const submitSuccessDescription = header?.submitSuccessDescription || "Our servers successfully logged your digital profile. A representative of ACE10 will contact you immediately.";

  return (
    <section id="contact" className="py-28 px-6 md:px-12 bg-slate-950/40 backdrop-blur-3xl border-t border-slate-900 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/5 filter blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-glass text-white tracking-wider mt-3 uppercase">
            {title}
          </h2>
          <p className="text-slate-400 mt-4 leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {isSubmitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-10 rounded-3xl bg-slate-900/60 border border-emerald-500/30 text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
              <Icons.CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">{submitSuccessTitle}</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              {submitSuccessDescription}
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 md:p-12 rounded-[2rem] bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Name field */}
              <div className="relative pt-6">
                <label 
                  className={`absolute left-0 cursor-text transition-all duration-300 font-medium ${
                    focusFields.name || formData.name ? 'top-0 text-xs text-blue-400' : 'top-7 text-base text-slate-500'
                  }`}
                  htmlFor="name"
                >
                  Your Full Name
                </label>
                <input 
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  onFocus={() => handleFocus('name')}
                  onBlur={(e) => handleBlur('name', e.target.value)}
                  className="w-full bg-transparent py-2 border-b border-slate-800 text-white placeholder-transparent focus:outline-none transition-colors"
                />
                {/* Underline draw animation element */}
                <span 
                  className={`absolute bottom-0 left-0 h-0.5 transition-all duration-500 origin-left`}
                  style={{ 
                    backgroundColor: theme.secondaryColor,
                    width: focusFields.name ? '100%' : '0%'
                  }}
                />
              </div>

              {/* Email field */}
              <div className="relative pt-6">
                <label 
                  className={`absolute left-0 cursor-text transition-all duration-300 font-medium ${
                    focusFields.email || formData.email ? 'top-0 text-xs text-blue-400' : 'top-7 text-base text-slate-500'
                  }`}
                  htmlFor="email"
                >
                  Business Email
                </label>
                <input 
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onFocus={() => handleFocus('email')}
                  onBlur={(e) => handleBlur('email', e.target.value)}
                  className="w-full bg-transparent py-2 border-b border-slate-800 text-white placeholder-transparent focus:outline-none transition-colors"
                />
                <span 
                  className={`absolute bottom-0 left-0 h-0.5 transition-all duration-500 origin-left`}
                  style={{ 
                    backgroundColor: theme.secondaryColor,
                    width: focusFields.email ? '100%' : '0%'
                  }}
                />
              </div>

            </div>

            {/* Company field */}
            <div className="relative pt-6">
              <label 
                className={`absolute left-0 cursor-text transition-all duration-300 font-medium ${
                  focusFields.company || formData.company ? 'top-0 text-xs text-blue-400' : 'top-7 text-base text-slate-500'
                }`}
                htmlFor="company"
              >
                Company Name / Association (Optional)
              </label>
              <input 
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                onFocus={() => handleFocus('company')}
                onBlur={(e) => handleBlur('company', e.target.value)}
                className="w-full bg-transparent py-2 border-b border-slate-800 text-white placeholder-transparent focus:outline-none transition-colors"
              />
              <span 
                className={`absolute bottom-0 left-0 h-0.5 transition-all duration-500 origin-left`}
                style={{ 
                  backgroundColor: theme.secondaryColor,
                  width: focusFields.company ? '100%' : '0%'
                }}
              />
            </div>

            {/* Project Details textarea */}
            <div className="relative pt-6">
              <label 
                className={`absolute left-0 cursor-text transition-all duration-300 font-medium ${
                  focusFields.projectDetails || formData.projectDetails ? 'top-0 text-xs text-blue-400' : 'top-7 text-base text-slate-500'
                }`}
                htmlFor="projectDetails"
              >
                Elaborate regarding your website scope...
              </label>
              <textarea 
                id="projectDetails"
                required
                rows={4}
                value={formData.projectDetails}
                onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                onFocus={() => handleFocus('projectDetails')}
                onBlur={(e) => handleBlur('projectDetails', e.target.value)}
                className="w-full bg-transparent py-2 border-b border-slate-800 text-white placeholder-transparent focus:outline-none transition-colors resize-none mb-4"
              />
              <span 
                className={`absolute bottom-4 left-0 h-0.5 transition-all duration-500 origin-left`}
                style={{ 
                  backgroundColor: theme.secondaryColor,
                  width: focusFields.projectDetails ? '100%' : '0%'
                }}
              />
            </div>

            {submissionError && (
              <div className="p-4 bg-red-950/40 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-start gap-2">
                <Icons.AlertTriangle className="w-5 h-5 shrink-0" />
                <span>{submissionError}</span>
              </div>
            )}

            {/* Button Morph Effect */}
            <div className="flex justify-end pt-4">
              <motion.button
                type="submit"
                disabled={isSending}
                whileHover={isSending ? {} : { scale: 1.05 }}
                whileTap={isSending ? {} : { scale: 0.98 }}
                className={`px-8 py-4 rounded-full font-bold text-white shadow-lg flex items-center gap-2 group transition-all duration-300 relative overflow-hidden ${isSending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                style={{ backgroundColor: theme.accentColor }}
              >
                <span>{isSending ? 'Transmitting Inbound...' : 'Dispatch Tech Request'}</span>
                {isSending ? (
                  <Icons.Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Icons.Send className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                )}
              </motion.button>
            </div>

          </form>
        )}

      </div>
    </section>
  );
}
