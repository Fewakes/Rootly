import { useEffect, useState } from 'react';
import { getPopularGroups } from '@/services/groups';
import type { PopularGroup } from '@/types/types';

export function usePopularGroups(limit: number = 5) {
  const [popularGroups, setPopularGroups] = useState<PopularGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const groups = await getPopularGroups(limit);
        setPopularGroups(groups);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch popular groups');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [limit]);

  return { popularGroups, loading, error };
}
