import { getUserAuthProfile } from '@/services/users';
import { useEffect, useState } from 'react';

type UserAuthProfile = {
  email: string;
  fullName: string;
  avatarUrl: string;
};

export function useUserAuthProfile() {
  const [user, setUser] = useState<UserAuthProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserAuthProfile();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
}
