'use client';

import { Badge } from '@/components/ui/badge';

import { TAG_BG_CLASSES, TAG_TEXT_CLASSES } from '@/lib/utils.ts';
import { getPopularTags } from '@/services/tags';
import type { PopularTag, TagColor } from '@/types/types';
import { Tag } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PopularTags() {
  const [tags, setTags] = useState<PopularTag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTags = async () => {
      const topTags = await getPopularTags(5); // Top 5 tags
      setTags(topTags);
      setLoading(false);
    };

    fetchTags();
  }, []);

  if (loading) return <div>Loading top tags...</div>;

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-background">
      <div className="flex items-center mb-3 text-muted-foreground">
        <Tag className="w-5 h-5 mr-2" />
        <h3 className="text-lg font-semibold">Top Tags</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.length > 0 ? (
          tags.map(t => (
            <Badge
              key={t.id}
              variant="outline"
              className={`
                ${TAG_BG_CLASSES[t.color as TagColor]} 
                ${TAG_TEXT_CLASSES[t.color as TagColor]} 
                outline-none ring-0 focus:outline-none focus:ring-0 
                border-none shadow-none text-sm font-medium px-3 py-1 
              `}
              title={`${t.count} contact${t.count > 1 ? 's' : ''} have this tag`}
            >
              {t.name} ({t.count})
            </Badge>
          ))
        ) : (
          <div className="text-muted-foreground italic">No tags found</div>
        )}
      </div>
    </div>
  );
}
