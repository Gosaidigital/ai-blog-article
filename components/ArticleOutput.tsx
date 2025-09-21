import React, { useState, useEffect } from 'react';
import type { Article, FAQ, AspectRatio } from '../types';
import { generateFeaturedImage } from '../services/geminiService';
import { ASPECT_RATIO_OPTIONS } from '../constants';

interface ArticleOutputProps {
  article: Article;
}

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!textToCopy) return;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    return (
        <button
            onClick={handleCopy}
            className="absolute top-4 right-4 p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label={copied ? 'Copied' : 'Copy to clipboard'}
        >
            {copied ? (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            )}
        </button>
    );
};


const OutputCard: React.FC<{ title: string; children: React.ReactNode; textToCopy?: string }> = ({ title, children, textToCopy }) => (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 relative">
        <h3 className="text-xl font-bold text-indigo-400 mb-3">{title}</h3>
        {textToCopy && <CopyButton textToCopy={textToCopy} />}
        <div className={textToCopy ? "pr-10" : ""}>
            {children}
        </div>
    </div>
);

const ArticleOutput: React.FC<ArticleOutputProps> = ({ article }) => {
  const { seoTitle, metaDescription, focusKeyword, permalinkSuggestion, tags, blogOutline, fullArticle, featuredImagePrompt, faq } = article;

  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageWithTextUrl, setImageWithTextUrl] = useState<string | null>(null);

  const [editablePrompt, setEditablePrompt] = useState<string>(featuredImagePrompt);
  const [imageTitle, setImageTitle] = useState<string>(seoTitle);

  useEffect(() => {
    setEditablePrompt(article.featuredImagePrompt);
    setImageTitle(article.seoTitle);
    
    // Reset image-related state when a new article is loaded
    setGeneratedImage(null);
    setImageWithTextUrl(null);
    setIsImageLoading(false);
    setImageError(null);
  }, [article.id, article.featuredImagePrompt, article.seoTitle]);

  const handleGenerateImage = async () => {
      setIsImageLoading(true);
      setImageError(null);
      setGeneratedImage(null);
      setImageWithTextUrl(null);
      try {
          const imageUrl = await generateFeaturedImage(editablePrompt, aspectRatio);
          setGeneratedImage(imageUrl);
      } catch (err) {
          setImageError(err instanceof Error ? err.message : 'An unknown error occurred while generating the image.');
      } finally {
          setIsImageLoading(false);
      }
  };
  
  const handleAddTitleToImage = () => {
    if (!generatedImage || !imageTitle) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = generatedImage;

    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            setImageError("Could not get canvas context to add text.");
            return;
        };

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const fontSize = Math.max(30, Math.floor(img.width / 25));
        ctx.font = `bold ${fontSize}px 'Helvetica Neue', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        
        const maxWidth = canvas.width * 0.9;
        const words = imageTitle.split(' ');
        let line = '';
        const lines = [];

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                lines.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);
        
        const lineHeight = fontSize * 1.2;
        const totalTextHeight = lines.length * lineHeight;
        const barHeight = totalTextHeight + (fontSize * 0.8);
        const barY = canvas.height - barHeight;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, barY, canvas.width, barHeight);

        ctx.fillStyle = 'white';
        const textStartY = barY + (fontSize * 0.9);
        
        lines.forEach((line, index) => {
            ctx.fillText(line.trim(), canvas.width / 2, textStartY + (index * lineHeight));
        });

        setImageWithTextUrl(canvas.toDataURL('image/jpeg'));
    };
    
    img.onerror = () => {
        setImageError("Failed to load image for editing.");
    };
  };

  const handleRemoveTitle = () => {
    setImageWithTextUrl(null);
  };

  const formatFaqForCopy = (faqs: FAQ[]) => {
    if (!faqs || faqs.length === 0) return '';
    return faqs.map(item => `Q: ${item.question}\nA: ${item.answer}`).join('\n\n');
  };

  return (
    <div className="w-full mt-8 animate-fade-in">
        <OutputCard title="SEO Optimized Title" textToCopy={seoTitle}>
            <p className="text-2xl font-semibold text-white">{seoTitle}</p>
        </OutputCard>

        <OutputCard title="Meta Description" textToCopy={metaDescription}>
            <p className="text-gray-300 italic">{metaDescription}</p>
        </OutputCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OutputCard title="Focus Keyword" textToCopy={focusKeyword}>
                <p className="text-gray-200 font-medium bg-gray-700 p-3 rounded-md inline-block">{focusKeyword}</p>
            </OutputCard>
            <OutputCard title="Permalink Suggestion" textToCopy={permalinkSuggestion}>
                <p className="text-gray-300 font-mono text-sm bg-gray-700 p-3 rounded-md">/{permalinkSuggestion}</p>
            </OutputCard>
        </div>

        <OutputCard title="Tags" textToCopy={tags.join(', ')}>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                    <span key={index} className="bg-gray-700 text-indigo-300 text-sm font-medium px-3 py-1.5 rounded-full">
                        #{tag}
                    </span>
                ))}
            </div>
        </OutputCard>
        
        <OutputCard title="Featured Image Prompt" textToCopy={editablePrompt}>
            <textarea
                value={editablePrompt}
                onChange={(e) => setEditablePrompt(e.target.value)}
                rows={3}
                className="w-full bg-gray-700 border border-gray-600 text-gray-300 font-mono rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 resize-y mb-4"
                aria-label="Editable featured image prompt"
            />
            <div className="border-t border-gray-700 pt-4">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="w-full sm:flex-1">
                        <label htmlFor="aspectRatio" className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
                        <select
                            id="aspectRatio"
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 appearance-none bg-no-repeat bg-right pr-10"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
                            disabled={isImageLoading}
                        >
                            {ASPECT_RATIO_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleGenerateImage}
                        disabled={isImageLoading}
                        className="w-full sm:w-auto flex items-center justify-center bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 transition-all duration-300 disabled:bg-green-400 disabled:cursor-not-allowed"
                    >
                        {isImageLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                                Generate Image
                            </>
                        )}
                    </button>
                </div>
                
                <div className="mt-6 text-center">
                    {isImageLoading && <p className="text-gray-400">Please wait, image generation can take a moment...</p>}
                    {imageError && (
                        <div className="w-full bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
                            {imageError}
                        </div>
                    )}
                    {generatedImage && (
                        <div className="space-y-4 animate-fade-in">
                            <img src={imageWithTextUrl || generatedImage} alt="Generated featured image" className="rounded-lg shadow-lg w-full object-contain" />
                             
                            {!imageWithTextUrl && (
                                <div className="w-full max-w-md mx-auto pt-4">
                                    <label htmlFor="imageTitleInput" className="block text-sm font-medium text-gray-300 mb-2">
                                        Edit Title for Image
                                    </label>
                                    <input
                                        type="text"
                                        id="imageTitleInput"
                                        value={imageTitle}
                                        onChange={(e) => setImageTitle(e.target.value)}
                                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                                        placeholder="Enter title to overlay on image"
                                    />
                                </div>
                            )}

                             <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
                                {imageWithTextUrl ? (
                                    <button onClick={handleRemoveTitle} className="inline-flex items-center gap-2 bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-yellow-700 transition-all duration-300">
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-1 1v1H4a1 1 0 000 2h1v9a2 2 0 002 2h6a2 2 0 002-2V6h1a1 1 0 100-2h-4V3a1 1 0 00-1-1H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm3 4a1 1 0 10-2 0v4a1 1 0 102 0v-4z" clipRule="evenodd" />
                                        </svg>
                                        Remove Title
                                    </button>
                                ) : (
                                    <button onClick={handleAddTitleToImage} className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                          <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                          <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                        </svg>
                                        Add Title to Image
                                    </button>
                                )}
                                <a
                                    href={imageWithTextUrl || generatedImage}
                                    download={`gosai-ai-image-${Date.now()}.jpeg`}
                                    className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-all duration-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Download Image
                                </a>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </OutputCard>

        <OutputCard title="Blog Outline" textToCopy={blogOutline}>
            <div className="text-gray-300 whitespace-pre-wrap prose prose-invert max-w-none">
                {blogOutline}
            </div>
        </OutputCard>

        <OutputCard title="Full Blog Article" textToCopy={fullArticle}>
            <div className="text-gray-300 whitespace-pre-wrap prose prose-invert max-w-none leading-relaxed">
                {fullArticle}
            </div>
        </OutputCard>

        {faq && faq.length > 0 && (
          <OutputCard title="Frequently Asked Questions" textToCopy={formatFaqForCopy(faq)}>
            <div className="space-y-4">
              {faq.map((item, index) => (
                <details key={index} className="bg-gray-700/50 rounded-lg group">
                  <summary className="p-4 cursor-pointer font-semibold text-white flex justify-between items-center list-none hover:bg-gray-700/70 transition-colors duration-200">
                    <span>{item.question}</span>
                    <svg className="h-5 w-5 transform transition-transform duration-200 group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="p-4 border-t border-gray-600 text-gray-300 prose prose-invert max-w-none">
                    <p>{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </OutputCard>
        )}
    </div>
  );
};

export default ArticleOutput;