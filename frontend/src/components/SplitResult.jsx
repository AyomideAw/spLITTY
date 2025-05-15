export default function SplitResult({ split }) {
    return (
      <div className="mt-4 bg-gray-100 p-4 rounded shadow">
        <h2 className="font-bold mb-2">Split Breakdown:</h2>
        <ul>
          {Object.entries(split).map(([person, amount]) => (
            <li key={person}>
              {person}: ${Number(amount).toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    );
  }  