export default function TextSplitResult({ split }) {
  console.log('[TextSplitResult] Received split:', split); // ✅ Debug log

  if (!split || !split.people || typeof split.people !== 'object' || Object.keys(split.people).length === 0) {
    return (
      <div className="mt-6 bg-white p-4 rounded shadow text-red-600">
        <p>❌ No valid split data received.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h3 className="text-xl font-bold mb-2">Total Owed Per Person</h3>
      <ul className="list-disc pl-5">
        {Object.entries(split.people).map(([person, total]) => (
          <li key={person}>
            {person}: ${Number(total).toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}
