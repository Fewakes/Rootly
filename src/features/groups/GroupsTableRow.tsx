import React from 'react';
import { TableRow } from '@/components/ui/table';
import { GroupsRowAction } from './GroupsRowAction';

type Group = {
  id: string;
  name: string;
  created_at: string;
  user_count: number;
};

type Props = {
  group: Group;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddUser: (id: string) => void;
};

export function GroupsTableRow({ group, onEdit, onDelete, onAddUser }: Props) {
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
      <td className="px-5 py-3 text-sm text-gray-500">{group.user_count}</td>
      <td className="px-5 py-3 text-right">
        <GroupsRowAction
          id={group.id}
          name={group.name}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddUser={onAddUser}
        />
      </td>
    </TableRow>
  );
}
