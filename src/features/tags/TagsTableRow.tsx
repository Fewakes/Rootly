import { TableRow } from '@/components/ui/table';
import type { Tag } from '@/types/types';
import RowActionsMenu from '@/components/RowActionMenu';
import { useSafeAssignContactDialog } from '@/logic/useSafeAssignContactDialog';
import { useSafeDialog } from '@/logic/useSafeDialog';
import { useCallback } from 'react';
import { useDeleteTag } from '@/logic/useDeleteTag';

type Props = {
  tag: Tag;
};

export default function TagsTableRow({ tag }: Props) {
  const { removeTag } = useDeleteTag();
  const { safeOpenDialog } = useSafeDialog();
  const { safeAssignDialog } = useSafeAssignContactDialog();

  const deleteHandler = async () => {
    const confirmed = confirm(`Are you sure you want to delete ${tag.name}?`);
    if (confirmed) {
      await removeTag(tag.id, { tagName: tag.name });
    }
  };

  const editHandler = useCallback(() => {
    safeOpenDialog('addTag', {
      type: 'tag',
      id: tag.id,
      name: tag.name,
      color: tag.color,
    });
  }, [tag.id, tag.name, tag.color, safeOpenDialog]);

  const addUserHandler = useCallback(() => {
    safeAssignDialog({ type: 'tag', id: tag.id, name: tag.name });
  }, [tag.id, tag.name, safeAssignDialog]);

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
        <RowActionsMenu
          id={tag.id}
          name={tag.name}
          onEdit={editHandler}
          onDelete={deleteHandler}
          onAddUser={addUserHandler}
        />
      </td>
    </TableRow>
  );
}
