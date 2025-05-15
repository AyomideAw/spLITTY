import { useState } from 'react';
import SplitResult from './SplitResult';

export default function ExpenseForm() {
  const [input, setInput] = useState('');
  const [split, setSplit] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch('http://localhost:8978/api/expenses/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input })
    });
    const data = await res.json();
    setSplit(data.split);
    setLoading(false);
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
      {split && <SplitResult split={split} />}
    </div>
  );
}
