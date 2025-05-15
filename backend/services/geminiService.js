import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const askGemini = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 400,
      },
    });

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    console.log('Gemini raw response:', text);

    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const json = text.slice(jsonStart, jsonEnd);

    return JSON.parse(json);
  } catch (err) {
    console.error('[Gemini Error]:', err);
    throw new Error(err.message || 'Gemini API failed');
  }
};
