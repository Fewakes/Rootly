import { useEffect, useState, useCallback } from 'react';
import type { Contact } from '@/types/types';
import { getContactsByUser } from '@/services/contacts';
import { getCurrentUserId } from '@/services/users';

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('User not logged in');

      const data = await getContactsByUser(userId);
      setContacts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError((err as Error).message || 'Failed to fetch contacts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return {
    contacts,
    loading,
    error,
    refreshContacts: fetchContacts,
    setContacts,
  };
}
