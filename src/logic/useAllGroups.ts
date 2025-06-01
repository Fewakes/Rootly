import { useEffect, useState } from 'react';
import { getAllGroups } from '@/services/groups';
import type { Group } from '@/types/types';

export function useAllGroups() {
  const [groups, setGroups] = useState<(Group & { user_count: number })[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);

      const result = await getAllGroups();

      if (result.length === 0) {
        setError('No groups found or failed to fetch.');
      } else {
        setGroups(result);
        setError(null);
      }

      setLoading(false);
    };

    fetchGroups();
  }, []);

  return { groups, loading, error };
}
