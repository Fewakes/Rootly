// useSortedContacts.ts
import type { Contact } from '@/types/types';
import { useMemo, useState } from 'react';

type SortKey = 'name' | 'companyName';

export const useSortedContacts = (contacts: Contact[]) => {
  const [sortBy, setSortBy] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSortChange = (key: SortKey) => {
    if (sortBy === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDirection('asc');
    }
  };

  const sortedContacts = useMemo(() => {
    return [...contacts].sort((a, b) => {
      const aValue =
        sortBy === 'name' ? a.name.toLowerCase() : a.company.name.toLowerCase();
      const bValue =
        sortBy === 'name' ? b.name.toLowerCase() : b.company.name.toLowerCase();

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [contacts, sortBy, sortDirection]);

  return { sortedContacts, sortBy, sortDirection, handleSortChange };
};
