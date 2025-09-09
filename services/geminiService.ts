// FIX: Fix imports by removing unused 'Type' and adding missing local types.
import { GoogleGenAI, Modality, Part } from "@google/genai";
import type { CreateFunction, EditFunction } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File): Promise<Part> => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: {
            data: await base64EncodedDataPromise,
            mimeType: file.type,
        },
    };
};

const augmentPrompt = (prompt: string, functionType: CreateFunction): string => {
    switch(functionType) {
        case 'sticker':
            return `A vibrant, die-cut sticker of ${prompt}, with a thick white border, cartoon style.`;
        case 'text':
            return `A clean, modern text-based logo for "${prompt}". The logo should be on a plain white background.`;
        case 'comic':
            return `A comic book panel illustration of ${prompt}, in a dynamic, action-packed style with bold lines and vibrant colors.`;
        case 'thumbnail':
            return `Create a vibrant and eye-catching YouTube thumbnail about "${prompt}". The thumbnail should be visually engaging, with bold, readable text for the title, high contrast, and designed to attract clicks.`;
        case 'object3d':
            return `A high-quality 3D model render of ${prompt}, clean studio lighting, on a neutral plain background, photorealistic style.`;
        case 'free':
        default:
            return prompt;
    }
};

export const generateImage = async (prompt: string, functionType: CreateFunction): Promise<string> => {
    const augmentedPrompt = augmentPrompt(prompt, functionType);
    const isThumbnail = functionType === 'thumbnail';

    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: augmentedPrompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: isThumbnail ? '16:9' : '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
    }
    throw new Error("Não foi possível gerar a imagem.");
};


export const editImage = async (prompt: string, image: File, functionType: EditFunction): Promise<string> => {
    const imagePart = await fileToGenerativePart(image);
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [imagePart, textPart],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }
    throw new Error("Não foi possível editar a imagem ou nenhuma imagem foi retornada.");
};

export const composeImages = async (prompt: string, image1: File, image2: File): Promise<string> => {
    const imagePart1 = await fileToGenerativePart(image1);
    const imagePart2 = await fileToGenerativePart(image2);
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [imagePart1, imagePart2, textPart],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }
    throw new Error("Não foi possível unir as imagens ou nenhuma imagem foi retornada.");
};