import { useEffect } from 'react';
import { supabase } from '../supabaseClient.js';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isOAuthRedirect = location.pathname === '/oauth/callback';

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();

      if (error || !sessionData?.session?.user) {
        console.log('OAuth error or no user:', error?.message);
        return;
      }

      const user = sessionData.session.user;

      try {
        const res = await fetch('/Api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: user.user_metadata.full_name,
            email: user.email,
            photo: user.user_metadata.avatar_url,
          }),
        });

        const userData = await res.json();
        dispatch(signInSuccess(userData));
        navigate('/');
      } catch (err) {
        console.log('Backend error after OAuth:', err);
      }
    };

    if (isOAuthRedirect) {
      handleOAuthRedirect();
    }
  }, [isOAuthRedirect, dispatch, navigate]);

  const handleGoogleClick = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/oauth/callback`,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.log('Could not sign in with Google:', error.message);
    }
  };

  if (isOAuthRedirect) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900 relative overflow-hidden animate-[fadeIn_0.5s_ease-in-out]">

        {/* Background blur circles */}
        <div className="absolute w-72 h-72 bg-blue-400 opacity-30 rounded-full blur-3xl top-10 left-10"></div>
        <div className="absolute w-72 h-72 bg-purple-400 opacity-30 rounded-full blur-3xl bottom-10 right-10"></div>

        {/* Content container */}
        <div className="z-10 flex flex-col items-center text-center space-y-4">
          {/* AM Estate Logo */}
          <img
            src={logo} // <-- Replace with your logo path
            alt="AM Estate Logo"
            className="w-40 h-40 object-contain mb-2"
          />

          {/* Spinner */}
          <div
            role="status"
            aria-label="Redirecting after OAuth login..."
            className="relative w-20 h-20"
          >
            <div className="absolute inset-0 border-[6px] border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-4 bg-blue-500 rounded-full animate-ping opacity-30"></div>
            <span className="sr-only">Redirecting after OAuth login...</span>
          </div>

          {/* Text */}
          <p className="text-gray-700 dark:text-gray-300 text-lg font-semibold">
            Redirecting, please wait...
          </p>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="w-full sm:max-w-xs flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base font-medium 
      py-3 px-4 rounded-md uppercase shadow transition duration-200 hover:scale-[1.02] active:scale-95">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="currentColor"
        viewBox="0 0 488 512"
        className="text-white">
        <path d="M488 261.8c0-17.8-1.6-35-4.6-51.7H249v97.8h135.6c-5.9 32.1-23.5 59.2-50.2 77.4l81.2 63.2c47.4-43.8 74.4-108.4 74.4-186.7zM249 492c67.2 0 123.8-22.3 165-60.6l-81.2-63.2c-22.6 15.2-51.5 24.1-83.8 24.1-64.6 0-119.3-43.6-138.9-102.1H28.1v64.2C69.3 438.7 152.5 492 249 492zM110.1 289.2c-5.2-15.2-8.2-31.5-8.2-48.2s3-33 8.2-48.2V128H28.1C10 162.2 0 202.2 0 243s10 80.8 28.1 115l82-68.8zM249 97.5c36.5 0 69.2 12.6 95.1 37.2l71.3-71.3C386.5 24.8 331.9 0 249 0 152.5 0 69.3 53.3 28.1 128l82 68.8C129.7 141.1 184.4 97.5 249 97.5z" />
      </svg>
      Sign In with Google
    </button>
  );
}
