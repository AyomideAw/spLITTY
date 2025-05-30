// import { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { settlePayment } from '../aptos/contractClient';

// export default function SettlePage() {
//   const { aptosAccount } = useAuth();
//   const [to, setTo] = useState('');
//   const [amount, setAmount] = useState('');
//   const [txHash, setTxHash] = useState(null);

//   const handleSettle = async () => {
//     try {
//       const hash = await settlePayment(aptosAccount, to, parseInt(amount));
//       setTxHash(hash);
//     } catch (err) {
//       console.error('❌ Settlement failed:', err);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
//       <h2 className="text-xl font-semibold mb-4">Settle On-Chain</h2>
//       <input
//         type="text"
//         placeholder="To Wallet Address"
//         value={to}
//         onChange={(e) => setTo(e.target.value)}
//         className="w-full p-2 border mb-4"
//       />
//       <input
//         type="number"
//         placeholder="Amount (u64)"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//         className="w-full p-2 border mb-4"
//       />
//       <button onClick={handleSettle} className="bg-blue-600 text-white px-4 py-2 rounded">
//         Settle Payment
//       </button>

//       {txHash && (
//         <p className="mt-4 text-green-600">
//           ✅ Transaction:{" "}
//           <a
//             href={`https://explorer.aptoslabs.com/txn/${txHash}?network=testnet`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="underline"
//           >
//             {txHash.slice(0, 10)}...
//           </a>
//         </p>
//       )}
//     </div>
//   );
// }


import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { settlePayment } from '../aptos/contractClient';
import toast from 'react-hot-toast';
import VantaBackground from '../components/VantaBackground';
import Navbar from '../components/Navbar';

export default function SettlePage() {
  const { aptosAccount } = useAuth();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSettle = async () => {
    if (!aptosAccount) {
      toast.error('No wallet found. Please sign in.');
      return;
    }

    if (!to.startsWith('0x') || to.length !== 66) {
      toast.error('Invalid wallet address format.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Enter a valid amount.');
      return;
    }

    try {
      setLoading(true);
      toast.loading('Sending transaction...');
      const hash = await settlePayment(
        aptosAccount,
        to,
        Math.floor(parsedAmount * 1e8) // Convert APT → Octas
      );
      setTxHash(hash);
      toast.dismiss();
      toast.success('✅ Transaction sent!');
    } catch (err) {
      console.error('❌ Settlement failed:', err);
      toast.dismiss();
      toast.error('Settlement failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10"> 
        <VantaBackground />
      </div>
        <Navbar />
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Settle On-Chain</h2>
        <input
            type="text"
            placeholder="To Wallet Address"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full p-2 border mb-4 rounded"
        />
        <input
            type="number"
            placeholder="Amount (APT)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border mb-4 rounded"
        />
        <button
            onClick={handleSettle}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
            {loading ? 'Sending...' : 'Settle Payment'}
        </button>

        {txHash && (
            <p className="mt-4 text-green-600 text-sm">
            ✅ Transaction:{' '}
            <a
                href={`https://explorer.aptoslabs.com/txn/${txHash}?network=testnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
            >
                {txHash.slice(0, 10)}...
            </a>
            </p>
        )}
        </div>
    </div>
  );
}
