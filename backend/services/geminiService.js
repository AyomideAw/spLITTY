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

    // Remove markdown ```json or ``` wrappers if present
    const cleaned = text.replace(/```json|```/g, '').trim();

    // Log cleaned output for verification
    console.log('Cleaned Gemini output:', cleaned);

    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}') + 1;
    const json = cleaned.slice(jsonStart, jsonEnd);

    // Parse the cleaned JSON
    return JSON.parse(json);
  } catch (err) {
    console.error('[Gemini Error]:', err);
    throw new Error(err.message || 'Gemini API failed');
  }
};


// import dotenv from 'dotenv';
// import fetch from 'node-fetch';

// dotenv.config();

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent'; // ✅ Your model

// export const askGemini = async (prompt) => {
//   try {
//     console.log('[Gemini DEBUG] Using key:', GEMINI_API_KEY?.slice(0, 5) + '...');
//     const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         contents: [{ role: 'user', parts: [{ text: prompt }] }],
//         generationConfig: {
//           temperature: 0.4,
//           maxOutputTokens: 1024
//         },
//         safetySettings: [
//           { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 3 },
//           { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 3 },
//           { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 3 },
//           { category: 'HARM_CATEGORY_HARASSMENT', threshold: 3 },
//           { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 3 }
//         ]
//       })
//     });

//     console.log('[Gemini DEBUG] Status:', response.status);
//     const result = await response.json();
//     console.log('[Gemini DEBUG] Response JSON:', JSON.stringify(result, null, 2));

//     const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
//     console.log('[Raw Gemini Text]', text);

//     if (!text) throw new Error('No response from Gemini.');

//     const cleaned = text.replace(/```json|```/g, '').trim();
//     const jsonStart = cleaned.indexOf('{');
//     const jsonEnd = cleaned.lastIndexOf('}');
//     const json = cleaned.slice(jsonStart, jsonEnd + 1);

//     const parsed = JSON.parse(json);

//     if (!parsed.items || !Array.isArray(parsed.items)) {
//       throw new Error('Invalid format returned by Gemini');
//     }

//     return parsed;
//   } catch (err) {
//     console.error('[Gemini Error]', err.message);
//     throw new Error('Failed to parse Gemini response.');
//   }
// };

