import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useSignOut() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const signOut = async (
    onSuccess?: () => void,
    onError?: (error: Error) => void,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        setError(signOutError);
        onError?.(signOutError);
        console.error('Sign out error:', signOutError.message);
      } else {
        onSuccess?.();
        console.log('User signed out successfully.');
      }
    } catch (err) {
      const typedError = err instanceof Error ? err : new Error(String(err));
      setError(typedError);
      onError?.(typedError);
      console.error('Unexpected sign out error:', typedError.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    signOut,
    loading,
    error,
  };
}
