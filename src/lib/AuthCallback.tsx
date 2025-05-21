import LoadingScreen from '@/features/auth/LoadingScreen';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session?.user) {
        return navigate('/login');
      }

      //  delay to let LoadingScreen animation play
      setTimeout(() => {
        navigate('/');
      }, 1200); // 1.2 seconds
    };

    checkSession();
  }, [navigate]);

  return <LoadingScreen />;
};

export default AuthCallback;
