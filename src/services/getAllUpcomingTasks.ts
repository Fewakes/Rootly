import { supabase } from '@/lib/supabaseClient';
import { isBefore, parseISO } from 'date-fns';

export async function getAllUpcomingTasks(userId: string) {
  const today = new Date().toISOString();

  const queries = [
    supabase
      .from('tasks')
      .select(
        'id, title, due_date, completed, created_at, contact_id, contacts(name)',
      )
      .eq('user_id', userId),

    supabase
      .from('group_tasks')
      .select(
        'id, title, due_date, completed, created_at, group_id, groups(name)',
      )
      .eq('user_id', userId),

    supabase
      .from('company_tasks')
      .select(
        'id, title, due_date, completed, created_at, company_id, companies(name)',
      )
      .eq('user_id', userId),

    supabase
      .from('tag_tasks')
      .select('id, title, due_date, completed, created_at, tag_id, tags(name)')
      .eq('user_id', userId),
  ];

  const [contact, group, company, tag] = await Promise.all(queries);

  console.log('contact:', contact.data);
  console.log('group:', group.data);
  console.log('company:', company.data);
  console.log('tag:', tag.data);

  if (contact.error || group.error || company.error || tag.error) {
    console.error('Supabase query errors:', {
      contact: contact.error,
      group: group.error,
      company: company.error,
      tag: tag.error,
    });
  }

  const format = (data: any[], type: string) =>
    (data || []).map(task => ({
      id: task.id,
      title: task.title,
      due_date: task.due_date,
      created_at: task.created_at,
      completed: task.completed,
      origin: type,
      entity: {
        id:
          task.contact_id ||
          task.group_id ||
          task.company_id ||
          task.tag_id ||
          null,
        name:
          task.contacts?.name ||
          task.groups?.name ||
          task.companies?.name ||
          task.tags?.name ||
          'Unknown',
      },
    }));

  const allTasks = [
    ...format(contact.data, 'contact'),
    ...format(group.data, 'group'),
    ...format(company.data, 'company'),
    ...format(tag.data, 'tag'),
  ];

  const upcomingTasks = allTasks
    .filter(
      task => task.due_date && isBefore(new Date(), parseISO(task.due_date)),
    )
    .sort(
      (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
    );

  return upcomingTasks;
}
