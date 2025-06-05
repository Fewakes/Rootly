import { Table, TableBody } from '@/components/ui/table';
import GroupsTableHeader from './GroupsTableHeader';
import GroupsTableRow from './GroupsTableRow';

type Group = {
  id: string;
  name: string;
  created_at: string;
  user_count: number;
};

type Props = {
  groups: Group[];
  sortBy: 'name' | 'created_at' | 'user_count';
  sortDirection: 'asc' | 'desc';
  onSortChange: (key: 'name' | 'created_at' | 'user_count') => void;
};

export default function GroupsTable({
  groups,
  sortBy,
  sortDirection,
  onSortChange,
}: Props) {
  return (
    <Table className="w-full border-collapse border border-gray-200 shadow-sm rounded-md overflow-hidden">
      <GroupsTableHeader
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={onSortChange}
      />
      <TableBody>
        {groups.map(group => (
          <GroupsTableRow key={group.id} group={group} />
        ))}
      </TableBody>
    </Table>
  );
}
