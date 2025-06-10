import { useEffect, useState } from 'react';
import { getPopularTags as fetchTagsFromService } from '@/services/tags';
import type { PopularTag } from '@/types/types';

export function usePopularTags(limit: number = 5) {
  const [popularTags, setPopularTags] = useState<PopularTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const tags = await fetchTagsFromService(limit);
        setPopularTags(tags);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch popular tags');
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [limit]);

  return { popularTags, loading, error };
}
