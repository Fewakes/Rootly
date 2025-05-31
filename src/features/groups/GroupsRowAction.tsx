import React from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';
import { LuPen, LuTrash2, LuUserPlus } from 'react-icons/lu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Props = {
  id: string;
  name: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddUser: (id: string) => void;
};

export function GroupsRowAction({
  id,
  name,
  onEdit,
  onDelete,
  onAddUser,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="p-2 rounded-md bg-white border border-gray-300 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`Open actions for ${name}`}
        >
          <FiMoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44 z-[999]">
        <DropdownMenuItem
          onSelect={() => onAddUser(id)}
          className="flex items-center gap-2"
        >
          <LuUserPlus className="w-4 h-4" />
          Add User
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => onEdit(id)}
          className="flex items-center gap-2"
        >
          <LuPen className="w-4 h-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => onDelete(id)}
          className="flex items-center gap-2 text-red-600 focus:bg-red-50"
        >
          <LuTrash2 className="w-4 h-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
