import ContactListItem from '@/features/contacts/RecentContactsListItem';
import type { Contact } from '@/types/types';
import { useMemo } from 'react';

interface RecentContactsProps {
  contacts: Contact[];
  number: number;
}

export default function RecentContacts({
  contacts,
  number,
}: RecentContactsProps) {
  const recentContacts = useMemo(() => {
    return contacts
      .slice()
      .sort((a, b) => {
        // Ensure both have createdAt and fallback to 0 if missing
        return (b.createdAt ?? '').localeCompare(a.createdAt ?? '');
      })
      .slice(0, number);
  }, [contacts]);

  return (
    <div className="space-y-2">
      {recentContacts.map(contact => (
        <ContactListItem key={contact.id} contact={contact} />
      ))}
    </div>
  );
}
