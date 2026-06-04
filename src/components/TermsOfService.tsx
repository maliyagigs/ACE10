import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
  theme: {
    primaryColor: string;
  };
}

export default function TermsOfService({ onBack, theme }: TermsOfServiceProps) {
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
        <h1 className="text-4xl font-bold tracking-tight text-white mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-slate-300">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-semibold text-white mt-10 mb-4">1. Agreement to Terms</h2>
          <p>
            By accessing or using our websites, applications, and services, you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mt-10 mb-4">2. Intellectual Property</h2>
          <p>
            The Service and its original content, features and functionality are and will remain the exclusive property of our company and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mt-10 mb-4">3. Links To Other Web Sites</h2>
          <p>
            Our Service may contain links to third-party web sites or services that are not owned or controlled by our company.
          </p>
          <p>
            We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that we shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-10 mb-4">4. Termination</h2>
          <p>
            We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
          <p>
            Upon termination, your right to use the Service will immediately cease.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-10 mb-4">5. Limitation Of Liability</h2>
          <p>
            In no event shall our company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-10 mb-4">6. Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mt-10 mb-4">7. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
