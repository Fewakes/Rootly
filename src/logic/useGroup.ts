import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { getGroupById } from '@/services/groups';
import type { GroupWithRank } from '@/types/types';

export function useGroup(groupId: string | undefined) {
  const [group, setGroup] = useState<GroupWithRank | null>(null);
  const [loading, setLoading] = useState(true);

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

  return { group, loading, refetch: fetchGroup };
}
