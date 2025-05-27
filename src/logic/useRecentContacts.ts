// hooks/useRecentContacts.ts
import { useEffect, useState } from 'react';
import type { Contact } from '@/types/types';
import { getRecentContacts } from '@/services/contacts';

export function useRecentContacts(number: number) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchRecentContacts = async () => {
      setLoading(true);
      const recent = await getRecentContacts(number);
      setContacts(recent);
      setLoading(false);
    };

    fetchRecentContacts();
  }, [number]);

  return { contacts, loading };
}
