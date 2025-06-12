import { TableRow } from '@/components/ui/table';
import RowActionsMenu from '@/components/RowActionMenu';
import { useSafeDialog } from '@/logic/useSafeDialog';
import { useCallback } from 'react';
import type { Group } from '@/types/types';
import { useDeleteGroup } from '@/logic/useDeleteGroup';
import { useSafeAssignContactDialog } from '@/logic/useSafeAssignContactDialog';

type Props = {
  group: Group;
};

export default function GroupsTableRow({ group }: Props) {
  const { deleteGroup } = useDeleteGroup();
  const { safeOpenDialog } = useSafeDialog();
  const { safeAssignDialog } = useSafeAssignContactDialog();

  const deleteHandler = async () => {
    const confirmed = confirm(`Are you sure you want to delete ${group.name}?`);
    if (confirmed) {
      await deleteGroup(group.id, { groupName: group.name });
    }
  };

  const editHandler = useCallback(() => {
    safeOpenDialog('addGroup', {
      type: 'group',
      id: group.id,
      name: group.name,
    });
  }, [group.id, group.name, safeOpenDialog]);

  const addUserHandler = useCallback(() => {
    safeAssignDialog({ type: 'group', id: group.id, name: group.name });
  }, [group.id, group.name, safeAssignDialog]);

  return (
    <TableRow key={group.id} className="hover:bg-gray-50 transition-colors">
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
      <td className="px-5 py-3 text-sm text-gray-500">{group.contact_count}</td>
      <td className="px-5 py-3 text-right">
        <RowActionsMenu
          id={group.id}
          name={group.name}
          onEdit={editHandler}
          onDelete={deleteHandler}
          onAddUser={addUserHandler}
        />
      </td>
    </TableRow>
  );
}
