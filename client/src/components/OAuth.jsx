// OAuth.jsx
import React, { useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInSuccess, signInFailure } from '../redux/user/userSlice';

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && session.user) {
          const user = session.user;
          dispatch(signInSuccess(user)); // ✅ update Redux store
          navigate('/');
        } else {
          dispatch(signInFailure('Google sign-in failed'));
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [dispatch, navigate]);

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/profile', // ✅ your frontend redirect
      },
    });

    if (error) {
      console.error('Google Sign-In Error:', error.message);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
    >
      Sign in with Google
    </button>
  );
};

export default OAuth;
