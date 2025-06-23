// import {
//   companyNotesService,
//   companyTasksService,
//   groupNotesService,
//   groupTasksService,
//   tagNotesService,
//   tagTasksService,
// } from '@/services/entityNotesTasks';
// import { useState, useCallback, useEffect } from 'react';

// function createUseEntityHook(
//   service: ReturnType<typeof service>,
//   entityKey: string,
// ) {
//   return function useEntityItems(userId: string, entityId: string) {
//     const [items, setItems] = useState<any[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<Error | null>(null);

//     const fetch = useCallback(async () => {
//       try {
//         setLoading(true);
//         const data = await service.getAll(userId, entityKey, entityId);
//         setItems(data);
//         setError(null);
//       } catch (err: any) {
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     }, [userId, entityId]);

//     useEffect(() => {
//       fetch();
//     }, [fetch]);

//     return { items, loading, error, refetch: fetch };
//   };
// }

// export const useCompanyNotes = createUseEntityHook(
//   companyNotesService,
//   'company_id',
// );
// export const useCompanyTasks = createUseEntityHook(
//   companyTasksService,
//   'company_id',
// );
// export const useGroupNotes = createUseEntityHook(groupNotesService, 'group_id');
// export const useGroupTasks = createUseEntityHook(groupTasksService, 'group_id');
// export const useTagNotes = createUseEntityHook(tagNotesService, 'tag_id');
// export const useTagTasks = createUseEntityHook(tagTasksService, 'tag_id');

// src/logic/useEntityNotesTasks.ts

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useLogActivity } from './useLogActivity';
import { getCurrentUserId } from '@/services/users';
import {
  companyNotesService,
  companyTasksService,
  groupNotesService,
  groupTasksService,
  tagNotesService,
  tagTasksService,
} from '@/services/entityNotesTasks'; // Your generic services
import type { Note, Task } from '@/types/types';

// A generic hook factory to avoid repeating the same logic for notes and tasks
const createEntityActivityHook = (
  entityType: 'company' | 'group' | 'tag',
  activityType: 'notes' | 'tasks',
) => {
  const notesServices = {
    company: companyNotesService,
    group: groupNotesService,
    tag: tagNotesService,
  };
  const tasksServices = {
    company: companyTasksService,
    group: groupTasksService,
    tag: tagTasksService,
  };

  const useHook = (userId: string, entityId: string) => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { logActivity } = useLogActivity(userId);

    const service =
      activityType === 'notes'
        ? notesServices[entityType]
        : tasksServices[entityType];
    const entityIdKey = `${entityType}_id`;

    const fetchItems = useCallback(async () => {
      if (!userId || !entityId) return;
      setLoading(true);
      try {
        const data = await service.getAll(userId, entityIdKey, entityId);
        setItems(data || []);
      } catch (error) {
        toast.error(`Failed to load ${activityType}.`);
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, [userId, entityId, service, entityIdKey]);

    useEffect(() => {
      fetchItems();
    }, [fetchItems]);

    // --- CREATE ---
    const createItem = async (payload: Record<string, any>) => {
      const logDetails = { name: payload.title || payload.content };
      const newItem = await service.create({
        ...payload,
        [entityIdKey]: entityId,
        user_id: userId,
      });
      logActivity(
        activityType === 'notes' ? 'NOTE_CREATED' : 'TASK_CREATED',
        activityType === 'notes' ? 'Note' : 'Task',
        newItem.id,
        logDetails,
      );
      toast.success(`${activityType === 'notes' ? 'Note' : 'Task'} added.`);
      await fetchItems();
    };

    // --- UPDATE ---
    const updateItem = async (itemId: string, payload: Record<string, any>) => {
      const logDetails = { name: payload.title || payload.content };
      await service.update(itemId, payload);
      logActivity(
        activityType === 'notes' ? 'NOTE_EDITED' : 'TASK_EDITED',
        activityType === 'notes' ? 'Note' : 'Task',
        itemId,
        logDetails,
      );
      toast.success(`${activityType === 'notes' ? 'Note' : 'Task'} updated.`);
      await fetchItems();
    };

    // --- UPDATE TASK STATUS (for tasks only) ---
    const updateTaskStatus = async (itemId: string, completed: boolean) => {
      if (activityType !== 'tasks') return;
      await tasksServices[entityType].update(itemId, { completed });
      logActivity(
        completed ? 'TASK_COMPLETED' : 'TASK_REOPENED',
        'Task',
        itemId,
        {},
      );
      toast.success(`Task marked as ${completed ? 'complete' : 'incomplete'}.`);
      await fetchItems();
    };

    // --- DELETE ---
    const deleteItem = async (itemId: string) => {
      await service.deleteById(itemId);
      logActivity(
        activityType === 'notes' ? 'NOTE_REMOVED' : 'TASK_REMOVED',
        activityType === 'notes' ? 'Note' : 'Task',
        itemId,
        {},
      );
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

// Export specific hooks for each entity and activity type
export const useCompanyNotes = createEntityActivityHook('company', 'notes');
export const useCompanyTasks = createEntityActivityHook('company', 'tasks');
export const useGroupNotes = createEntityActivityHook('group', 'notes');
export const useGroupTasks = createEntityActivityHook('group', 'tasks');
export const useTagNotes = createEntityActivityHook('tag', 'notes');
export const useTagTasks = createEntityActivityHook('tag', 'tasks');
