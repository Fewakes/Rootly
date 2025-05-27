'use client';

import { useEffect, useState } from 'react';
import { getContactsByUser } from '@/services/contacts';
import { getCurrentUserId } from '@/services/users';

export function useContactsCount() {
  const [contactsCount, setContactsCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchContacts() {
      const id = await getCurrentUserId();
      const contacts = await getContactsByUser(id);
      setContactsCount(contacts.length);
    }

    fetchContacts();
  }, []);

  return contactsCount;
}
