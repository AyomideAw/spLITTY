import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-indigo-700 text-white shadow">
      <h1
        onClick={() => navigate('/')}
        className="text-lg font-bold cursor-pointer"
      >
        spLITTY
      </h1>
      <div className="flex gap-4 items-center">
        <button onClick={() => navigate('/')} className="hover:underline text-sm">
          🏠 Home
        </button>
        <button onClick={() => navigate('/history')} className="hover:underline text-sm">
          📁 History
        </button>
        <button onClick={() => signOut(auth)} className="bg-red-500 px-3 py-1 rounded text-sm">
          Sign Out
        </button>
      </div>
    </nav>
  );
}
