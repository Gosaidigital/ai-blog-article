import React from 'react';

interface PageProps {
  onShowMain: () => void;
}

const PrivacyPolicyPage: React.FC<PageProps> = ({ onShowMain }) => {
  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in mt-8">
      <div className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Privacy Policy</h2>
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
                Your privacy is important to us. This Privacy Policy explains how the Gosai AI Blog Article Generator (the "Service") handles your information.
            </p>
            <h3 className="text-indigo-400">Information We Collect</h3>
            <p>
                This Service is designed to prioritize your privacy. We do not collect or store any personally identifiable information from you. We do not have user accounts, and we do not require you to sign in.
            </p>
            <h3 className="text-indigo-400">Local Storage</h3>
            <p>
                To provide the "History" feature, the articles you generate are saved directly in your web browser's local storage. This data is stored only on your computer and is not transmitted to our servers or any third party. You have full control over this data and can clear it at any time through the "Clear All History" button or by clearing your browser's cache.
            </p>
            <h3 className="text-indigo-400">Third-Party Services (Google Gemini API)</h3>
            <p>
                The Service uses the Google Gemini API to generate content. The prompts you enter (such as the topic, language, and tone) are sent to Google's servers to be processed. We do not send any personal information along with these requests. We encourage you to review <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google's Privacy Policy</a> to understand how they handle data.
            </p>
             <h3 className="text-indigo-400">Changes to This Policy</h3>
            <p>
                We may update this Privacy Policy from time to time. Any changes will be posted on this page. We encourage you to review this Privacy Policy periodically for any changes.
            </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
