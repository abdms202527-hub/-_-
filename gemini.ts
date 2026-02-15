import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDivineThought = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'Generate a short divine, spiritual Hindi quote (Suvichar) for a temple website. Only the text.',
      config: {
        systemInstruction: 'You are a spiritual guide for a temple. Provide a short, uplifting one-sentence Hindi suvichar.'
      }
    });
    return response.text?.trim() || "ईश्वर में विश्वास ही शक्ति का स्रोत है।";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "ईश्वर में विश्वास ही शक्ति का स्रोत है।";
  }
};