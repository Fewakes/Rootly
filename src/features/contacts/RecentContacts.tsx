import {
  getCurrentUserId,
  getRecentContactsByUser,
} from '@/lib/supabase/supabase';
import type { Contact, RecentContactsProps } from '@/types/types';
import { useEffect, useState } from 'react';
import RecentContactsListItem from './RecentContactsListItem';

export default function RecentContacts({ number }: RecentContactsProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<true | false>();

  useEffect(() => {
    const fetchRecentContacts = async () => {
      setLoading(true);

      const userId = await getCurrentUserId();
      if (!userId) {
        console.error('No user ID found');
        setContacts([]);
        setLoading(false);
        return;
      }

      const recent = await getRecentContactsByUser(userId, number);
      setContacts(recent);
      setLoading(false);
    };

    fetchRecentContacts();
  }, [number]);

  if (loading) return <div>Loading recent contacts...</div>;

  return (
    <div className="space-y-2">
      {contacts.length > 0 ? (
        contacts.map(contact => (
          <RecentContactsListItem key={contact.id} contact={contact} />
        ))
      ) : (
        <div className="text-muted-foreground italic">No recent contacts</div>
      )}
    </div>
  );
}
