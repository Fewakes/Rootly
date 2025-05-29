import { useEffect, useState } from 'react';
import { getAllTags } from '@/services/tags';
import type { Tag } from '@/services/tags';

export function useAllTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      const result = await getAllTags();

      if (result.length === 0) {
        setError('No tags found or failed to fetch.');
      } else {
        setTags(result);
      }

      setLoading(false);
    };

    fetchTags();
  }, []);

  return { tags, loading, error };
}
