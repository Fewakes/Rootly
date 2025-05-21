// src/features/auth/ProtectedLayout.tsx
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/layouts/RootLayout';
import { Navigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';

export default function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;

  return <Layout />;
}
