'use client';

import { useEffect, useState } from 'react';
import { getTagsCount } from '@/logic/getTagsCount';

export default function TagsCount() {
  const [tagsCount, setTagsCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCount() {
      const count = await getTagsCount();
      setTagsCount(count);
    }

    fetchCount();
  }, []);

  if (tagsCount === null) {
    return <div>Loading...</div>;
  }

  return <div>{tagsCount}</div>;
}
