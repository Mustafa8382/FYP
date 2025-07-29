import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return setError('Please enter a new password.');

    try {
      setLoading(true);
      setError('');
      setMessage('');

      const res = await fetch(`/Api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
      } else {
        setMessage('Password has been reset successfully!');
        setTimeout(() => navigate('/signin'), 3000);
      }
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500 overflow-hidden">

      {/* Glowing Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-400 opacity-30 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 opacity-20 rounded-full filter blur-3xl animate-ping" />
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-pink-400 opacity-20 rounded-full filter blur-3xl animate-pulse" />
      </div>

      {/* Form Section */}
      <section className="relative z-10 flex flex-col justify-center items-center py-48">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700 backdrop-blur-md">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Set New Password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
            />
            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold py-3 rounded-lg shadow-lg transition-all disabled:opacity-70"
            >
              {loading ? 'Updating...' : 'Reset Password'}
            </button>
          </form>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          {message && <p className="text-green-500 text-center mt-4">{message}</p>}
        </div>
      </section>

      <Footer />
    </div>
  );
}
