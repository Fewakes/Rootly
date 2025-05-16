import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
        return;
      }

      // Redirect to login page after logout
      navigate('/login');
    } catch (err) {
      console.error('Unexpected logout error:', err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
}
