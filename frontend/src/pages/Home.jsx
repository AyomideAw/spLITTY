import { useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ReceiptUpload from '../components/ReceiptUpload';
import TextSplitResult from '../components/TextSplitResult';
import ReceiptSplitResult from '../components/ReceiptSplitResult';

export default function Home() {
  const [textResult, setTextResult] = useState(null);
  const [receiptResult, setReceiptResult] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-4">spLITTY – AI Bill Splitter</h1>

      <ExpenseForm setTextResult={setTextResult} />
      {textResult && <TextSplitResult split={textResult} />}

      <div className="border-t border-gray-300 my-8"></div>

      <ReceiptUpload setReceiptResult={setReceiptResult} />
      {receiptResult && <ReceiptSplitResult split={receiptResult} />}
    </div>
  );
}
