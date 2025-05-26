import ContactRow from '@/features/contacts/ContactRow';

import { useExpandedTags } from '@/hooks/useExpandedTags';
import { useSortedContacts } from '@/hooks/useSortedContacts';
import { LuArrowDown, LuArrowUp, LuArrowUpDown } from 'react-icons/lu';

import {
  Table,
  TableBody,
  TableHead as TableHeadCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Contact } from '@/types/types';
import { useEffect, useState } from 'react';
import { getContactsByUser } from '@/services/contacts';
import { getCurrentUserId } from '@/services/users';

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const userId = await getCurrentUserId();
        if (!userId) {
          throw new Error('User not logged in');
        }

        const results = await getContactsByUser(userId);
        setContacts(results);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const { expandedTags, toggleTags } = useExpandedTags();
  const { sortedContacts, sortBy, sortDirection, handleSortChange } =
    useSortedContacts(contacts);

  const renderSortIcon = (key: 'name' | 'companyName') => {
    if (sortBy !== key) return <LuArrowUpDown className="inline" />;
    return sortDirection === 'asc' ? (
      <LuArrowUp className="inline" />
    ) : (
      <LuArrowDown className="inline" />
    );
  };

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
