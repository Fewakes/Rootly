// src/logic/useEntityContacts.ts

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import type { AssignEntity, AssignedContactDetails } from '@/types/types';
import {
  getAssignedContacts,
  getEligibleContacts,
  addContactToEntity,
  removeContactFromEntity,
} from '@/services/assignContactService';
import { getCurrentUserId } from '@/services/users';
import { logActivity } from '@/services/activityLogger';
import type { ActivityAction } from '@/types/types';

export function useEntityContacts(entity: AssignEntity | null) {
  const [assigned, setAssigned] = useState<AssignedContactDetails[]>([]);
  const [eligible, setEligible] = useState<AssignedContactDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getCurrentUserId();
      setUserId(id);
    };
    fetchUserId();
  }, []);

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
    const contact = eligible.find(c => c.id === contactId) || assigned.find(c => c.id === contactId);
    await addContactToEntity(entity, contactId);
    toast.success('Contact assigned.');
    const entityConfig: Record<AssignEntity['type'], { action: ActivityAction; entityType: 'Tag' | 'Group' | 'Company'; nameKey: string }> = {
      tag: { action: 'TAG_ASSIGNED', entityType: 'Tag', nameKey: 'tagName' },
      group: { action: 'GROUP_ASSIGNED', entityType: 'Group', nameKey: 'groupName' },
      company: { action: 'COMPANY_ASSIGNED', entityType: 'Company', nameKey: 'companyName' },
    };
    const config = entityConfig[entity.type];
    if (userId) {
      await logActivity({
        userId,
        action: config.action,
        entityType: config.entityType,
        entityId: entity.id,
        details: {
          contactId,
          contactName: contact?.name ?? '',
          [config.nameKey]: entity.name,
        },
      });
    }
    await refreshContacts();
  };

  const removeContact = async (contactId: string) => {
    if (!entity) return;
    const contact = assigned.find(c => c.id === contactId);
    await removeContactFromEntity(entity, contactId);
    toast.error('Contact removed.');
    const entityConfig: Record<AssignEntity['type'], { action: ActivityAction; entityType: 'Tag' | 'Group' | 'Company'; nameKey: string }> = {
      tag: { action: 'TAG_UNASSIGNED', entityType: 'Tag', nameKey: 'tagName' },
      group: { action: 'GROUP_UNASSIGNED', entityType: 'Group', nameKey: 'groupName' },
      company: { action: 'COMPANY_UNASSIGNED', entityType: 'Company', nameKey: 'companyName' },
    };
    const config = entityConfig[entity.type];
    if (userId) {
      await logActivity({
        userId,
        action: config.action,
        entityType: config.entityType,
        entityId: entity.id,
        details: {
          contactId,
          contactName: contact?.name ?? '',
          [config.nameKey]: entity.name,
        },
      });
    }
    await refreshContacts();
  };

  return { assigned, eligible, loading, addContact, removeContact };
}
