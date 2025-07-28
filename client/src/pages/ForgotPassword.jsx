import { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError('Please enter your email.');

    try {
      setLoading(true);
      setError('');
      setMessage('');

      const res = await fetch('/Api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
      } else {
        setMessage('Password reset link sent! Check your email.');
      }
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-all duration-500 overflow-hidden">

      {/* Form Section */}
      <section className="relative z-10 flex flex-col justify-center items-center py-44">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700 backdrop-blur-md">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Reset Password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg transition-all disabled:opacity-70"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          {message && <p className="text-green-500 text-center mt-4">{message}</p>}

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
            Remember your password?{' '}
            <Link to="/signin" className="text-blue-600 dark:text-blue-400 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
