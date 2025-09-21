import { GoogleGenAI } from "@google/genai";
import type { Article, WordCount, Language, Tone, AspectRatio } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBlogArticle = async (
  topic: string,
  wordCount: WordCount,
  language: Language,
  tone: Tone
): Promise<Omit<Article, 'id' | 'createdAt'>> => {
  const prompt = `
    You are an expert blog article writer and SEO specialist. Your task is to generate a complete blog post based on the provided specifications.

    Please generate a comprehensive blog post on the topic: "${topic}".

    The full blog article should be written with the generated SEO keywords naturally integrated.

    Adhere to the following requirements:
    1.  Word Count: Approximately ${wordCount} words.
    2.  Language: Write the entire content in ${language}. If "Hindi-English Mix" is selected, use a natural blend of both languages (Hinglish).
    3.  Tone: The tone of the article must be ${tone}. If 'Human touch' is selected, write in a personal, relatable, and engaging style, as if a real person is sharing their experience.
    4.  Structure: The output must be a single, valid JSON object that strictly conforms to the following TypeScript interface. Do not include any explanatory text, markdown formatting like \`\`\`json, or anything else before or after the JSON object.
        \`\`\`typescript
        interface Article {
          seoTitle: string; // A catchy, SEO-optimized title for the blog post.
          metaDescription: string; // A concise meta description between 150 and 160 characters.
          focusKeyword: string; // The primary SEO focus keyword for the article.
          permalinkSuggestion: string; // A short, SEO-friendly URL slug (permalink) for the blog post, using hyphens to separate words (e.g., "my-awesome-post").
          tags: string[]; // An array of 5-7 relevant tags or keywords for the blog post.
          blogOutline: string; // A well-structured outline of the blog post, using markdown-style headings (e.g., "## Introduction", "### Sub-point 1"). This should be a single string with newlines.
          fullArticle: string; // The complete, plagiarism-free blog article as a single string with markdown formatting for headings, paragraphs, and lists. The article should naturally incorporate the focus keyword and related terms.
          featuredImagePrompt: string; // A descriptive prompt for an AI image generator to create a relevant featured image for this blog post.
          faq: { question: string; answer: string; }[]; // An array of 3-5 frequently asked questions (FAQs) related to the blog topic, each with a question and a concise answer.
        }
        \`\`\`
    5.  Content: The content must be unique, plagiarism-free, and SEO-friendly with natural keyword placement.
    6.  Formatting: The 'fullArticle' and 'blogOutline' should be a single string containing markdown for structure (e.g. ## for H2, ### for H3, - for bullet points, and \\n for new lines).
    7.  SEO: Generate a focus keyword, a permalink suggestion, and an array of tags.
    8.  FAQ Section: Generate a list of 3-5 relevant "Frequently Asked Questions" (FAQs) with concise answers related to the main topic.
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    let jsonText = response.text.trim();

    // In case the model wraps the JSON in markdown, extract it.
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.substring(7);
      if (jsonText.endsWith('```')) {
        jsonText = jsonText.substring(0, jsonText.length - 3);
      }
      jsonText = jsonText.trim();
    }
    
    const articleData = JSON.parse(jsonText);

    return articleData as Omit<Article, 'id' | 'createdAt'>;
  } catch (error) {
    console.error("Error generating article:", error);
    if (error instanceof Error) {
        if (error.name === 'SyntaxError') {
             throw new Error(`Failed to generate article: The AI returned an invalid response format. Please try again.`);
        }
        throw new Error(`Failed to generate article: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the article.");
  }
};

export const generateFeaturedImage = async (
  prompt: string,
  aspectRatio: AspectRatio
): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image was generated by the API.");
    }

  } catch (error) {
    console.error("Error generating image:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};