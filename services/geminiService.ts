import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { Article, Language, Tone, AspectRatio } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBlogArticle = async (
  topic: string,
  wordCount: string,
  language: Language,
  tone: Tone
): Promise<Omit<Article, 'id' | 'createdAt'>> => {
  const articleSchema = {
    type: Type.OBJECT,
    properties: {
        seoTitle: { type: Type.STRING, description: "A catchy, SEO-optimized title for the blog post." },
        metaDescription: { type: Type.STRING, description: "A concise meta description between 150 and 160 characters." },
        focusKeyword: { type: Type.STRING, description: "The primary SEO focus keyword for the article." },
        permalinkSuggestion: { type: Type.STRING, description: "A short, SEO-friendly URL slug, using hyphens to separate words." },
        tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of 5-7 relevant tags or keywords."
        },
        blogOutline: { type: Type.STRING, description: "A well-structured outline using markdown-style headings." },
        fullArticle: { type: Type.STRING, description: "The complete, plagiarism-free blog article as a single string with markdown formatting." },
        featuredImagePrompt: { type: Type.STRING, description: "A descriptive prompt for an AI image generator to create a relevant featured image." },
        faq: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING }
                },
                required: ['question', 'answer']
            },
            description: "An array of 3-5 frequently asked questions (FAQs) related to the blog topic."
        }
    },
    required: ['seoTitle', 'metaDescription', 'focusKeyword', 'permalinkSuggestion', 'tags', 'blogOutline', 'fullArticle', 'featuredImagePrompt', 'faq']
  };

  const prompt = `
    You are an expert blog article writer and SEO specialist. Your task is to generate a complete blog post based on the provided specifications.

    **Topic:** "${topic}"

    **Requirements:**
    - **Word Count:** Approximately ${wordCount} words.
    - **Language:** ${language}. If "Hindi-English Mix" is selected, use a natural blend of both languages (Hinglish).
    - **Tone:** ${tone}. If 'Human touch' is selected, write in a personal, relatable, and engaging style.
    - **Content:** The content must be unique, plagiarism-free, and SEO-friendly.
    
    Generate the output as a single, valid JSON object that strictly adheres to the provided schema. Do not include any other text or markdown formatting. The output should contain:
    - A catchy, SEO-optimized title.
    - A concise meta description between 150 and 160 characters.
    - The primary SEO focus keyword.
    - A short, SEO-friendly URL slug (e.g., "my-awesome-post").
    - An array of 5-7 relevant tags.
    - A well-structured outline using markdown headings.
    - The complete article using markdown for formatting (headings, paragraphs, lists).
    - A descriptive prompt for an AI image generator.
    - An array of 3-5 frequently asked questions with concise answers.
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: articleSchema,
        },
    });

    const jsonText = response.text.trim();
    const articleData = JSON.parse(jsonText);

    return articleData as Omit<Article, 'id' | 'createdAt'>;
  } catch (error) {
    console.error("Error generating article:", error);
    if (error instanceof Error) {
        if (error.name === 'SyntaxError') {
             throw new Error(`Failed to generate article: The AI returned an invalid JSON format. Please try again.`);
        }
        throw new Error(`Failed to generate article: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the article.");
  }
};

export const editFeaturedImage = async (
  prompt: string,
  base64ImageData: string,
  mimeType: string
): Promise<string> => {
  // Add a more explicit instruction to guide the model towards image editing.
  const editInstruction = `This is an image editing task. Edit the provided image based on the following instruction and only return the resulting image. Do not provide any text description or explanation. The instruction is: "${prompt}"`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: editInstruction,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (!response.candidates || response.candidates.length === 0 || !response.candidates[0].content || !response.candidates[0].content.parts) {
        const textResponse = response.text;
        if(textResponse) {
            throw new Error(`Image editing failed. The model returned the following text: "${textResponse}"`);
        }
        throw new Error("Image editing failed: The model returned an empty or invalid response.");
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }

    const textResponse = response.text;
    if (textResponse) {
        throw new Error(`The model returned a text response instead of an image: "${textResponse}"`);
    }

    throw new Error("No edited image was returned by the API.");
  } catch (error) {
    console.error("Error editing image:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to edit image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while editing the image.");
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