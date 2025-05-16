// export default function TextSplitResult({ split }) {
//   console.log('[TextSplitResult] Received split:', split); // ✅ Debug log
//   console.log('[TextSplitResult] split prop:', split);


//   if (!split || !split.people || typeof split.people !== 'object' || Object.keys(split.people).length === 0) {
//     return (
//       <div className="mt-6 bg-white p-4 rounded shadow text-red-600">
//         <p>❌ No valid split data received.</p>
//       </div>
//     );
//   }

  // return (
  //   <div className="mt-6 bg-white p-4 rounded shadow">
  //     <h3 className="text-xl font-bold mb-2">Total Owed Per Person</h3>
  //     <ul className="list-disc pl-5">
  //       {Object.entries(split.people).map(([person, total]) => (
  //         <li key={person}>
  //           {person}: ${Number(total).toFixed(2)}
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );
// }

import React from 'react';

export default function TextSplitResult({ split }) {
  // Debug: log the received split prop
  console.log('[TextSplitResult] Received:', split);

  // Gracefully handle invalid or empty input
  if (!split || typeof split !== 'object' || Object.keys(split).length === 0) {
    return null; // Hide the message if no split yet
  }

  return (
    <div className="mt-6 bg-white p-4 rounded shadow max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold mb-4">📝 Text-to-Split Result</h3>

      <ul className="list-disc pl-5 space-y-1">
        {Object.entries(split).map(([person, amount]) => (
          <li key={person}>
            <strong>{person}</strong>: ${amount.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}
