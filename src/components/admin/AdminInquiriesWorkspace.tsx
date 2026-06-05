import React from 'react';
import { AppContent, QuoteInquiry } from '../../types';
import * as Icons from 'lucide-react';

interface AdminInquiriesWorkspaceProps {
  key?: string;
  content: AppContent;
}

export function AdminInquiriesWorkspace({ content }: AdminInquiriesWorkspaceProps) {
  const inquiries = content.quoteInquiries || [];
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Digital Quote Inquiries</h2>
      {inquiries.length === 0 ? (
        <div className="p-8 border border-slate-800 rounded-xl text-center text-slate-500">
          No inquiries yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {inquiries.map((inquiry: QuoteInquiry) => (
            <div key={inquiry.id} className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-white">{inquiry.name}</h3>
                <span className="text-xs text-slate-500 font-mono">{inquiry.date}</span>
              </div>
              <p className="text-sm text-slate-400">{inquiry.email}</p>
              <p className="text-slate-200 mt-2">{inquiry.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
