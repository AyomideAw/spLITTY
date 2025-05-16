// frontend/src/api/firestore.js
import { db } from '../../firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { deleteDoc, doc } from 'firebase/firestore';

// Delete a specific split by document ID
export const deleteSplitById = async (id) => {
  const ref = doc(db, 'splits', id);
  await deleteDoc(ref);
};

// 🔵 Save individual split (you can remove if no longer using)
// export const saveSplit = async (userId, splitData) => {
//   const ref = collection(db, 'splits');
//   await addDoc(ref, {
//     userId,
//     split: splitData,
//     createdAt: Date.now(),
//   });
// };

// 🔵 Save combined (text + receipt) split
export const saveCombinedSplit = async (userId, combinedData) => {
  const ref = collection(db, 'splits'); // ✅ use same collection
  await addDoc(ref, {
    userId,
    split: combinedData,
    createdAt: Date.now(),
  });
};

// 🔍 Get all splits for this user
export const getUserSplits = async (userId) => {
  const q = query(collection(db, 'splits'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
