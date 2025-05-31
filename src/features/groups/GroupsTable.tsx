import React from 'react';
import {
  Table,
  TableBody,
  TableHead as TableHeadCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  LuPen,
  LuTrash2,
  LuUserPlus,
  LuArrowUp,
  LuArrowDown,
} from 'react-icons/lu';
import { FiMoreHorizontal } from 'react-icons/fi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Group = {
  id: string;
  name: string;
  created_at: string;
  user_count: number;
};

type Props = {
  groups: Group[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddUser: (id: string) => void;
  sortBy: 'name' | 'created_at' | 'user_count';
  sortDirection: 'asc' | 'desc';
  onSortChange: (key: 'name' | 'created_at' | 'user_count') => void;
};

export default function GroupsTable({
  groups,
  onEdit,
  onDelete,
  onAddUser,
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
    <Table className="w-full border-collapse border border-gray-200 shadow-sm rounded-md overflow-hidden">
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

      <TableBody>
        {groups.map(group => (
          <TableRow
            key={group.id}
            className="hover:bg-gray-50 transition-colors"
          >
            <td className="px-5 py-3 text-sm font-medium text-gray-800">
              {group.name}
            </td>
            <td className="px-5 py-3 text-sm text-gray-500">
              {new Date(group.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </td>
            <td className="px-5 py-3 text-sm text-gray-500">
              {group.user_count}
            </td>
            <td className="px-5 py-3 text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-2 rounded-md bg-white border border-gray-300 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`Open actions for ${group.name}`}
                  >
                    <FiMoreHorizontal className="w-5 h-5 text-gray-600" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-44 z-[999]">
                  <DropdownMenuItem
                    onSelect={() => onAddUser(group.id)}
                    className="flex items-center gap-2"
                  >
                    <LuUserPlus className="w-4 h-4" />
                    Add User
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => onEdit(group.id)}
                    className="flex items-center gap-2"
                  >
                    <LuPen className="w-4 h-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => onDelete(group.id)}
                    className="flex items-center gap-2 text-red-600 focus:bg-red-50"
                  >
                    <LuTrash2 className="w-4 h-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
