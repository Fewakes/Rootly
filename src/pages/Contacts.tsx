'use client';

import ContactsTable from '@/features/contacts/ContactsTable';
import { useContacts } from '@/logic/useContacts';
import { useExpandedTags } from '@/logic/useExpandedTags';
import { useSortedContacts } from '@/logic/useSortedContacts';
import { Button } from '@/components/ui/button';
import { useDialog } from '@/contexts/DialogContext';
import { UserPlus } from 'lucide-react';

export default function Contacts() {
  const { contacts, loading, error } = useContacts();
  const { expandedTags, toggleTags } = useExpandedTags();
  const { sortedContacts, sortBy, sortDirection, handleSortChange } =
    useSortedContacts(contacts);
  const { openDialog } = useDialog();

  if (loading) return <div>Loading contacts...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="w-full p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Contacts</h1>

        <Button
          className="bg-primaryBlue text-white px-6 py-3 text-base font-semibold transition duration-150 transform hover:scale-[1.02] active:scale-[0.98] shadow hover:shadow-md hover:bg-primaryBlue"
          onClick={() => openDialog('addContact')}
        >
          <UserPlus className="w-5 h-5 mr-2" /> Add New Contact
        </Button>
      </div>
      <ContactsTable
        contacts={sortedContacts}
        expandedTags={expandedTags}
        toggleTags={toggleTags}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />
    </div>
  );
}
