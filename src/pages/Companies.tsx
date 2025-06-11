import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Company } from '@/types/types';
import { CompaniesTable } from '@/features/companies/CompaniesTable';
import { useAllCompanies } from '@/logic/useAllCompanies';
import { useDialog } from '@/contexts/DialogContext';
import { UserPlus } from 'lucide-react';

type SortKey = 'name' | 'created_at' | 'user_count';
type SortDirection = 'asc' | 'desc';

type CompanyWithCount = Company & { user_count: number };

export default function CompaniesPage() {
  const { openDialog } = useDialog();
  const { companies, loading, error } = useAllCompanies();

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

        <Button
          className="bg-primaryBlue text-white px-6 py-3 text-base font-semibold transition duration-150 transform hover:scale-[1.02] active:scale-[0.98] shadow hover:shadow-md hover:bg-primaryBlue"
          onClick={() => openDialog('addCompany')}
        >
          <UserPlus className="w-5 h-5 mr-2" /> Add New Company
        </Button>
      </div>

      {loading && <p>Loading companies...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <CompaniesTable
          companies={sortedCompanies}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
        />
      )}
    </div>
  );
}
