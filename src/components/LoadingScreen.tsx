import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoadingScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for the typing animation to finish before redirect
    const timer = setTimeout(() => {
      navigate('/home');
    }, 6000); // animation duration (2.5s) + small buffer

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <h1 className="typing-text">Rootly</h1>
    </div>
  );
}
