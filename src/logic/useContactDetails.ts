import { contacts } from '@/features/contacts/contacts';
import { useParams } from 'react-router-dom';

export function useContactDetail() {
  const { id } = useParams();
  const contact = contacts.find(c => c.id === parseInt(id || '', 10));
  return contact;
}
