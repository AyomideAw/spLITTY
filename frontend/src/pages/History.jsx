import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';

export default function History() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <Navbar />
      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4 text-indigo-700">Your Past Splits</h2>
          <Dashboard />
        </div>
      </div>
    </div>
  );
}