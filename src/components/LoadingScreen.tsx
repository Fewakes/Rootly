import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoadingScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 1200);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="loading-screen-wrapper">
      <div className="loading-container">
        <h1 className="loading-text">Rootly</h1>
      </div>
    </div>
  );
}
