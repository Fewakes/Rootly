import { getTagByIdWithRank } from '@/services/tags';
import type { TagWithRank } from '@/types/types';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export default function useTag(tagId: string | undefined) {
  const [tag, setTag] = useState<TagWithRank | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTag = useCallback(async () => {
    if (!tagId) {
      setLoading(false);
      setTag(null);
      return;
    }
    setLoading(true);
    try {
      const data = await getTagByIdWithRank(tagId);
      setTag(data);
    } catch (error) {
      toast.error('Failed to load tag details.');
      setTag(null);
    } finally {
      setLoading(false);
    }
  }, [tagId]);

  useEffect(() => {
    fetchTag();
  }, [fetchTag]);
  return { tag, loading, refetch: fetchTag };
}
