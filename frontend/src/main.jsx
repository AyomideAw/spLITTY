// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast'; // ✅ NEW: Toast notifications

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster position="top-right" /> {/* ✅ Enables toast messages */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
