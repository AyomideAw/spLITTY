import { askGemini } from '../services/geminiService.js';

export const parseExpense = async (req, res) => {
  try {
    const { prompt } = req.body;

    const geminiPrompt = `
You're an expense splitting assistant. Given a message describing a group expense, extract how much each person owes.
Example input: "I paid $60 for dinner and $20 for Uber. Alice and Bob were with me."
Expected JSON:
{
  "Alice": 20,
  "Bob": 20,
  "You": 20
}
Input: ${prompt}
Return ONLY valid JSON.
`;

    const result = await askGemini(geminiPrompt);
    res.json({ split: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to parse expense.', details: err.message });
  }
};
