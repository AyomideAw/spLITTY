// frontend/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBc0GtaEW2yA6u-RUm8cmHVEJDnZ5njlVU",
    authDomain: "splitty-79fcc.firebaseapp.com",
    projectId: "splitty-79fcc",
    storageBucket: "splitty-79fcc.firebasestorage.app",
    messagingSenderId: "452170922681",
    appId: "1:452170922681:web:b6d7e9d80a9174c115b968"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
