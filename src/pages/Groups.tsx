'use client';

import { Button } from '@/components/ui/button';
import { useDialog } from '@/contexts/DialogContext';
import GroupsTable from '@/features/groups/GroupsTable';
import { useAllGroups } from '@/logic/useAllGroups';
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
          className="bg-primaryBlue text-white hover:bg-primaryBlue/90"
          onClick={() => openDialog('addGroup')}
        >
          + Create New
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
