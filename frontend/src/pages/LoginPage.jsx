// LoginPage.jsx
import AuthButton from '../components/AuthButton';

export default function LoginPage() {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-100 to-indigo-300">
      <div className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-md w-full">
        <h1 className="text-4xl font-bold mb-6 text-indigo-700">Welcome to spLITTY</h1>
        <p className="text-gray-600 mb-6">Your AI-powered crypto bill splitter</p>
        <AuthButton />
      </div>
    </div>
  );
}