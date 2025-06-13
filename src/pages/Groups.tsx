'use client';

import { Button } from '@/components/ui/button';
import { useDialog } from '@/contexts/DialogContext';
import GroupsTable from '@/features/groups/GroupsTable';
import { supabase } from '@/lib/supabaseClient';
import { useAllGroups } from '@/logic/useAllGroups';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';

export default function Groups() {
  const { openDialog } = useDialog();

  const { groups, loading, error } = useAllGroups();

  const [sortBy, setSortBy] = useState<'name' | 'created_at' | 'user_count'>(
    'name',
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSortChange = (key: typeof sortBy) => {
    if (sortBy === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDirection('asc');
    }
  };

  const sortedGroups = [...groups].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  return (
    <div className="w-full p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Groups</h1>
        <Button
          className="bg-primaryBlue text-white px-6 py-3 text-base font-semibold transition duration-150 transform hover:scale-[1.02] active:scale-[0.98] shadow hover:shadow-md hover:bg-primaryBlue"
          onClick={() => openDialog('addGroup')}
        >
          <UserPlus className="w-5 h-5 mr-2" /> Add New Group
        </Button>
      </div>

      <GroupsTable
        groups={sortedGroups}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />
    </div>
  );
}

/**
 * Fetches all groups and the count of contacts associated with each.
 */
export const getAllGroupsWithContactCounts = async () => {
  const { data, error } = await supabase
    .from('groups')
    .select('id, name, contact_groups!left(count)'); // Use !left join to include groups with 0 contacts

  if (error) {
    console.error('Error fetching groups with counts:', error);
    throw error;
  }

  // Transform the data into a standard shape for charts
  return data.map(group => ({
    id: group.id,
    name: group.name,
    value: group.contact_groups[0]?.count || 0,
  }));
  // ✨ REMOVED: The .filter() step to ensure all groups are included
};
