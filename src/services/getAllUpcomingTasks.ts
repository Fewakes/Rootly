import { supabase } from '@/lib/supabaseClient';
import { isBefore, parseISO } from 'date-fns';
import type { Task, UnifiedTask } from '@/types/types';

type ContactTask = Task & {
  contact_id: string;
  contacts: { name: string } | null;
};
type GroupTask = Task & { group_id: string; groups: { name: string } | null };
type CompanyTask = Task & {
  company_id: string;
  companies: { name: string } | null;
};
type TagTask = Task & { tag_id: string; tags: { name: string } | null };

type RawTask =
  | (ContactTask & { origin: 'contact' })
  | (GroupTask & { origin: 'group' })
  | (CompanyTask & { origin: 'company' })
  | (TagTask & { origin: 'tag' });

/**
 * Fetches tasks from four different tables, combines them, and filters for upcoming due dates.
 */
export async function getAllUpcomingTasks(
  userId: string,
): Promise<UnifiedTask[]> {
  const queries = [
    supabase.from('tasks').select('*, contacts(name)').eq('user_id', userId),
    supabase
      .from('group_tasks')
      .select('*, groups(name)')
      .eq('user_id', userId),
    supabase
      .from('company_tasks')
      .select('*, companies(name)')
      .eq('user_id', userId),
    supabase.from('tag_tasks').select('*, tags(name)').eq('user_id', userId),
  ];

  const [contactRes, groupRes, companyRes, tagRes] = await Promise.all(queries);

  const rawTasks: RawTask[] = [
    ...((contactRes.data as ContactTask[]) || []).map(t => ({
      ...t,
      origin: 'contact' as const,
    })),
    ...((groupRes.data as GroupTask[]) || []).map(t => ({
      ...t,
      origin: 'group' as const,
    })),
    ...((companyRes.data as CompanyTask[]) || []).map(t => ({
      ...t,
      origin: 'company' as const,
    })),
    ...((tagRes.data as TagTask[]) || []).map(t => ({
      ...t,
      origin: 'tag' as const,
    })),
  ];

  const allTasks = rawTasks
    .map(task => {
      const baseTask = {
        id: task.id,
        title: task.title,
        due_date: task.due_date,
        completed: task.completed,
        created_at: task.created_at,
      };

      switch (task.origin) {
        case 'contact':
          return {
            ...baseTask,
            origin: 'contact',
            entity: {
              id: task.contact_id,
              name: task.contacts?.name || 'Unknown',
            },
          };
        case 'group':
          return {
            ...baseTask,
            origin: 'group',
            entity: { id: task.group_id, name: task.groups?.name || 'Unknown' },
          };
        case 'company':
          return {
            ...baseTask,
            origin: 'company',
            entity: {
              id: task.company_id,
              name: task.companies?.name || 'Unknown',
            },
          };
        case 'tag':
          return {
            ...baseTask,
            origin: 'tag',
            entity: { id: task.tag_id, name: task.tags?.name || 'Unknown' },
          };
      }
    })
    .filter(Boolean) as UnifiedTask[];

  const upcomingTasks = allTasks
    .filter((task): task is UnifiedTask & { due_date: string } => {
      if (!task.due_date) return false;
      return isBefore(new Date(), parseISO(task.due_date));
    })
    .sort(
      (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
    );

  return upcomingTasks;
}
