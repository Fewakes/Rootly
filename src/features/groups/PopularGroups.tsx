import type { Contact } from '@/types/types';
import { Users } from 'lucide-react';

interface PopularGroupsProps {
  contacts: Contact[];
  groups: number;
}

export default function PopularGroups({
  contacts,
  groups,
}: PopularGroupsProps) {
  const groupCounts = contacts.reduce<Record<string, number>>(
    (acc, contact) => {
      contact.group.forEach(group => {
        acc[group] = (acc[group] || 0) + 1;
      });
      return acc;
    },
    {},
  );

  const sortedGroups = Object.entries(groupCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, groups);

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-background">
      <div className="flex items-center mb-3 text-muted-foreground">
        <Users className="w-5 h-5 mr-2" />
        <h3 className="text-lg font-semibold">Top Groups</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {sortedGroups.map(([group, count]) => (
          <span
            key={group}
            className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground"
            title={`${count} member${count > 1 ? 's' : ''} in this group`}
          >
            {group}
            <span className="inline-block rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
              {count}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
