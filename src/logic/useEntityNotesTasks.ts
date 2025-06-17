import {
  companyNotesService,
  companyTasksService,
  groupNotesService,
  groupTasksService,
  tagNotesService,
  tagTasksService,
} from '@/services/entityNotesTasks';
import { useState, useCallback, useEffect } from 'react';

function createUseEntityHook(
  service: ReturnType<typeof service>,
  entityKey: string,
) {
  return function useEntityItems(userId: string, entityId: string) {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetch = useCallback(async () => {
      try {
        setLoading(true);
        const data = await service.getAll(userId, entityKey, entityId);
        setItems(data);
        setError(null);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }, [userId, entityId]);

    useEffect(() => {
      fetch();
    }, [fetch]);

    return { items, loading, error, refetch: fetch };
  };
}

export const useCompanyNotes = createUseEntityHook(
  companyNotesService,
  'company_id',
);
export const useCompanyTasks = createUseEntityHook(
  companyTasksService,
  'company_id',
);
export const useGroupNotes = createUseEntityHook(groupNotesService, 'group_id');
export const useGroupTasks = createUseEntityHook(groupTasksService, 'group_id');
export const useTagNotes = createUseEntityHook(tagNotesService, 'tag_id');
export const useTagTasks = createUseEntityHook(tagTasksService, 'tag_id');
