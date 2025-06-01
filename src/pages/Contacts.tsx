'use client';

import ContactsTable from '@/features/contacts/ContactsTable';
import { useContacts } from '@/logic/useContacts';
import { useExpandedTags } from '@/logic/useExpandedTags';
import { useSortedContacts } from '@/logic/useSortedContacts';
import { Button } from '@/components/ui/button';
import { useDialog } from '@/contexts/DialogContext';

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
          className="bg-primaryBlue text-white hover:bg-primaryBlue/90"
          onClick={() => openDialog('addContact')}
        >
          + Create New
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
