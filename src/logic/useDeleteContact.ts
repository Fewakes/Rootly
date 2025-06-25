// src/logic/useDeleteContact.ts

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { deleteContactById } from '@/services/contacts';
import { useLogActivity } from './useLogActivity';

export function useDeleteContact() {
  const [loading, setLoading] = useState(false);
  const { logActivity } = useLogActivity();

  const deleteContact = useCallback(
    async (contactId: string, details: { name: string }): Promise<boolean> => {
      if (!contactId || !details.name) {
        toast.error('Delete failed: Contact details are missing.');
        return false;
      }
      if (!window.confirm(`Are you sure you want to delete ${details.name}?`)) {
        return false;
      }

      setLoading(true);
      try {
        await deleteContactById(contactId);
        toast.success(`Contact "${details.name}" deleted.`);

        // This is correct according to your logActivity function
        logActivity('CONTACT_DELETED', 'Contact', contactId, {
          name: details.name,
        });

        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'An unknown error occurred.';
        toast.error(`Failed to delete contact: ${message}`);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [logActivity],
  );

  return { deleteContact, loading };
}
