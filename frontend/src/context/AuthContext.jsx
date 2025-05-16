// // frontend/src/context/AuthContext.jsx
// import { createContext, useContext, useEffect, useState } from 'react';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from '../../firebase';

// import { AptosAccount } from 'aptos';
// import toast from 'react-hot-toast';
// import { saveWalletAddress } from '../../firebase';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, setUser);
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (!user) return;

//     const createZkWallet = async () => {
//         const email = user.email;
//         const seed = new TextEncoder().encode(email);
//         const hashBuffer = await crypto.subtle.digest('SHA-256', seed);
//         const privateKeyBytes = new Uint8Array(hashBuffer).slice(0, 32);
      
//         const account = new AptosAccount(privateKeyBytes);
      
//         const walletAddress = account.address().toString();
//         await saveWalletAddress(user.uid, walletAddress);
//         toast.success('zkWallet created successfully!');
//     };
      

//     createZkWallet();
//   }, [user]);

//   return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => useContext(AuthContext);

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
  const [aptosAccount, setAptosAccount] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const email = firebaseUser.email;
          const seed = new TextEncoder().encode(email);
          const hashBuffer = await crypto.subtle.digest('SHA-256', seed);
          const privateKeyBytes = new Uint8Array(hashBuffer).slice(0, 32);
          const account = new AptosAccount(privateKeyBytes);

          setAptosAccount(account);

          const walletAddress = account.address().toString();
          await saveWalletAddress(firebaseUser.uid, walletAddress);

          toast.success('zkWallet created successfully!');
        } catch (err) {
          console.error('zkWallet creation failed:', err);
          toast.error('zkWallet creation failed.');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, aptosAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
