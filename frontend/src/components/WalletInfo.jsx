// frontend/src/components/WalletInfo.jsx
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../context/AuthContext';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Check, Copy } from 'lucide-react';

export default function WalletInfo() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [copied, setCopied] = useState(false);

  // 🔍 Reverse ANS Lookup
  const getAptosName = async (address) => {
    try {
      const res = await fetch(`https://www.aptosnames.com/api/mainnet/v1/name/${address}`);
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();
      return data.name;
    } catch (e) {
      console.error('ANS lookup failed:', e.message);
      return null;
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchWallet = async () => {
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const walletAddr = snap.data().walletAddress;
        const ansName = await getAptosName(walletAddr);
        setWallet(ansName ? `${ansName}.apt` : walletAddr);
      }
    };

    fetchWallet();
  }, [user]);

  if (!wallet) return null;

  return (
    <div className="flex items-center justify-center mt-2 text-sm text-gray-600 gap-2">
      <img
        src={`https://api.dicebear.com/7.x/identicon/svg?seed=${wallet}`}
        alt="wallet avatar"
        className="w-6 h-6 rounded-full"
      />
      <span className="font-mono text-indigo-700 truncate max-w-xs">{wallet}</span>
      <CopyToClipboard
        text={wallet}
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
  );
}
