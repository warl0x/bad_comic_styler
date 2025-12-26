
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export async function transformImage(
  base64Image: string,
  prompt: string,
  mimeType: string = 'image/jpeg'
): Promise<string> {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1], // Remove metadata prefix if present
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        systemInstruction: "You are a world-class comic book artist and illustrator. Your goal is to recreate photos as highly stylized art. You NEVER produce photorealistic images. You focus on bold linework, cel-shading, hatching, and non-realistic color palettes. Every output must look like a hand-drawn illustration or a digital painting, never like a filtered photograph.",
      }
    });

    let transformedBase64 = '';
    
    // Iterate through parts to find the image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        transformedBase64 = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!transformedBase64) {
      // If the model returned text instead of an image, it might be due to safety filters or refusal
      const refusalText = response.text;
      throw new Error(refusalText || "The model could not generate the transformed image.");
    }

    return transformedBase64;
  } catch (error: any) {
    console.error("Transformation error:", error);
    throw new Error(error.message || "Failed to transform image. Please try again.");
  }
}
