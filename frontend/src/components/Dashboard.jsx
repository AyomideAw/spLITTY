// // frontend/src/components/Dashboard.jsx
// import { useEffect, useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { getUserSplits } from '../api/firestore';

// export default function Dashboard() {
//   const { user } = useAuth();
//   const [splits, setSplits] = useState([]);

//   useEffect(() => {
//     const fetchSplits = async () => {
//       if (user) {
//         const data = await getUserSplits(user.uid);
//         setSplits(data);
//       }
//     };
//     fetchSplits();
//   }, [user]);

//   if (!user) return null;

//   return (
//     <div className="bg-white p-4 rounded shadow max-w-2xl mx-auto mt-6">
//       <h2 className="text-xl font-bold mb-4">📁 Your Past Splits</h2>
//       {splits.length === 0 ? (
//         <p>No splits saved yet.</p>
//       ) : (
//         <ul className="space-y-2">
//             {splits.map(({ id, split }) => (
//                 <li key={id} className="bg-gray-100 p-2 rounded">
//                 <pre className="text-sm overflow-x-auto">
//                     {JSON.stringify(split, null, 2)}
//                 </pre>
//                 </li>
//             ))}
//         </ul>

//       )}
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserSplits, deleteSplitById } from '../api/firestore';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [splits, setSplits] = useState([]);
  const navigate = useNavigate();

  const fetchSplits = async () => {
    if (user) {
      const data = await getUserSplits(user.uid);
      setSplits(data);
    }
  };

  useEffect(() => {
    fetchSplits();
  }, [user]);

  const handleDelete = async (id) => {
    await deleteSplitById(id);
    fetchSplits(); // Refresh
  };

  if (!user) return null;

  return (
    <div className="bg-white p-4 rounded shadow max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">📁 Your Past Splits</h2>
      {splits.length === 0 ? (
        <p>No splits saved yet.</p>
      ) : (
        <ul className="space-y-4">
          {splits.map(({ id, split, createdAt }) => (
            <li key={id} className="bg-gray-100 p-3 rounded shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Saved: {new Date(createdAt).toLocaleString()}
                  </div>
                  <pre className="text-xs overflow-x-auto mb-2">
                    {JSON.stringify(split, null, 2)}
                  </pre>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/split/${id}`)}
                    className="text-blue-600 underline"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
