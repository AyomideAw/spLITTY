// frontend/src/components/CombinedSummary.jsx
export default function CombinedSummary({ summary, onSave, isSaved }) {
    return (
      <div className="bg-white p-4 rounded shadow max-w-2xl mx-auto mt-8">
        <h2 className="text-xl font-bold mb-3">💰 Final Summary</h2>
        <ul className="list-disc pl-5 space-y-1">
          {Object.entries(summary).map(([name, value]) => (
            <li key={name}>
              <span className="font-medium">{name}:</span> ${Number(value).toFixed(2)}
            </li>
          ))}
        </ul>
        <button
          onClick={onSave}
          disabled={isSaved}
          className={`mt-4 px-4 py-2 rounded text-white ${
            isSaved ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isSaved ? '✅ Saved' : 'Save Summary'}
        </button>
      </div>
    );
  }
  