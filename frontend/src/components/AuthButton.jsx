// frontend/src/components/AuthButton.jsx
import { auth, provider } from '../../firebase'; // ✅ FIXED
import { signInWithPopup, signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

export default function AuthButton() {
  const { user } = useAuth();

  return (
    <div className="text-center my-4">
      {!user ? (
        <button onClick={() => signInWithPopup(auth, provider)} className="bg-indigo-600 text-white px-4 py-2 rounded">
          Sign in with Google
        </button>
      ) : (
        <div>
          <p className="mb-2">Signed in as <strong>{user.displayName}</strong></p>
          <button onClick={() => signOut(auth)} className="bg-red-500 text-white px-4 py-2 rounded">
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
