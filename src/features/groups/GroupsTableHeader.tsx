import React from 'react';
import {
  TableHead as TableHeadCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LuArrowUp, LuArrowDown } from 'react-icons/lu';

type Props = {
  sortBy: 'name' | 'created_at' | 'user_count';
  sortDirection: 'asc' | 'desc';
  onSortChange: (key: 'name' | 'created_at' | 'user_count') => void;
};

export function GroupsTableHeader({
  sortBy,
  sortDirection,
  onSortChange,
}: Props) {
  const renderSortIcon = (key: 'name' | 'created_at' | 'user_count') => {
    if (sortBy !== key) return <LuArrowUp className="inline opacity-40" />;
    return sortDirection === 'asc' ? (
      <LuArrowUp className="inline" />
    ) : (
      <LuArrowDown className="inline" />
    );
  };

  return (
    <TableHeader className="bg-gray-50">
      <TableRow>
        <TableHeadCell
          className="cursor-pointer select-none px-5 py-3 text-left text-gray-700 font-semibold text-sm"
          onClick={() => onSortChange('name')}
        >
          <div className="flex items-center gap-1">
            Name {renderSortIcon('name')}
          </div>
        </TableHeadCell>
        <TableHeadCell
          className="cursor-pointer select-none px-5 py-3 text-left text-gray-700 font-semibold text-sm"
          onClick={() => onSortChange('created_at')}
        >
          <div className="flex items-center gap-1">
            Created {renderSortIcon('created_at')}
          </div>
        </TableHeadCell>
        <TableHeadCell
          className="cursor-pointer select-none px-5 py-3 text-left text-gray-700 font-semibold text-sm"
          onClick={() => onSortChange('user_count')}
        >
          <div className="flex items-center gap-1">
            Users {renderSortIcon('user_count')}
          </div>
        </TableHeadCell>
        <TableHeadCell className="px-5 py-3 text-right text-gray-700 font-semibold text-sm">
          Actions
        </TableHeadCell>
      </TableRow>
    </TableHeader>
  );
}
