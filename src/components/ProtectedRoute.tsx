import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  //if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;

  return <>{children}</>;
}
