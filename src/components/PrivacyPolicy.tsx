import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
  theme: {
    primaryColor: string;
  };
}

export default function PrivacyPolicy({ onBack, theme }: PrivacyPolicyProps) {
  return (
    <div className="max-w-4xl mx-auto pt-32 pb-20 px-6 prose prose-invert prose-slate">
      <motion.button
        onClick={onBack}
        whileHover={{ x: -4 }}
        className="mb-8 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <Icons.ArrowLeft className="w-4 h-4" />
        Back to Home
      </motion.button>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold tracking-tight text-white mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-slate-300">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-semibold text-white mt-10 mb-4">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create or modify your account, requested services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mt-10 mb-4">2. Use of Information</h2>
          <p>
            We may use the information we collect about you to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Provide, maintain, and improve our services.</li>
            <li>Perform internal operations, including, for example, to prevent fraud and abuse.</li>
            <li>Send you communications we think will be of interest to you, including information about products, services, promotions, news, and events.</li>
            <li>Personalize and improve the services, including to provide or recommend features, content, social connections, referrals, and advertisements.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-10 mb-4">3. Sharing of Information</h2>
          <p>
            We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>With vendors, consultants, marketing partners, and other service providers who need access to such information to carry out work on our behalf.</li>
            <li>In response to a request for information by a competent authority if we believe disclosure is in accordance with, or is otherwise required by, any applicable law, regulation, or legal process.</li>
            <li>With law enforcement officials, government authorities, or other third parties if we believe your actions are inconsistent with our user agreements, Terms of Service, or policies.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-10 mb-4">4. Security</h2>
          <p>
            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-10 mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Statement, please contact us.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
