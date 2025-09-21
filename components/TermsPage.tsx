import React from 'react';

interface PageProps {
  onShowMain: () => void;
}

const TermsPage: React.FC<PageProps> = ({ onShowMain }) => {
  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in mt-8">
      <div className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Terms and Conditions</h2>
          <button
            onClick={onShowMain}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold flex items-center gap-2"
            aria-label="Back to article generator"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
             </svg>
            Back to Generator
          </button>
        </div>
        <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-4">
            <p>
                Please read these Terms and Conditions ("Terms") carefully before using the Gosai AI Blog Article Generator (the "Service"). Your access to and use of the Service is conditioned upon your acceptance of and compliance with these Terms.
            </p>
            <h3 className="text-indigo-400">1. Use of the Service</h3>
            <p>
                You agree to use the Service responsibly and in compliance with all applicable laws. You are prohibited from using the Service to generate content that is hateful, defamatory, illegal, or infringes on the rights of others.
            </p>
            <h3 className="text-indigo-400">2. Intellectual Property</h3>
            <p>
                You retain all rights to the content you generate using the Service. You are responsible for ensuring that your input prompts do not violate any copyrights or trademarks. We claim no ownership over the articles you create.
            </p>
            <h3 className="text-indigo-400">3. Disclaimer of Warranties</h3>
            <p>
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties that the Service will be uninterrupted, error-free, or that the generated content will be accurate or fit for any particular purpose. Please refer to our Disclaimer page for more details.
            </p>
            <h3 className="text-indigo-400">4. Limitation of Liability</h3>
            <p>
                In no event shall the creators of the Gosai AI Blog Article Generator be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
            <h3 className="text-indigo-400">5. Changes to Terms</h3>
            <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
            </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
