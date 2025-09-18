import { getUserAuthProfile } from '@/services/users';
import { useEffect, useState } from 'react';

type UserAuthProfile = {
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
};

export function useUserAuthProfile() {
  const [user, setUser] = useState<UserAuthProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserAuthProfile();
        setUser({
          email: data.email ?? null,
          fullName: data.fullName ?? null,
          avatarUrl: data.avatarUrl ?? null,
        });
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
