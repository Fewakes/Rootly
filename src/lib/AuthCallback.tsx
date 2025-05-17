import LoadingScreen from '@/components/LoadingScreen';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Get the session after redirection
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error retrieving session:', error.message);
        return;
      }

      // Type check to ensure session is extracted safely
      const session = data.session;

      // If session exists and user is present
      if (session && session.user) {
        navigate('/');
      } else {
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return <LoadingScreen />;
};

export default AuthCallback;
