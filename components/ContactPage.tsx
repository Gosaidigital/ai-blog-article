import React from 'react';

interface PageProps {
  onShowMain: () => void;
}

const ContactPage: React.FC<PageProps> = ({ onShowMain }) => {
  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in mt-8">
      <div className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Contact Us</h2>
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
            We'd love to hear from you! Whether you have a question, feedback, or a suggestion, please don't hesitate to get in touch.
          </p>
          <p>
            For support, inquiries, or bug reports, please email us directly at:
          </p>
          <p className="text-center">
            <a 
              href="mailto:digitalgosai@gmail.com" 
              className="text-indigo-400 font-semibold text-lg hover:text-indigo-300 transition-colors"
            >
              digitalgosai@gmail.com
            </a>
          </p>
          <p>
            We do our best to respond to all inquiries as quickly as possible. Your feedback is important to us and helps us improve the Gosai AI Blog Article Generator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
