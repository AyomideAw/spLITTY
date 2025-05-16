// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';

import { AptosAccount } from 'aptos';
import toast from 'react-hot-toast';
import { saveWalletAddress } from '../../firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const createZkWallet = async () => {
        const email = user.email;
        const seed = new TextEncoder().encode(email);
        const hashBuffer = await crypto.subtle.digest('SHA-256', seed);
        const privateKeyBytes = new Uint8Array(hashBuffer).slice(0, 32);
      
        const account = new AptosAccount(privateKeyBytes);
      
        const walletAddress = account.address().toString();
        await saveWalletAddress(user.uid, walletAddress);
        toast.success('zkWallet created successfully!');
    };
      

    createZkWallet();
  }, [user]);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
