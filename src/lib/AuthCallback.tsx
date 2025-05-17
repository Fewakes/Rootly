import LoadingScreen from '@/components/LoadingScreen';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error retrieving session:', error.message);
        return navigate('/login');
      }

      const session = data.session;

      if (session && session.user) {
        setTimeout(() => {
          navigate('/');
        }, 1000); // match your revealText animation duration
      } else {
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return <LoadingScreen />;
};

export default AuthCallback;
