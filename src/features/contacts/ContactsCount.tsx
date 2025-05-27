'use client';

import { useContactsCount } from '@/logic/useContactsCount';

export default function ContactsCount() {
  const contactsCount = useContactsCount();

  if (contactsCount === null) {
    return <div>Loading...</div>;
  }

  return <div>{contactsCount}</div>;
}
