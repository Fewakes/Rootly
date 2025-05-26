import { getAllTags } from '@/services/tags';
import { useEffect, useState } from 'react';

export default function TagsCount() {
  const [tagsCount, setTagsCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchTags() {
      const tags = await getAllTags();
      setTagsCount(tags.length);
    }

    fetchTags();
  }, []);

  if (tagsCount === null) {
    return <div>Loading...</div>;
  }

  return <div>{tagsCount}</div>;
}
