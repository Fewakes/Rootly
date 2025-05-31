import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { FiMoreHorizontal } from 'react-icons/fi';
import { LuUserPlus, LuPen, LuTrash2 } from 'react-icons/lu';

type Props = {
  tagId: string;
  tagName: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddUser: (id: string) => void;
};

export default function TagsRowAction({
  tagId,
  tagName,
  onEdit,
  onDelete,
  onAddUser,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="p-2 rounded-md bg-white border border-gray-300 shadow-sm hover:bg-gray-100"
          aria-label={`Open actions for ${tagName}`}
        >
          <FiMoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 z-[999]">
        <DropdownMenuItem
          onSelect={() => onAddUser(tagId)}
          className="flex items-center gap-2"
        >
          <LuUserPlus className="w-4 h-4" /> Add User
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => onEdit(tagId)}
          className="flex items-center gap-2"
        >
          <LuPen className="w-4 h-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => onDelete(tagId)}
          className="flex items-center gap-2 text-red-600 focus:bg-red-50"
        >
          <LuTrash2 className="w-4 h-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
