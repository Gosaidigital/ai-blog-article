import React from 'react';

interface HeaderProps {
    onShowHistory: () => void;
    onShowMain: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowHistory, onShowMain }) => {
  return (
    <header className="w-full text-center py-6 md:py-8">
      <h1 
        onClick={onShowMain}
        className="text-4xl md:text-5xl font-extrabold text-white cursor-pointer hover:text-gray-200 transition-colors"
        aria-label="Go to main generator page"
      >
        Gosai AI Blog Article Generator
      </h1>
      <p className="text-lg md:text-xl text-gray-400 mt-2">
        Craft SEO-friendly articles in seconds.
      </p>
       <button 
        onClick={onShowHistory} 
        className="mt-6 inline-flex items-center gap-2 bg-gray-700/50 hover:bg-gray-700/80 border border-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300"
        aria-label="View generation history"
       >
         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
         </svg>
         History
       </button>
    </header>
  );
};

export default Header;
