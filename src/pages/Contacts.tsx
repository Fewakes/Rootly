import ContactRow from '@/features/contacts/ContactRow';
import { contacts as contactsData } from '@/features/contacts/contacts';
import { useState } from 'react';
import { LuArrowDown, LuArrowUp, LuArrowUpDown } from 'react-icons/lu';

import {
  Table,
  TableBody,
  TableHead as TableHeadCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type SortKey = 'name' | 'companyName';

export default function Contacts() {
  const [expandedTags, setExpandedTags] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const toggleTags = (id: number) => {
    setExpandedTags(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  };

  const handleSortChange = (key: SortKey) => {
    if (sortBy === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (key: SortKey) => {
    if (sortBy !== key) return <LuArrowUpDown className="inline" />;
    if (sortDirection === 'asc') return <LuArrowUp className="inline" />;
    return <LuArrowDown className="inline" />;
  };

  // Sort contacts based on current sort settings
  const sortedContacts = [...contactsData].sort((a, b) => {
    let aValue: string | number = '';
    let bValue: string | number = '';

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'companyName':
        aValue = a.company.name.toLowerCase();
        bValue = b.company.name.toLowerCase();
        break;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="w-full p-6 space-y-8">
      <h1 className="text-4xl font-bold">Contacts</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHeadCell
              className="cursor-pointer select-none"
              onClick={() => handleSortChange('name')}
            >
              <div className="flex items-center gap-2">
                Person {renderSortIcon('name')}
              </div>
            </TableHeadCell>

            <TableHeadCell
              className="cursor-pointer select-none"
              onClick={() => handleSortChange('companyName')}
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
          {sortedContacts.map(contact => {
            const showAll = expandedTags.includes(contact.id);
            return (
              <ContactRow
                key={contact.id}
                contact={contact}
                showAll={showAll}
                toggleTags={toggleTags}
              />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
