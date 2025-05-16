import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function SplitDetail() {
  const { id } = useParams();
  const [split, setSplit] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const ref = doc(db, 'splits', id);
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        setSplit(docSnap.data());
      }
    };
    fetch();
  }, [id]);

  if (!split) return <p className="text-center mt-10">Loading split...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-4 mt-6 rounded shadow">
      <h2 className="text-xl font-bold mb-2">Split Details</h2>
      <p className="text-gray-500 text-sm mb-2">
        Saved: {new Date(split.createdAt).toLocaleString()}
      </p>
      <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
        {JSON.stringify(split.split, null, 2)}
      </pre>
    </div>
  );
}
