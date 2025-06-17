// src/logic/useGroup.ts (or wherever your useGroup hook is)

import { useState, useEffect, useCallback } from 'react'; // 1. Import useCallback
import { toast } from 'sonner';
import { getGroupById } from '@/services/groups';
import type { Group } from '@/types/types';

export function useGroup(groupId: string | undefined) {
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  // 2. Wrap your data fetching logic in a `useCallback`
  const fetchGroup = useCallback(async () => {
    if (!groupId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getGroupById(groupId);
      setGroup(data);
    } catch (error) {
      toast.error('Failed to load group details.');
      setGroup(null);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  // 3. Return the `fetchGroup` function as `refetch` instead of returning `setGroup`
  return { group, loading, refetch: fetchGroup };
}
