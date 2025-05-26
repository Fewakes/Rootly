'use client';

import { Badge } from '@/components/ui/badge';
import { getPopularGroups } from '@/services/groups';

import type { PopularGroup } from '@/types/types';
import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PopularGroups() {
  const [groups, setGroups] = useState<PopularGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGroups = async () => {
      const topGroups = await getPopularGroups(5); // Top 5 groups
      setGroups(topGroups);
      setLoading(false);
    };

    fetchGroups();
  }, []);

  if (loading) return <div>Loading top groups...</div>;

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-background">
      <div className="flex items-center mb-3 text-muted-foreground">
        <Users className="w-5 h-5 mr-2" />
        <h3 className="text-lg font-semibold">Top Groups</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {groups.length > 0 ? (
          groups.map(group => (
            <Badge
              key={group.id}
              variant="outline"
              className={`
               
                outline-none ring-0 focus:outline-none focus:ring-0 
                border-none shadow-none inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground"
              `}
              title={`${group.count} contact${group.count > 1 ? 's' : ''} in this group`}
            >
              {group.name} ({group.count})
            </Badge>
          ))
        ) : (
          <div className="text-muted-foreground italic">No groups found</div>
        )}
      </div>
    </div>
  );
}
