import {
  TableHeader,
  TableRow,
  TableHead as TableHeadCell,
} from '@/components/ui/table';
import { LuArrowUp, LuArrowDown, LuArrowUpDown } from 'react-icons/lu';

interface CompaniesTableHeaderProps {
  sortBy: 'name' | 'created_at' | 'user_count';
  sortDirection: 'asc' | 'desc';
  onSortChange: (key: 'name' | 'created_at' | 'user_count') => void;
}

export function CompaniesTableHeader({
  sortBy,
  sortDirection,
  onSortChange,
}: CompaniesTableHeaderProps) {
  const renderSortIcon = (key: typeof sortBy) => {
    if (sortBy !== key)
      return <LuArrowUpDown className="inline text-gray-400" />;
    return sortDirection === 'asc' ? (
      <LuArrowUp className="inline" />
    ) : (
      <LuArrowDown className="inline" />
    );
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHeadCell>Logo</TableHeadCell>

        <TableHeadCell
          className="cursor-pointer select-none"
          onClick={() => onSortChange('name')}
        >
          <div className="flex items-center gap-2">
            Name {renderSortIcon('name')}
          </div>
        </TableHeadCell>

        <TableHeadCell
          className="cursor-pointer select-none"
          onClick={() => onSortChange('created_at')}
        >
          <div className="flex items-center gap-2">
            Created {renderSortIcon('created_at')}
          </div>
        </TableHeadCell>

        <TableHeadCell
          className="cursor-pointer select-none"
          onClick={() => onSortChange('user_count')}
        >
          <div className="flex items-center gap-2">
            Users {renderSortIcon('user_count')}
          </div>
        </TableHeadCell>

        <TableHeadCell className="text-right">Actions</TableHeadCell>
      </TableRow>
    </TableHeader>
  );
}
