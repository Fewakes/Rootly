import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getContactById } from '@/services/contacts';
import type { ContactWithDetails } from '@/types/types';

export function useContactDetail() {
  const { id } = useParams<{ id: string }>();
  const [contact, setContact] = useState<ContactWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchContact = async () => {
      try {
        setLoading(true);
        const data = await getContactById(id);
        setContact(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [id]);

  return { contact, loading, error };
}
