import { useState } from 'react';

export default function ExpenseForm({ setTextResult }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8978/api/expenses/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: input })
      });

      const data = await res.json();
      console.log('[ExpenseForm] Backend response:', data);
      setTextResult(data.parsed); // ✅ pass to parent (Home.jsx)
    } catch (err) {
      console.error('Error during text split:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <textarea
        className="w-full border rounded p-2"
        rows="4"
        placeholder="E.g. I paid $90 for lunch with Alice and Bob"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Splitting...' : 'Split Now'}
      </button>
    </div>
  );
}
