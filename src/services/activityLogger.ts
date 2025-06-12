import { supabase } from '@/lib/supabaseClient';

export type ActivityAction =
  | 'CONTACT_CREATED' //
  | 'CONTACT_UPDATED' //
  | 'CONTACT_DELETED' //
  | 'NOTE_CREATED'
  | 'NOTE_REMOVED'
  | 'NOTE_EDITED'
  | 'TASK_CREATED'
  | 'TASK_COMPLETED'
  | 'TASK_EDITED'
  | 'GROUP_ASSIGNED'
  | 'GROUP_CREATED' //
  | 'GROUP_REMOVED' //
  | 'GROUP_EDITED' //
  | 'TAG_ASSIGNED'
  | 'TAG_CREATED' //
  | 'TAG_REMOVED' //
  | 'TAG_EDITED' //
  | 'COMPANY_ASSIGNED'
  | 'COMPANY_CREATED' //
  | 'COMPANY_REMOVED' //
  | 'COMPANY_EDITED'; //

type LogActivityArgs = {
  userId: string;
  action: ActivityAction;
  entityType: string;
  entityId?: string;
  details?: Record<string, any>;
};

function generateDescription(
  action: ActivityAction,
  details?: Record<string, any>,
): string {
  switch (action) {
    case 'CONTACT_CREATED':
      return `Created contact ${details?.name}`;
    case 'CONTACT_UPDATED':
      return `Updated contact details for ${details?.name}`;
    case 'CONTACT_DELETED':
      return `Deleted contact ${details?.name}`;
    case 'NOTE_CREATED':
      return `Added new note to ${details?.contactName}`;
    case 'NOTE_REMOVED':
      return `Removed note from ${details?.contactName}`;
    case 'NOTE_EDITED':
      return `Edited note for ${details?.contactName}`;
    case 'TASK_CREATED':
      return `Created task for ${details?.contactName}`;
    case 'TASK_COMPLETED':
      return `Marked task as completed for ${details?.contactName}`;
    case 'TASK_EDITED':
      return `Edited task for ${details?.contactName}`;
    case 'GROUP_ASSIGNED':
      return `Assigned ${details?.contactName} to group ${details?.groupName}`;
    case 'GROUP_CREATED':
      return `Created new group ${details?.groupName}`;
    case 'GROUP_REMOVED':
      return `Removed group ${details?.groupName}`;
    case 'GROUP_EDITED':
      return `Edited group ${details?.groupName}`;
    case 'TAG_ASSIGNED':
      return `Assigned tag ${details?.tagName} to ${details?.contactName}`;
    case 'TAG_CREATED':
      return `Created new tag ${details?.tagName}`;
    case 'TAG_REMOVED':
      return `Removed tag ${details?.tagName}`;
    case 'TAG_EDITED':
      return `Edited tag ${details?.tagName}`;
    case 'COMPANY_ASSIGNED':
      return `Assigned ${details?.contactName} to company ${details?.companyName}`;
    case 'COMPANY_CREATED':
      return `Created new company ${details?.companyName}`;
    case 'COMPANY_REMOVED':
      return `Removed company ${details?.companyName}`;
    case 'COMPANY_EDITED':
      return `Edited company ${details?.companyName}`;
    default:
      return action.replace(/_/g, ' ').toLowerCase();
  }
}

export async function logActivity({
  userId,
  action,
  entityType,
  entityId,
  details = {},
}: LogActivityArgs): Promise<void> {
  const description = generateDescription(action, details);

  const { error } = await supabase.from('activity_log').insert({
    user_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details,
    description,
  });

  if (error) console.error('Activity log failed:', error.message);
}

export type ActivityLogEntry = {
  id: string;
  user_id: string;
  action: ActivityAction;
  entity_type: string;
  entity_id?: string;
  description: string;
  created_at: string;
  details?: Record<string, any>;
};

export async function fetchActivities(limit = 50): Promise<ActivityLogEntry[]> {
  const { data, error } = await supabase
    .from<'activity_log', ActivityLogEntry>('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch activities:', error.message);
    return [];
  }

  return data || [];
}
