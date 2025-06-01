import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Company } from '@/types/types';
import { CompaniesTable } from '@/features/companies/CompaniesTable';
import { useAllCompanies } from '@/logic/useAllCompanies';

type SortKey = 'name' | 'created_at' | 'user_count';
type SortDirection = 'asc' | 'desc';

// Extend Company to ensure user_count exists for sorting
type CompanyWithCount = Company & { user_count: number };

export default function CompaniesPage() {
  const { companies, loading, error } = useAllCompanies();

  const handleEdit = (id: string) => {
    console.log('Edit company with id:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete company with id:', id);
  };

  const handleAddUser = (id: string) => {
    console.log('Add user to company with id:', id);
  };

  const [sortBy, setSortBy] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSortChange = (key: SortKey) => {
    if (sortBy === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDirection('asc');
    }
  };

  const sortedCompanies = [...companies].sort((a, b) => {
    const aValue = a[sortBy as keyof CompanyWithCount];
    const bValue = b[sortBy as keyof CompanyWithCount];

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
        <h1 className="text-4xl font-bold">Companies</h1>
        <Button className="bg-primaryBlue text-white hover:bg-primaryBlue/90">
          + Create New
        </Button>
      </div>

      {loading && <p>Loading companies...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <CompaniesTable
          companies={sortedCompanies}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddUser={handleAddUser}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
        />
      )}
    </div>
  );
}
