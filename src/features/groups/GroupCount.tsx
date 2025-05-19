import type ContactsProps from '@/types/types';
import { useMemo } from 'react';

export default function GroupCount({ contacts }: ContactsProps) {
  const groupCount = useMemo(() => {
    const uniqueGroups = new Set();

    contacts.forEach(c => {
      c.group.forEach(group => {
        uniqueGroups.add(group);
      });
    });

    return uniqueGroups.size;
  }, [contacts]);

  return <div>{groupCount}</div>;
}
