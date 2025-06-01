import { TableRow } from '@/components/ui/table';
import TagsRowAction from './TagsRowAction';
import type { Tag } from '@/types/types';

type Props = {
  tag: Tag;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddUser: (id: string) => void;
};

export default function TagsTableRow({
  tag,
  onEdit,
  onDelete,
  onAddUser,
}: Props) {
  return (
    <TableRow className="hover:bg-gray-50 transition-colors">
      <td className="px-5 py-3 text-sm font-medium text-gray-800">
        {tag.name}
      </td>
      <td className="px-5 py-3">
        <span
          className="inline-block w-6 h-6 rounded-full border border-gray-300"
          style={{ backgroundColor: tag.color }}
          title={tag.color}
        />
      </td>
      <td className="px-5 py-3 text-sm text-gray-500">
        {new Date(tag.created_at).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </td>
      <td className="px-5 py-3 text-sm text-gray-500">{tag.contact_count}</td>
      <td className="px-5 py-3 text-right">
        <TagsRowAction
          tagId={tag.id}
          tagName={tag.name}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddUser={onAddUser}
        />
      </td>
    </TableRow>
  );
}
