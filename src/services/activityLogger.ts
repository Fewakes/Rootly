// src/services/activityLogService.ts

import { supabase } from '@/lib/supabaseClient';
import type {
  ActivityAction,
  ActivityLogEntry,
  LogActivityArgs,
} from '@/types/types';

function generateDescription(
  action: ActivityAction,
  details?: Record<string, any>,
): string {
  // THE FIX: This helper variable is now more robust. It checks for all possible
  // name keys in the details object to find the correct one.
  const entityName =
    details?.name || // For contacts
    details?.companyName || // For companies
    details?.groupName || // For groups
    details?.tagName || // For tags
    ''; // Fallback

  const contactName = details?.contactName || '';

  switch (action) {
    // --- Contact Actions ---
    case 'CONTACT_CREATED':
      return `Created contact: ${entityName}`;
    case 'CONTACT_UPDATED':
      return `Updated contact details for: ${entityName}`;
    case 'CONTACT_DELETED':
      return `Deleted contact: ${entityName}`;

    // --- Contact Note Actions ---
    case 'NOTE_CREATED':
      return `Added a note to contact: ${contactName}`;
    case 'NOTE_EDITED':
      return `Edited a note for contact: ${contactName}`;
    case 'NOTE_REMOVED':
      return `Removed a note from contact: ${contactName}`;

    // --- Contact Task Actions ---
    case 'TASK_CREATED':
      return `Created a task for contact: ${contactName}`;
    case 'TASK_EDITED':
      return `Edited a task for contact: ${contactName}`;
    case 'TASK_REMOVED':
      return `Removed a task from contact: ${contactName}`;
    case 'TASK_COMPLETED':
      return `Completed a task for contact: ${contactName}`;
    case 'TASK_REOPENED':
      return `Reopened a task for contact: ${contactName}`;

    // --- Entity Creation/Edit/Removal ---
    case 'COMPANY_CREATED':
    case 'COMPANY_EDITED':
    case 'COMPANY_REMOVED':
      return `${action.split('_')[1].toLowerCase()} company: ${entityName}`;
    case 'GROUP_CREATED':
    case 'GROUP_EDITED':
    case 'GROUP_REMOVED':
      return `${action.split('_')[1].toLowerCase()} group: ${entityName}`;
    case 'TAG_CREATED':
    case 'TAG_EDITED':
    case 'TAG_REMOVED':
      return `${action.split('_')[1].toLowerCase()} tag: ${entityName}`;

    // --- Entity Note Actions ---
    case 'COMPANY_NOTE_CREATED':
      return `Added a note to company: ${entityName}`;
    case 'GROUP_NOTE_CREATED':
      return `Added a note to group: ${entityName}`;
    case 'TAG_NOTE_CREATED':
      return `Added a note to tag: ${entityName}`;
    // ... other entity note/task cases ...

    // --- Assignment Actions ---
    case 'COMPANY_ASSIGNED':
      return `Assigned ${contactName} to company: ${entityName}`;
    case 'COMPANY_UNASSIGNED':
      return `Unassigned ${contactName} from company: ${entityName}`;
    case 'GROUP_ASSIGNED':
      return `Assigned ${contactName} to group: ${entityName}`;
    case 'GROUP_UNASSIGNED':
      return `Unassigned ${contactName} from group: ${entityName}`;
    case 'TAG_ASSIGNED':
      return `Assigned ${contactName} to tag: ${entityName}`;
    case 'TAG_UNASSIGNED':
      return `Unassigned ${contactName} from tag: ${entityName}`;

    default:
      // A safe fallback for any unhandled actions
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
  if (!userId) {
    console.error('Activity log failed: User ID is missing.');
    return;
  }
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

export async function fetchActivities(limit = 50): Promise<ActivityLogEntry[]> {
  const { data, error } = await supabase
    .from<any, ActivityLogEntry>('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch activities:', error.message);
    return [];
  }
  return data || [];
}
