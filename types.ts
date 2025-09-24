export type WordCount = string;
export type Language = 'English' | 'Hindi' | 'Hindi-English Mix';
export type Tone = 'Formal' | 'Friendly' | 'Motivational' | 'Professional' | 'Human touch';
export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
export type View = 'main' | 'history' | 'about' | 'contact' | 'disclaimer' | 'privacy' | 'terms';

export interface FAQ {
  question: string;
  answer: string;
}

export interface Article {
  id: string;
  createdAt: string;
  seoTitle: string;
  metaDescription: string;
  focusKeyword: string;
  permalinkSuggestion: string;
  tags: string[];
  blogOutline: string;
  fullArticle: string;
  featuredImagePrompt: string;
  faq: FAQ[];
}

export interface SelectOption {
  value: string;
  label: string;
}