import type ContactsProps from '@/types/types';
import { useMemo } from 'react';

export default function TagsCount({ contacts }: ContactsProps) {
  const tagsCount = useMemo(() => {
    const uniqueTags = new Set();

    contacts.forEach(c => {
      c.tags.forEach(tag => {
        uniqueTags.add(tag);
      });
    });

    return uniqueTags.size;
  }, [contacts]);

  return <div>{tagsCount}</div>;
}
