// // frontend/src/components/CombinedSummary.jsx
// export default function CombinedSummary({ summary, onSave, isSaved }) {
//     return (
//       <div className="bg-white p-4 rounded shadow max-w-2xl mx-auto mt-8">
//         <h2 className="text-xl font-bold mb-3">💰 Final Summary</h2>
//         <ul className="list-disc pl-5 space-y-1">
//           {Object.entries(summary).map(([name, value]) => (
//             <li key={name}>
//               <span className="font-medium">{name}:</span> ${Number(value).toFixed(2)}
//             </li>
//           ))}
//         </ul>
//         <button
//           onClick={onSave}
//           disabled={isSaved}
//           className={`mt-4 px-4 py-2 rounded text-white ${
//             isSaved ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
//           }`}
//         >
//           {isSaved ? '✅ Saved' : 'Save Summary'}
//         </button>
//       </div>
//     );
//   }
  

// frontend/src/components/CombinedSummary.jsx
import { useState } from 'react';
import toast from 'react-hot-toast';
import { logExpense } from '../aptos/contractClient';
import { saveCombinedSplit } from '../api/firestore';
import { useAuth } from '../context/AuthContext';

export default function CombinedSummary({ summary, onSave, isSaved }) {
  const { user, aptosAccount } = useAuth(); // ✅ Use zkLogin-generated signer
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user || !summary || !aptosAccount) {
      toast.error("Missing user or wallet.");
      return;
    }

    try {
      setLoading(true);

      // ✅ Save to Firestore
      await saveCombinedSplit(user.uid, summary);

      // ✅ Log each expense on-chain
      const promises = Object.entries(summary).map(([name, amount]) =>
        logExpense(aptosAccount, name, Math.floor(Number(amount)))
      );
      await Promise.all(promises);

      toast.success('Saved to Firestore + Logged on-chain!');
      onSave(); // Notify parent component
    } catch (err) {
      console.error('❌ Save or contract call failed:', err);
      toast.error('Something went wrong during saving or on-chain log.');
    } finally {
      setLoading(false);
    }
  };

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
        onClick={handleSave}
        disabled={isSaved || loading}
        className={`mt-4 px-4 py-2 rounded text-white ${
          isSaved || loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isSaved ? '✅ Saved' : loading ? 'Saving...' : 'Save Summary'}
      </button>
    </div>
  );
}
