import React from 'react';

interface PageProps {
  onShowMain: () => void;
}

const AboutPage: React.FC<PageProps> = ({ onShowMain }) => {
  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in mt-8">
      <div className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">About Us</h2>
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
            Welcome to the <strong>Gosai AI Blog Article Generator</strong>, your powerful assistant for creating high-quality, SEO-friendly content in seconds. Our mission is to empower writers, marketers, and creators by leveraging the latest advancements in artificial intelligence to streamline the content creation process.
          </p>
          <p>
            Whether you're battling writer's block, looking to scale your content production, or aiming to improve your website's search engine ranking, our tool is designed to meet your needs. We provide a simple, intuitive interface that allows you to specify your topic, desired word count, language, and tone, generating a complete, well-structured article tailored to your requirements.
          </p>
          <h3 className="text-indigo-400">Our Features Include:</h3>
          <ul>
            <li><strong>SEO Optimization:</strong> Automatic generation of titles, meta descriptions, focus keywords, and tags.</li>
            <li><strong>Multi-language Support:</strong> Create content in English, Hindi, or a mix of both.</li>
            <li><strong>Customizable Tone:</strong> From professional to friendly, match the voice of your brand perfectly.</li>
            <li><strong>AI-Powered Image Prompts:</strong> Get creative prompts to generate the perfect featured image for your article.</li>
            <li><strong>FAQ Generation:</strong> Automatically create a relevant FAQ section to enhance your content's value.</li>
          </ul>
          <p>
            We are committed to continuous improvement and adding new features to make your content creation journey as effortless and effective as possible.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
