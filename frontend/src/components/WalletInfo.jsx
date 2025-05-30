// // frontend/src/components/WalletInfo.jsx
// import { useEffect, useState } from 'react';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../../firebase';
// import { useAuth } from '../context/AuthContext';
// import { CopyToClipboard } from 'react-copy-to-clipboard';
// import { Check, Copy } from 'lucide-react';

// export default function WalletInfo() {
//   const { user } = useAuth();
//   const [wallet, setWallet] = useState(null);
//   const [copied, setCopied] = useState(false);

//   // 🔍 Reverse ANS Lookup
//   const getAptosName = async (address) => {
//     try {
//       const res = await fetch(`https://www.aptosnames.com/api/mainnet/v1/name/${address}`);
//       if (!res.ok) throw new Error('Not found');
//       const data = await res.json();
//       return data.name;
//     } catch (e) {
//       console.error('ANS lookup failed:', e.message);
//       return null;
//     }
//   };

//   useEffect(() => {
//     if (!user) return;

//     const fetchWallet = async () => {
//       const ref = doc(db, 'users', user.uid);
//       const snap = await getDoc(ref);
//       if (snap.exists()) {
//         const walletAddr = snap.data().walletAddress;
//         const ansName = await getAptosName(walletAddr);
//         setWallet(ansName ? `${ansName}.apt` : walletAddr);
//       }
//     };

//     fetchWallet();
//   }, [user]);

//   if (!wallet) return null;

//   return (
//     <div className="flex items-center justify-center mt-2 text-sm text-gray-600 gap-2">
//       <img
//         src={`https://api.dicebear.com/7.x/identicon/svg?seed=${wallet}`}
//         alt="wallet avatar"
//         className="w-6 h-6 rounded-full"
//       />
//       <span className="font-mono text-indigo-700 truncate max-w-xs">{wallet}</span>
//       <CopyToClipboard
//         text={wallet}
//         onCopy={() => {
//           setCopied(true);
//           setTimeout(() => setCopied(false), 2000);
//         }}
//       >
//         <button title="Copy wallet" className="hover:text-indigo-500 transition">
//           {copied ? <Check size={16} /> : <Copy size={16} />}
//         </button>
//       </CopyToClipboard>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../context/AuthContext';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Check, Copy, RefreshCw } from 'lucide-react';

export default function WalletInfo() {
  const { user } = useAuth();
  const [walletAddr, setWalletAddr] = useState(null);
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  const getBalance = async (address) => {
    try {
      const res = await fetch(
        `https://fullnode.testnet.aptoslabs.com/v1/accounts/${address}/resources`
      );
      const data = await res.json();
      const coin = data.find((r) =>
        r.type.includes("0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>")
      );
      const raw = coin?.data?.coin?.value || "0";
      return (Number(raw) / 1e8).toFixed(8); // 8 decimal places
    } catch (err) {
      console.warn("Failed to fetch testnet balance:", err);
      return "0.00000000";
    }
  };

  const fetchWalletInfo = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const address = snap.data().walletAddress;
        setWalletAddr(address);
        const bal = await getBalance(address);
        setBalance(bal);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletInfo();
  }, [user]);

  if (!walletAddr) return null;

  return (
    <div className="flex flex-col items-center justify-center mt-2 text-sm text-gray-600 gap-1">
      <div className="flex items-center gap-2">
        <img
          src={`https://api.dicebear.com/7.x/identicon/svg?seed=${walletAddr}`}
          alt="wallet avatar"
          className="w-6 h-6 rounded-full"
        />
        <span className="font-mono text-indigo-700 truncate max-w-xs">{walletAddr}</span>
        <CopyToClipboard
          text={walletAddr}
          onCopy={() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        >
          <button title="Copy wallet" className="hover:text-indigo-500 transition">
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </CopyToClipboard>
      </div>

      {/* 💰 APT Balance */}
      {balance && (
        <div className="text-xs text-gray-500 flex items-center gap-2">
          💰 Balance: {balance} APT
          <button
            onClick={fetchWalletInfo}
            title="Refresh balance"
            className="text-indigo-500 hover:text-indigo-700 transition"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      )}

      {/* 🔗 Faucet */}
      <a
        href="https://aptos.dev/en/network/faucet"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline text-xs"
      >
        🚰 Get Test APT from Faucet
      </a>
    </div>
  );
}
