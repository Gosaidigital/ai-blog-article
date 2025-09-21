import React from 'react';
import type { Article } from '../types';

interface HistoryPageProps {
  history: Article[];
  onSelectArticle: (article: Article) => void;
  onClearHistory: () => void;
  onDeleteArticle: (id: string) => void;
  onShowMain: () => void;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ history, onSelectArticle, onClearHistory, onDeleteArticle, onShowMain }) => {
  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in mt-8">
      <div className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Generation History</h2>
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

        {history.length > 0 ? (
          <>
            <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-3">
              {history.map((article) => (
                <div
                  key={article.id}
                  className="w-full flex justify-between items-center p-4 bg-gray-700/50 rounded-lg group"
                >
                  <button
                    onClick={() => onSelectArticle(article)}
                    className="flex-grow text-left focus:outline-none"
                  >
                    <p className="font-semibold text-indigo-300 truncate group-hover:text-indigo-200 transition-colors">{article.seoTitle}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(article.createdAt).toLocaleString()}
                    </p>
                  </button>
                  <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm("Are you sure you want to delete this article from history?")) {
                            onDeleteArticle(article.id);
                        }
                    }}
                    className="ml-4 p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/50 rounded-full transition-colors"
                    aria-label={`Delete article titled ${article.seoTitle}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-gray-700 pt-4">
                <button
                onClick={onClearHistory}
                className="w-full px-4 py-2 bg-red-600/50 text-red-200 border border-red-500 rounded-lg hover:bg-red-600/70 transition-colors font-semibold"
                aria-label="Clear all generation history"
                >
                Clear All History
                </button>
            </div>
          </>
        ) : (
            <div className="text-center py-10">
                <p className="text-gray-400">Your generation history is empty.</p>
                <p className="text-gray-500 text-sm mt-2">Generated articles will appear here.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;