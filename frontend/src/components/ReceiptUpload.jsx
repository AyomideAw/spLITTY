// import { useState } from 'react';

// export default function ReceiptUpload({ setReceiptResult }) {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleUpload = async () => {
//     if (!file) return;
//     setLoading(true);

//     const formData = new FormData();
//     formData.append('receipt', file);

//     try {
//       const res = await fetch('http://localhost:8978/api/ocr/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await res.json();
//       console.log('[ReceiptUpload] Raw Gemini response:', data);

//       if (data.parsed && data.parsed.items) {
//         // ✅ Flatten the items into the expected format
//         const flat = {};
//         data.parsed.items.forEach((item) => {
//           flat[item.name] = { price: item.price, qty: item.qty };
//         });

//         setReceiptResult(flat);
//       } else {
//         console.warn('Unexpected receipt response format:', data);
//       }
//     } catch (err) {
//       console.error('Receipt Upload Error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white p-4 rounded shadow max-w-2xl mx-auto">
//       <h2 className="font-semibold text-lg mb-2">Upload Receipt</h2>
//       <input
//         type="file"
//         accept="image/*"
//         onChange={(e) => setFile(e.target.files[0])}
//         className="mb-2"
//       />
//       <button
//         onClick={handleUpload}
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         {loading ? 'Processing...' : 'Upload & Parse'}
//       </button>
//     </div>
//   );
// }


import { useState } from 'react';

export default function ReceiptUpload({ setReceiptItems }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('receipt', file);

    try {
      const res = await fetch('http://localhost:8978/api/ocr/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      console.log('[ReceiptUpload] Raw Gemini response:', data);

      if (data.parsed && data.parsed.items) {
        // ✅ Pass raw receipt items to the next step
        setReceiptItems(data.parsed.items);
      } else {
        console.warn('Unexpected receipt response format:', data);
      }
    } catch (err) {
      console.error('Receipt Upload Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-2xl mx-auto">
      <h2 className="font-semibold text-lg mb-2">Upload Receipt</h2>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Processing...' : 'Upload & Parse'}
      </button>
    </div>
  );
}
