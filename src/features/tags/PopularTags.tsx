import type { Contact } from '@/types/types';
import { Tag } from 'lucide-react';

interface PopularTagsProps {
  contacts: Contact[];
  tags: number;
}

export default function PopularTags({ contacts, tags }: PopularTagsProps) {
  const tagCounts = contacts.reduce<Record<string, number>>((acc, contact) => {
    contact.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});

  const sortedTags = Object.entries(tagCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, tags);

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-background">
      <div className="flex items-center mb-3 text-muted-foreground">
        <Tag className="w-5 h-5 mr-2" />
        <h3 className="text-lg font-semibold">Top Tags</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {sortedTags.map(([tag, count]) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground"
            title={`${count} member${count > 1 ? 's' : ''} have this tag`}
          >
            {tag}
            <span className="inline-block rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
              {count}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
