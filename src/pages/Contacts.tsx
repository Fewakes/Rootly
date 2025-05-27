import ContactsTable from '@/features/contacts/ContactsTable';
import { useContacts } from '@/logic/useContacts';
import { useExpandedTags } from '@/logic/useExpandedTags';
import { useSortedContacts } from '@/logic/useSortedContacts';

export default function Contacts() {
  const { contacts, loading, error } = useContacts();
  const { expandedTags, toggleTags } = useExpandedTags();
  const { sortedContacts, sortBy, sortDirection, handleSortChange } =
    useSortedContacts(contacts);

  if (loading) return <div>Loading contacts...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="w-full p-6 space-y-8">
      <h1 className="text-4xl font-bold">Contacts</h1>
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
