// import { useState } from 'react';
// import ExpenseForm from '../components/ExpenseForm';
// import ReceiptUpload from '../components/ReceiptUpload';
// import TextSplitResult from '../components/TextSplitResult';
// import ReceiptSplitResult from '../components/ReceiptSplitResult';

// export default function Home() {
//   const [textResult, setTextResult] = useState(null);
//   const [receiptResult, setReceiptResult] = useState(null);

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <h1 className="text-3xl font-bold text-center text-indigo-700 mb-4">spLITTY – AI Bill Splitter</h1>

//       {/* Text Input Flow */}
//       <ExpenseForm setTextResult={setTextResult} />
//       {textResult && <TextSplitResult split={textResult} />}

//       <div className="border-t border-gray-300 my-8"></div>

//       {/* Receipt Upload Flow */}
//       <ReceiptUpload setReceiptResult={setReceiptResult} />
//       {receiptResult && <ReceiptSplitResult split={receiptResult} />}
//     </div>
//   );
// }

// import { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import AuthButton from '../components/AuthButton';
// import Dashboard from '../components/Dashboard';
// import ExpenseForm from '../components/ExpenseForm';
// import ReceiptUpload from '../components/ReceiptUpload';
// import TextSplitResult from '../components/TextSplitResult';
// import ReceiptSplitResult from '../components/ReceiptSplitResult';

// export default function Home() {
//   const { user } = useAuth(); // 🔐 Get current Firebase user
//   const [textResult, setTextResult] = useState(null);
//   const [receiptResult, setReceiptResult] = useState(null);

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
//         spLITTY – AI Bill Splitter
//       </h1>

//       <AuthButton />

//       {!user ? (
//         <p className="text-center mt-4 text-gray-600">
//           Please sign in with Google to use the app.
//         </p>
//       ) : (
//         <>
//           {/* View Past Splits */}
//           <Dashboard />

//           <div className="border-t border-gray-300 my-8" />

//           {/* 🔤 Text Split Flow */}
//           <ExpenseForm setTextResult={setTextResult} />
//           {textResult && <TextSplitResult split={textResult} />}

//           <div className="border-t border-gray-300 my-8" />

//           {/* 🧾 Receipt Upload Flow */}
//           <ReceiptUpload setReceiptResult={setReceiptResult} />
//           {receiptResult && <ReceiptSplitResult split={receiptResult} />}
//         </>
//       )}
//     </div>
//   );
// }

// frontend/src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import WalletInfo from '../components/WalletInfo'; // ✅ NEW: Import WalletInfo
import ExpenseForm from '../components/ExpenseForm';
import ReceiptUpload from '../components/ReceiptUpload';
import TextSplitResult from '../components/TextSplitResult';
import ReceiptSplitResult from '../components/ReceiptSplitResult';
import CombinedSummary from '../components/CombinedSummary';
import { combineSplits } from '../utils/combineSplits';
import { saveCombinedSplit } from '../api/firestore';
import VantaBackground from '../components/VantaBackground';

export default function Home() {
  const { user } = useAuth();
  const [textResult, setTextResult] = useState(null);
  const [receiptItems, setReceiptItems] = useState([]);
  const [receiptResult, setReceiptResult] = useState(null);
  const [combined, setCombined] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem('edit_split');
    if (cached) {
      const parsed = JSON.parse(cached);
      setCombined(parsed);
      localStorage.removeItem('edit_split');
    }
  }, []);

  useEffect(() => {
    if (textResult || receiptResult) {
      const merged = combineSplits(textResult, receiptResult);
      setCombined(merged);
      setSaved(false);
    }
  }, [textResult, receiptResult]);

  const handleSave = async () => {
    if (!user || !combined) return;
    try {
      await saveCombinedSplit(user.uid, combined);
      setSaved(true);
    } catch (err) {
      console.error('❌ Failed to save combined split:', err);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <VantaBackground />
      <Navbar />
      <WalletInfo /> {/* ✅ NEW: Display zkWallet + ANS */}
      <div className="p-4 max-w-4xl mx-auto relative z-10 text-gray-800">
        {/* Text Split Box */}
        <div className="bg-white/90 p-6 rounded-xl shadow mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Add any miscellaneous expenses made that aren’t on the receipt
          </h2>
          <ExpenseForm setTextResult={setTextResult} />
          {textResult && <TextSplitResult split={textResult} />}
        </div>

        {/* Receipt Split Box */}
        <div className="bg-white/90 p-6 rounded-xl shadow mb-8">
          <ReceiptUpload setReceiptItems={setReceiptItems} />
          {receiptItems.length > 0 && (
            <ReceiptSplitResult
              items={receiptItems}
              setReceiptSplit={setReceiptResult}
            />
          )}
        </div>

        {/* Combined Summary Box */}
        {combined && (
          <div className="bg-white/90 p-6 rounded-xl shadow">
            <CombinedSummary summary={combined} onSave={handleSave} isSaved={saved} />
          </div>
        )}
      </div>
    </div>
  );
}
