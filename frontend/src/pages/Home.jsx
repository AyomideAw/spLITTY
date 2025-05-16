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


import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthButton from '../components/AuthButton';
import Dashboard from '../components/Dashboard';
import ExpenseForm from '../components/ExpenseForm';
import ReceiptUpload from '../components/ReceiptUpload';
import TextSplitResult from '../components/TextSplitResult';
import ReceiptSplitResult from '../components/ReceiptSplitResult';
import CombinedSummary from '../components/CombinedSummary';

import { combineSplits } from '../utils/combineSplits';
import { saveCombinedSplit } from '../api/firestore';

export default function Home() {
  const { user } = useAuth();

  const [textResult, setTextResult] = useState(null);
  const [receiptItems, setReceiptItems] = useState([]); // ✅ raw parsed receipt
  const [receiptResult, setReceiptResult] = useState(null); // ✅ final item-person assignment
  const [combined, setCombined] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem('edit_split');
    if (cached) {
      const parsed = JSON.parse(cached);
      setCombined(parsed); // or split into text/receipt depending on format
      localStorage.removeItem('edit_split');
    }
  }, []);
  

  useEffect(() => {
    if (textResult || receiptResult) {
      const merged = combineSplits(textResult, receiptResult);

      // ✅ Debug output
      console.log('🔍 textResult:', textResult);
      console.log('🧾 receiptResult:', receiptResult);
      console.log('📦 Combined Split:', merged);

      setCombined(merged);
      setSaved(false);
    }
  }, [textResult, receiptResult]);

  const handleSave = async () => {
    if (!user || !combined) return;

    try {
      await saveCombinedSplit(user.uid, combined);
      console.log('✅ Combined split saved to Firestore');
      setSaved(true);
    } catch (err) {
      console.error('❌ Failed to save combined split:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        spLITTY – AI Bill Splitter
      </h1>

      <AuthButton />

      {!user ? (
        <p className="text-center mt-4 text-gray-600">
          Please sign in with Google to use the app.
        </p>
      ) : (
        <>
          <Dashboard />

          <div className="border-t border-gray-300 my-8" />

          <ExpenseForm setTextResult={setTextResult} />
          {textResult && <TextSplitResult split={textResult} />}

          <div className="border-t border-gray-300 my-8" />

          <ReceiptUpload setReceiptItems={setReceiptItems} />
          {receiptItems.length > 0 && (
            <ReceiptSplitResult
              items={receiptItems}
              setReceiptSplit={setReceiptResult}
            />
          )}

          {combined && (
            <CombinedSummary summary={combined} onSave={handleSave} isSaved={saved} />
          )}
        </>
      )}
    </div>
  );
}
