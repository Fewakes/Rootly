'use client';

import { useEffect, useState } from 'react';
import { getContactsByUser } from '@/services/contacts';
import { getCurrentUserId } from '@/services/users';

interface UseContactsCountResult {
  contactsCount: number | null;
  loading: boolean;
  error: string | null;
}

export function useContactsCount(): UseContactsCountResult {
  const [contactsCount, setContactsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Initialize loading as true
  const [error, setError] = useState<string | null>(null); // Initialize error as null

  useEffect(() => {
    async function fetchContacts() {
      setLoading(true); // Set loading to true when fetching starts
      setError(null); // Clear any previous errors

      try {
        const id = await getCurrentUserId();
        if (!id) {
          throw new Error('User not authenticated or ID not found.');
        }
        const contacts = await getContactsByUser(id);
        setContactsCount(contacts.length);
      } catch (err: any) {
        console.error('Failed to fetch contacts count:', err);
        setError(err.message || 'Failed to load contacts count.'); // Set error message
        setContactsCount(null); // Optionally reset count on error
      } finally {
        setLoading(false); // Set loading to false when fetching completes (success or error)
      }
    }

    fetchContacts();
  }, []); // Empty dependency array means this effect runs once on mount

  return { contactsCount, loading, error };
}
