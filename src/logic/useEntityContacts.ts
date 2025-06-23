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

export function useEntityContacts(entity: AssignEntity | null) {
  const [assigned, setAssigned] = useState<ContactWithDetails[]>([]);
  const [eligible, setEligible] = useState<ContactWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshContacts = useCallback(async () => {
    if (!entity) {
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

  useEffect(() => {
    refreshContacts();
  }, [refreshContacts]);

  const addContact = async (contactId: string) => {
    if (!entity) return;
    await addContactToEntity(entity, contactId);
    toast.success('Contact assigned.');
    await refreshContacts();
  };

  const removeContact = async (contactId: string) => {
    if (!entity) return;
    await removeContactFromEntity(entity, contactId);
    toast.error('Contact removed.');
    await refreshContacts();
  };

  return { assigned, eligible, loading, addContact, removeContact };
}
