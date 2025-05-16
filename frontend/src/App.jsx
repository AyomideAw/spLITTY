// import Home from './pages/Home';

// function App() {
//   return <Home />;
// }

// export default App;

// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import History from './pages/History';
import SplitDetail from './components/SplitDetail'; // or adjust if in components
import SettlePage from './pages/SettlePage';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <LoginPage />} />
        <Route path="/history" element={user ? <History /> : <Navigate to="/" />} />
        <Route path="/split/:id" element={user ? <SplitDetail /> : <Navigate to="/" />} />
        <Route path="/settle" element={<SettlePage />} />
      </Routes>
    </Router>
  );
}

export default App;
