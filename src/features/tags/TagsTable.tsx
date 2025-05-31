import { Table, TableBody } from '@/components/ui/table';
import type { Tag } from '@/types/types';
import TagsTableHeader from './TagsTableHeader';
import TagsTableRow from './TagsTableRow';

type Props = {
  tags: Tag[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddUser: (id: string) => void;
  sortBy: 'name' | 'created_at' | 'user_count';
  sortDirection: 'asc' | 'desc';
  onSortChange: (key: 'name' | 'created_at' | 'user_count') => void;
};

export default function TagsTable({
  tags,
  onEdit,
  onDelete,
  onAddUser,
  sortBy,
  sortDirection,
  onSortChange,
}: Props) {
  return (
    <Table className="w-full border-collapse border border-gray-200 shadow-sm rounded-md overflow-hidden">
      <TagsTableHeader
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={onSortChange}
      />
      <TableBody>
        {tags.map(tag => (
          <TagsTableRow
            key={tag.id}
            tag={tag}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddUser={onAddUser}
          />
        ))}
      </TableBody>
    </Table>
  );
}
