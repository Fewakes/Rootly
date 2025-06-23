import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { deleteContactById } from '@/services/contacts';
import { useLogActivity } from './useLogActivity';
import { getCurrentUserId } from '@/services/users';

export function useDeleteContact() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const { logActivity } = useLogActivity(userId);

  useEffect(() => {
    const fetchUser = async () => {
      const id = await getCurrentUserId();
      setUserId(id);
    };
    fetchUser();
  }, []);

  const deleteContact = useCallback(
    async (
      contactId: string,
      details: { name: string },
      onSuccess?: () => void,
    ) => {
      if (!userId) {
        toast.error('User not authenticated. Cannot delete contact.');
        return;
      }
      setLoading(true);
      setError(null);

      try {
        await deleteContactById(contactId);

        logActivity('CONTACT_DELETED', 'Contact', contactId, details);
        toast.success('Contact deleted successfully');

        onSuccess?.();
      } catch (err) {
        const typedErr = err as Error;
        setError(typedErr);
        toast.error('Failed to delete contact', {
          description: typedErr.message,
        });
      } finally {
        setLoading(false);
      }
    },
    [userId, logActivity],
  );

  return {
    deleteContact,
    loading,
    error,
  };
}
