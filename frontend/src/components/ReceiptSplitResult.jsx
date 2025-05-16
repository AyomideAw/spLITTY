// import { useState } from 'react';

// export default function ReceiptSplitResult({ split }) {
//   const [assignments, setAssignments] = useState({});
//   const [people, setPeople] = useState([]);
//   const [newPerson, setNewPerson] = useState('');

//   const handleAddPerson = () => {
//     const trimmed = newPerson.trim();
//     if (trimmed && !people.includes(trimmed)) {
//       setPeople([...people, trimmed]);
//       setNewPerson('');
//     }
//   };

//   const handleRemovePerson = (personToRemove) => {
//     setPeople((prev) => prev.filter((p) => p !== personToRemove));
//     setAssignments((prev) => {
//       const updated = { ...prev };
//       Object.keys(updated).forEach((item) => {
//         if (updated[item] === personToRemove) {
//           delete updated[item];
//         }
//       });
//       return updated;
//     });
//   };

//   const handleAssign = (item, person) => {
//     setAssignments((prev) => ({ ...prev, [item]: person }));
//   };

//   const handleReset = () => setAssignments({});

//   const receiptTotals = {};
//   people.forEach((p) => (receiptTotals[p] = 0));

//   Object.entries(split || {}).forEach(([item, priceOrData]) => {
//     const person = assignments[item];
//     let price = 0;
//     if (typeof priceOrData === 'object' && priceOrData.price && priceOrData.qty) {
//       price = priceOrData.price * priceOrData.qty;
//     } else if (typeof priceOrData === 'number') {
//       price = priceOrData;
//     }

//     if (person) {
//       receiptTotals[person] += price;
//     }
//   });

//   return (
//     <div className="mt-6 bg-white p-4 rounded shadow">
//       <h3 className="text-2xl font-bold mb-4">Assign Items to People</h3>

//       <div className="flex gap-2 mb-4">
//         <input
//           type="text"
//           placeholder="Add person"
//           value={newPerson}
//           onChange={(e) => setNewPerson(e.target.value)}
//           className="border px-2 py-1 rounded w-40"
//         />
//         <button onClick={handleAddPerson} className="bg-green-600 text-white px-3 py-1 rounded">
//           ➕ Add
//         </button>
//         <button onClick={handleReset} className="bg-gray-600 text-white px-3 py-1 rounded">
//           🔄 Reset
//         </button>
//       </div>

//       <div className="mb-4">
//         {people.map((p) => (
//           <span key={p} className="inline-flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded mr-2">
//             {p}
//             <button
//               onClick={() => handleRemovePerson(p)}
//               className="ml-1 text-red-500 hover:text-red-700"
//               title="Remove"
//             >
//               &times;
//             </button>
//           </span>
//         ))}
//       </div>

//       {Object.entries(split || {}).length > 0 && (
//         <div className="space-y-3 mb-6">
//           {Object.entries(split).map(([item, data]) => {
//             const price =
//               typeof data === 'object' && data.price && data.qty
//                 ? data.price * data.qty
//                 : typeof data === 'number'
//                 ? data
//                 : 0;

//             return (
//               <div key={item} className="flex items-center gap-4">
//                 <div className="w-1/3">{item}</div>
//                 <div className="w-1/4">${price.toFixed(2)}</div>
//                 <select
//                   value={assignments[item] || ''}
//                   onChange={(e) => handleAssign(item, e.target.value)}
//                   className="border rounded px-2 py-1"
//                 >
//                   <option value="">-- Assign --</option>
//                   {people.map((p) => (
//                     <option key={p} value={p}>
//                       {p}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       <div className="bg-gray-100 p-4 rounded">
//         <h4 className="font-bold mb-2">Total Owed Per Person</h4>
//         <ul>
//           {Object.entries(receiptTotals).map(([person, total]) => (
//             <li key={person}>
//               {person}: ${total.toFixed(2)}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from 'react';

export default function ReceiptSplitResult({ items, setReceiptSplit }) {
  const [assignments, setAssignments] = useState({});
  const [people, setPeople] = useState([]);
  const [newPerson, setNewPerson] = useState('');
  const [totals, setTotals] = useState({});

  // Recalculate totals when assignments or items change
  useEffect(() => {
    const receiptTotals = {};
    people.forEach((p) => (receiptTotals[p] = 0));

    items.forEach((item, index) => {
      const person = assignments[index];
      const amount = item.price * (item.qty ?? 1);
      if (person) {
        receiptTotals[person] += amount;
      }
    });

    setTotals(receiptTotals);
    setReceiptSplit(receiptTotals); // send back to Home.jsx
  }, [assignments, people, items, setReceiptSplit]);

  const handleAddPerson = () => {
    const trimmed = newPerson.trim();
    if (trimmed && !people.includes(trimmed)) {
      setPeople([...people, trimmed]);
      setNewPerson('');
    }
  };

  const handleRemovePerson = (personToRemove) => {
    setPeople((prev) => prev.filter((p) => p !== personToRemove));
    setAssignments((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        if (updated[key] === personToRemove) {
          delete updated[key];
        }
      });
      return updated;
    });
  };

  const handleAssign = (index, person) => {
    setAssignments((prev) => ({ ...prev, [index]: person }));
  };

  const handleReset = () => setAssignments({});

  return (
    <div className="mt-6 bg-white p-4 rounded shadow max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold mb-4">Assign Items to People</h3>

      {/* Add/Remove People */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Add person"
          value={newPerson}
          onChange={(e) => setNewPerson(e.target.value)}
          className="border px-2 py-1 rounded w-40"
        />
        <button
          onClick={handleAddPerson}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          ➕ Add
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-600 text-white px-3 py-1 rounded"
        >
          🔄 Reset
        </button>
      </div>

      {/* Display people tags */}
      <div className="mb-4">
        {people.map((p) => (
          <span
            key={p}
            className="inline-flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded mr-2"
          >
            {p}
            <button
              onClick={() => handleRemovePerson(p)}
              className="ml-1 text-red-500 hover:text-red-700"
              title="Remove"
            >
              &times;
            </button>
          </span>
        ))}
      </div>

      {/* Item Assignment Table */}
      {items.length > 0 && (
        <div className="space-y-3 mb-6">
          {items.map((item, index) => {
            const label = item.name || `Item ${index + 1}`;
            const price = item.price * (item.qty ?? 1);

            return (
              <div key={index} className="flex items-center gap-4">
                <div className="w-1/3">{label}</div>
                <div className="w-1/4">${price.toFixed(2)}</div>
                <select
                  value={assignments[index] || ''}
                  onChange={(e) => handleAssign(index, e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                >
                  <option value="">-- Assign --</option>
                  {people.map((p, i) => (
                    <option key={i} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      )}

      {/* Total owed per person */}
      {Object.keys(totals).length > 0 && (
        <div className="bg-gray-100 p-4 rounded">
          <h4 className="font-bold mb-2">Total Owed Per Person</h4>
          <ul>
            {Object.entries(totals).map(([person, total]) => (
              <li key={person}>
                {person}: ${total.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
