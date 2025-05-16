import { extractTextFromImage } from '../services/ocrService.js';
import { askGemini } from '../services/geminiService.js';

export const processReceipt = async (req, res) => {
  try {
    const imagePath = req.file.path;

    // Step 1: OCR Extract
    const ocrText = await extractTextFromImage(imagePath);

    // Step 2: Gemini Prompt
    const geminiPrompt = `
You're an expense assistant. A user scanned this receipt. Here's the raw OCR text:

"""
${ocrText}
"""

Extract the line-item expenses and return only valid JSON.

Format:
{
  "items": [
    { "name": "Burger", "price": 5.00, "qty": 2 },
    { "name": "Soda", "price": 3.00, "qty": 1 }
  ],
  "total": 13.00
}

Only return JSON. No markdown, comments, or explanations.
`;

    // Step 3: Ask Gemini
    const parsed = await askGemini(geminiPrompt);

    // Step 4: Respond to frontend
    res.json({ ocrText, parsed });

  } catch (err) {
    console.error('[❌ OCR Error]', err);
    res.status(500).json({ error: 'Failed to process receipt.', details: err.message });
  }
};
