import { Table, TableBody } from '@/components/ui/table';
import { CompaniesTableHeader } from './CompaniesTableHeader';
import { CompaniesTableRow } from './CompaniesTableRow';

interface Company {
  id: string;
  name: string;
  logo_url?: string;
  created_at: string;
  user_count: number;
}

interface CompaniesTableProps {
  companies: Company[];
  sortBy: 'name' | 'created_at' | 'user_count';
  sortDirection: 'asc' | 'desc';
  onSortChange: (key: 'name' | 'created_at' | 'user_count') => void;
}

export function CompaniesTable({
  companies,
  sortBy,
  sortDirection,
  onSortChange,
}: CompaniesTableProps) {
  return (
    <Table className="w-full border-collapse border border-gray-200 shadow-sm rounded-md overflow-hidden">
      <CompaniesTableHeader
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={onSortChange}
      />
      <TableBody>
        {companies.map(company => (
          <CompaniesTableRow key={company.id} company={company} />
        ))}
      </TableBody>
    </Table>
  );
}
