'use client';

import { useEffect, useState } from 'react';
import { Tag } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { TAG_BG_CLASSES, TAG_TEXT_CLASSES } from '@/lib/utils';
import { getPopularTags } from '@/services/tags'; // ✅ Use service directly
import type { PopularTag, TagColor } from '@/types/types';

export default function PopularTags() {
  const [tags, setTags] = useState<PopularTag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const topTags = await getPopularTags(5);
        setTags(topTags);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      } finally {
        setLoading(false);
      }
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
          tags.map(tag => (
            <Badge
              key={tag.id}
              variant="outline"
              className={`
                ${TAG_BG_CLASSES[tag.color as TagColor]} 
                ${TAG_TEXT_CLASSES[tag.color as TagColor]} 
                outline-none ring-0 focus:outline-none focus:ring-0 
                border-none shadow-none text-sm font-medium px-3 py-1 
              `}
              title={`${tag.count} contact${tag.count > 1 ? 's' : ''} have this tag`}
            >
              {tag.name} ({tag.count})
            </Badge>
          ))
        ) : (
          <div className="text-muted-foreground italic">No tags found</div>
        )}
      </div>
    </div>
  );
}
