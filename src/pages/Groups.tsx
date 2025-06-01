'use client';

import { Button } from '@/components/ui/button';
import { useDialog } from '@/contexts/DialogContext';
import GroupsTable from '@/features/groups/GroupsTable';
import { useAllGroups } from '@/logic/useAllGroups';
import { useState } from 'react';

export default function Groups() {
  const { openDialog } = useDialog();

  const { groups, loading, error } = useAllGroups();

  // const groups = [
  //   {
  //     id: '1',
  //     name: 'Sales Team',
  //     created_at: '2023-03-15T09:00:00Z',
  //     user_count: 5,
  //   },
  //   {
  //     id: '2',
  //     name: 'Engineering',
  //     created_at: '2024-01-22T12:30:00Z',
  //     user_count: 12,
  //   },
  //   {
  //     id: '3',
  //     name: 'Designers',
  //     created_at: '2022-08-10T14:15:00Z',
  //     user_count: 4,
  //   },
  //   {
  //     id: '4',
  //     name: 'Product',
  //     created_at: '2023-11-05T08:45:00Z',
  //     user_count: 7,
  //   },
  // ];

  const handleEdit = (id: string) => {
    console.log('Edit group with id:', id);
    // open your edit dialog/modal here
  };

  const handleDelete = (id: string) => {
    console.log('Delete group with id:', id);
    // trigger delete logic/modal
  };

  const handleAddUser = (id: string) => {
    console.log('Add user to group with id:', id);
    // open add user dialog/modal
  };

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
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddUser={handleAddUser}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />
    </div>
  );
}
