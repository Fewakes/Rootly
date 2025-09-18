// src/logic/useEntityNotesTasks.ts

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useLogActivity } from './useLogActivity';
import {
  companyNotesService,
  companyTasksService,
  groupNotesService,
  groupTasksService,
  tagNotesService,
  tagTasksService,
} from '@/services/entityNotesTasks';
import type { ActivityAction } from '@/types/types';

const ACTION_PREFIX: Record<'company' | 'group' | 'tag', 'COMPANY' | 'GROUP' | 'TAG'> = {
  company: 'COMPANY',
  group: 'GROUP',
  tag: 'TAG',
};

const createEntityActivityHook = (
  entityType: 'company' | 'group' | 'tag',
  activityType: 'notes' | 'tasks',
) => {
  const services = {
    notes: {
      company: companyNotesService,
      group: groupNotesService,
      tag: tagNotesService,
    },
    tasks: {
      company: companyTasksService,
      group: groupTasksService,
      tag: tagTasksService,
    },
  };

  // This is the actual hook that will be used by your pages.
  const useHook = (userId: string, entityId: string, entityName: string) => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { logActivity } = useLogActivity();

    const service = services[activityType][entityType];
    const entityIdKey = `${entityType}_id`;
    const entityNameKey = `${entityType}Name`;
    const actionPrefix = ACTION_PREFIX[entityType];
    const actionType = activityType === 'notes' ? 'NOTE' : 'TASK';

    const fetchItems = useCallback(async () => {
      if (!userId || !entityId) {
        setItems([]);
        return;
      }
      setLoading(true);
      try {
        const data = await service.getAll(userId, entityIdKey, entityId);
        setItems(data || []);
      } catch (error) {
        toast.error(`Failed to load ${activityType}.`);
      } finally {
        setLoading(false);
      }
    }, [userId, entityId, service, entityIdKey]);

    useEffect(() => {
      fetchItems();
    }, [fetchItems]);

    // --- Action Handlers with Detailed Logging ---

    const createItem = async (payload: Record<string, any>) => {
      const newItem = await service.create({
        ...payload,
        [entityIdKey]: entityId,
        user_id: userId,
      });
      const action: ActivityAction = `${actionPrefix}_${actionType}_CREATED` as ActivityAction;
      logActivity(
        action,
        activityType === 'notes' ? 'Note' : 'Task',
        newItem.id,
        { [entityNameKey]: entityName },
      );
      toast.success(`${activityType === 'notes' ? 'Note' : 'Task'} added.`);
      await fetchItems();
    };

    const updateItem = async (itemId: string, payload: Record<string, any>) => {
      await service.update(itemId, payload);
      const action: ActivityAction = `${actionPrefix}_${actionType}_EDITED` as ActivityAction;
      logActivity(action, activityType === 'notes' ? 'Note' : 'Task', itemId, {
        [entityNameKey]: entityName,
      });
      toast.success(`${activityType === 'notes' ? 'Note' : 'Task'} updated.`);
      await fetchItems();
    };

    const updateTaskStatus = async (itemId: string, completed: boolean) => {
      if (activityType !== 'tasks') return;
      await service.update(itemId, { completed });
      const action: ActivityAction = `${actionPrefix}_TASK_${
        completed ? 'COMPLETED' : 'REOPENED'
      }` as ActivityAction;
      logActivity(action, 'Task', itemId, { [entityNameKey]: entityName });
      toast.success(`Task marked as ${completed ? 'complete' : 'incomplete'}.`);
      await fetchItems();
    };

    const deleteItem = async (itemId: string) => {
      await service.deleteById(itemId);
      const action: ActivityAction = `${actionPrefix}_${actionType}_REMOVED` as ActivityAction;
      logActivity(action, activityType === 'notes' ? 'Note' : 'Task', itemId, {
        [entityNameKey]: entityName,
      });
      toast.error(`${activityType === 'notes' ? 'Note' : 'Task'} deleted.`);
      await fetchItems();
    };

    return {
      items,
      loading,
      refetch: fetchItems,
      createItem,
      updateItem,
      deleteItem,
      updateTaskStatus,
    };
  };

  return useHook;
};

// --- Exported Hooks ---
export const useCompanyNotes = createEntityActivityHook('company', 'notes');
export const useCompanyTasks = createEntityActivityHook('company', 'tasks');
export const useGroupNotes = createEntityActivityHook('group', 'notes');
export const useGroupTasks = createEntityActivityHook('group', 'tasks');
export const useTagNotes = createEntityActivityHook('tag', 'notes');
export const useTagTasks = createEntityActivityHook('tag', 'tasks');
