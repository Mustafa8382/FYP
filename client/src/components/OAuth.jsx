import { useEffect } from 'react';
import { supabase } from '../supabaseClient.js'; // ✅ Your Supabase client
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isOAuthRedirect = location.pathname === '/oauth/callback';

  // Handle Google OAuth callback
  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        console.log('OAuth error or no user:', error?.message);
        return;
      }

      const user = data.user;

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
    return <p className="text-center mt-10 text-lg font-medium">Signing in with Google...</p>;
  }

  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
    >
      Continue with Google
    </button>
  );
}
