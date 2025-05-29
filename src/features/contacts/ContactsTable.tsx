import {
  Table,
  TableBody,
  TableHead as TableHeadCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LuArrowDown, LuArrowUp, LuArrowUpDown } from 'react-icons/lu';
import type { Contact } from '@/types/types';
import ContactTableRow from '@/features/contacts/ContactTableRow';

type Props = {
  contacts: Contact[];
  expandedTags: string[];
  toggleTags: (id: string) => void;
  sortBy: 'name' | 'companyName';
  sortDirection: 'asc' | 'desc';
  onSortChange: (key: 'name' | 'companyName') => void;
};

export default function ContactsTable({
  contacts,
  expandedTags,
  toggleTags,
  sortBy,
  sortDirection,
  onSortChange,
}: Props) {
  const renderSortIcon = (key: 'name' | 'companyName') => {
    if (sortBy !== key) return <LuArrowUpDown className="inline" />;
    return sortDirection === 'asc' ? (
      <LuArrowUp className="inline" />
    ) : (
      <LuArrowDown className="inline" />
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeadCell
            className="cursor-pointer select-none"
            onClick={() => onSortChange('name')}
          >
            <div className="flex items-center gap-2">
              Person {renderSortIcon('name')}
            </div>
          </TableHeadCell>

          <TableHeadCell
            className="cursor-pointer select-none"
            onClick={() => onSortChange('companyName')}
          >
            <div className="flex items-center gap-2">
              Company Name {renderSortIcon('companyName')}
            </div>
          </TableHeadCell>

          <TableHeadCell>Groups</TableHeadCell>
          <TableHeadCell>Tags</TableHeadCell>
        </TableRow>
      </TableHeader>

      <TableBody>
        {contacts.map(contact => {
          const showAll = expandedTags.includes(contact.id);
          return (
            <ContactTableRow
              key={contact.id}
              contact={contact}
              showAll={showAll}
              toggleTags={toggleTags}
            />
          );
        })}
      </TableBody>
    </Table>
  );
}
