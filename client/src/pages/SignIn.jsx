import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import Footer from '../components/Footer';
import OAuth from '../components/OAuth';
import { Eye, EyeOff } from 'lucide-react';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      dispatch(signInFailure('Please fill in all fields.'));

      // Clear the error after 5 seconds
      setTimeout(() => {
        dispatch(signInFailure('')); // Clear the error
      }, 5000);
      return;
    }

    try {
      dispatch(signInStart());
      const res = await fetch('/Api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || data.success === false || !data.user) {
        dispatch(signInFailure(data.message || 'Signin failed'));
        return;
      }

      dispatch(signInSuccess(data.user)); // ✅ updated to match backend
      navigate('/profile'); // ✅ redirect to profile
    } catch (error) {
      dispatch(signInFailure('Something went wrong. Please try again.'));
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-all duration-500">
      <div className="flex flex-col justify-center items-center py-24 px-6 sm:px-8">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-6">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              placeholder="Email"
              id="email"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                id="password"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all disabled:opacity-70"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="my-4 text-center text-gray-500 dark:text-gray-400">or</div>

          <div className="flex justify-center">
            <OAuth />
          </div>

          <div className="mt-6 text-sm text-center text-gray-600 dark:text-gray-300">
            Are You New To AM Estate?{' '}
            <Link
              to="/signup"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Sign up
            </Link>
          </div>

          {error && (
            <p className="mt-4 text-center text-red-500 text-sm font-medium">
              {error}
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
