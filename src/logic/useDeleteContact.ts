import { deleteContactById } from '@/services/contacts';
import { useState } from 'react';

export function useDeleteContact() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteContact = async (
    contactId: string,
    onSuccess?: () => void,
    onError?: (error: Error) => void,
  ) => {
    setLoading(true);
    setError(null);

    try {
      await deleteContactById(contactId);
      onSuccess?.();
    } catch (err) {
      const typedErr = err as Error;
      setError(typedErr);
      onError?.(typedErr);
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteContact,
    loading,
    error,
  };
}
