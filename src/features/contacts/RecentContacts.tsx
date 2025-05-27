import type { RecentContactsProps } from '@/types/types';

import { useRecentContacts } from '@/logic/useRecentContacts';
import RecentContactsRow from './RecentContactsRow';

export default function RecentContacts({ number }: RecentContactsProps) {
  const { contacts, loading } = useRecentContacts(number);

  if (loading) {
    return <div>Loading recent contacts...</div>;
  }

  return (
    <div className="space-y-2">
      {contacts.length > 0 ? (
        contacts.map(contact => (
          <RecentContactsRow key={contact.id} contact={contact} />
        ))
      ) : (
        <div className="text-muted-foreground italic">No recent contacts</div>
      )}
    </div>
  );
}
