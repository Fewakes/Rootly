import { useEffect, useState } from 'react';
import type { Contact } from '@/types/types';
import { getFavouriteContacts } from '@/services/contacts';

export function useFavouriteContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchRecentContacts = async () => {
      setLoading(true);
      const recent = await getFavouriteContacts();
      setContacts(recent);
      setLoading(false);
    };

    fetchRecentContacts();
  }, []);

  return { contacts, loading };
}
