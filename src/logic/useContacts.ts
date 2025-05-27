import { useEffect, useState, useCallback } from 'react';
import type { Contact } from '@/types/types';
import { getContactsByUser } from '@/services/contacts';
import { getCurrentUserId } from '@/services/users';

export function useContacts(refreshTrigger: any = null) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('User not logged in');
      const data = await getContactsByUser(userId);
      setContacts(data);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts, refreshTrigger]);

  const refreshContacts = fetchContacts;

  return { contacts, loading, error, refreshContacts, setContacts };
}
