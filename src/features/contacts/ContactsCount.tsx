'use client';

import { getContactsByUser } from '@/lib/supabase/supabase';
import { useEffect, useState } from 'react';

export default function ContactsCount() {
  const [contactsCount, setContactsCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchContacts() {
      const contacts = await getContactsByUser();
      setContactsCount(contacts.length);
    }

    fetchContacts();
  }, []);

  if (contactsCount === null) {
    return <div>Loading...</div>;
  }

  return <div>{contactsCount}</div>;
}
