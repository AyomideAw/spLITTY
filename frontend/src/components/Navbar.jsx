import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-0x68b8d1 text-white shadow">
      <h1
        onClick={() => navigate('/')}
        className="text-lg font-bold cursor-pointer"
      >
        spLITTY
      </h1>
      <div className="flex gap-4 items-center">
        <button onClick={() => navigate('/')} className="text-sm font-medium transition-transform transform hover:-translate-y-1 hover:font-bold">
          🏠 Home
        </button>
        <button onClick={() => navigate('/history')} className="text-sm font-medium transition-transform transform hover:-translate-y-1 hover:font-bold">
          📁 History
        </button>
        <button onClick={() => signOut(auth)} className="bg-red-500 px-3 py-1 rounded text-sm text-white font-medium transition-transform transform hover:-translate-y-1 hover:font-bold">
          Sign Out
        </button>
        <Link to="/settle" className="hover:text-indigo-700 transition">Settle</Link> {/* ✅ New */}
      </div>
    </nav>
  );
}
