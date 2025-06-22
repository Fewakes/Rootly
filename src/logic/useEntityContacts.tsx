// src/logic/useEntityContacts.ts

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import type { AssignEntity, ContactWithDetails } from '@/types/types';
import {
  getAssignedContacts,
  getEligibleContacts,
  addContactToEntity,
  removeContactFromEntity,
} from '@/services/assignContactService';

/**
 * A reusable hook to manage the assigned and eligible contacts for any entity (Company, Tag, or Group).
 * @param entity An object with the entity's id and type, e.g., { id: '123', type: 'company' }
 */
export function useEntityContacts(entity: AssignEntity | null) {
  const [assigned, setAssigned] = useState<ContactWithDetails[]>([]);
  const [eligible, setEligible] = useState<ContactWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetches both assigned and eligible contacts and updates the state.
  const refreshContacts = useCallback(async () => {
    if (!entity) {
      // If there's no entity, clear the lists and stop loading.
      setAssigned([]);
      setEligible([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [assignedList, eligibleList] = await Promise.all([
        getAssignedContacts(entity),
        getEligibleContacts(entity),
      ]);
      setAssigned(assignedList);
      setEligible(eligibleList);
    } catch (error) {
      console.error('Failed to refresh contacts:', error);
      toast.error('Could not load contact lists.');
    } finally {
      setLoading(false);
    }
  }, [entity]);

  // Re-fetch contacts whenever the entity changes.
  useEffect(() => {
    refreshContacts();
  }, [refreshContacts]);

  // Assigns a contact to the entity and then refreshes the lists.
  const addContact = async (contactId: string) => {
    if (!entity) return;
    await addContactToEntity(entity, contactId);
    toast.success('Contact assigned.');
    await refreshContacts();
  };

  // Removes a contact from the entity and then refreshes the lists.
  const removeContact = async (contactId: string) => {
    if (!entity) return;
    await removeContactFromEntity(entity, contactId);
    toast.error('Contact removed.');
    await refreshContacts();
  };

  return { assigned, eligible, loading, addContact, removeContact };
}
