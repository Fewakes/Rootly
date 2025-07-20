import { getCurrentUserId } from '@/services/users';
import { useState, useEffect } from 'react';

export function useUserId() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserId = async () => {
      setLoading(true);
      const id = await getCurrentUserId();
      setUserId(id);
      setLoading(false);
    };

    fetchUserId();
  }, []); //

  return { userId, loading };
}
