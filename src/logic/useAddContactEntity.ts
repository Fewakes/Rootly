import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { addContactToEntity } from '@/services/contacts';

type EntityType = 'group' | 'tag' | 'company';

export function useAddContactToEntity() {
  const [isLoading, setIsLoading] = useState(false);

  const addContact = useCallback(
    async (contactId: string, entityId: string, entityType: EntityType) => {
      setIsLoading(true);

      const success = await addContactToEntity(contactId, entityId, entityType);

      if (success) {
        toast.success(`Contact added to ${entityType} successfully!`);
      } else {
        toast.error(`Failed to add contact to ${entityType}.`);
      }

      setIsLoading(false);
      return success;
    },
    [],
  );

  return { addContact, isLoading };
}
