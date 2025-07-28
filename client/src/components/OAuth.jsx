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
      type='button'
      className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
      Continue with Google
    </button>
  );
}
