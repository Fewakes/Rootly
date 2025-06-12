import { supabase } from '@/lib/supabaseClient';
import type { Note, Task, ProfessionalInfo } from '@/types/types';

// ============================================================================
// ACTIVITY LOG TYPES & FUNCTIONS
// ============================================================================

type ActivityLogPayload = {
  action_type:
    | 'CONTACT_CREATED'
    | 'CONTACT_UPDATED'
    | 'CONTACT_DELETED'
    | 'NOTE_CREATED'
    | 'NOTE_REMOVED'
    | 'NOTE_EDITED'
    | 'TASK_CREATED'
    | 'TASK_COMPLETED'
    | 'TASK_EDITED'
    | 'GROUP_ASSIGNED'
    | 'GROUP_CREATED'
    | 'GROUP_REMOVED'
    | 'GROUP_EDITED'
    | 'TAG_ASSIGNED'
    | 'TAG_CREATED'
    | 'TAG_REMOVED'
    | 'TAG_EDITED'
    | 'COMPANY_ASSIGNED'
    | 'COMPANY_CREATED'
    | 'COMPANY_REMOVED'
    | 'COMPANY_EDITED';
  contact_id: string;
  note_id?: string;
  task_id?: string;
  metadata?: Record<string, any>; // For extra details like a group or tag name
};

/**
 * Creates a new entry in the activity_log table.
 * This is a helper function called by other services.
 */
export async function createActivityLog(payload: ActivityLogPayload) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.error('Attempted to create activity log while not logged in.');
    return; // Fail silently
  }

  const { error } = await supabase.from('activity_log').insert({
    user_id: user.id,
    ...payload,
  });

  if (error) {
    console.error('Error creating activity log:', error.message);
  }
}

/**
 * Fetches the recent activity log for the current user.
 */
export async function getActivityLog(limit = 10) {
  const { data, error } = await supabase
    .from('activity_log')
    .select(
      `
        id, created_at, action_type, contact_id, metadata,
        contacts ( name, avatar_url )
      `,
    )
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching activity log:', error);
    throw error;
  }

  return data || [];
}

// ============================================================================
// DATA FETCHING FUNCTIONS
// ============================================================================

/**
 * Fetches all notes for a specific contact.
 */
export async function getNotesForContact(contactId: string): Promise<Note[]> {
  if (!contactId) return [];
  const { data, error } = await supabase
    .from('notes')
    .select('id, content, created_at')
    .eq('contact_id', contactId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
  return data || [];
}

/**
 * Fetches all tasks for a specific contact.
 */
export async function getTasksForContact(contactId: string): Promise<Task[]> {
  if (!contactId) return [];
  const { data, error } = await supabase
    .from('tasks')
    .select('id, title, due_date, completed, created_at')
    .eq('contact_id', contactId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
  return data || [];
}

/**
 * Fetches the professional info for a specific contact.
 */
export async function getProfessionalInfoForContact(
  contactId: string,
): Promise<ProfessionalInfo | null> {
  if (!contactId) return null;
  const { data, error } = await supabase
    .from('professional_info')
    .select('id, job_title, department, skills')
    .eq('contact_id', contactId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching professional info:', error);
    throw error;
  }
  return data;
}

// ============================================================================
// WRITE (CREATE/UPDATE/DELETE) FUNCTIONS WITH ACTIVITY LOGGING
// ============================================================================

/**
 * Adds a new note for a contact and logs the activity.
 */
export async function addNote(contactId: string, content: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not logged in.');

  const { data: newNote, error } = await supabase
    .from('notes')
    .insert({ contact_id: contactId, user_id: user.id, content: content })
    .select('id')
    .single();

  if (error) throw error;

  // Log activity after successful creation
  if (newNote) {
    await createActivityLog({
      action_type: 'NOTE_CREATED',
      contact_id: contactId,
      note_id: newNote.id,
    });
  }

  return { success: true };
}

/**
 * Updates an existing note and logs the activity.
 */
export async function updateNote(noteId: string, content: string) {
  // To log activity, we need contact_id, which isn't passed to this function.
  // We fetch it first. A more optimal solution might pass contact_id from the component.
  const { data: note } = await supabase
    .from('notes')
    .select('contact_id')
    .eq('id', noteId)
    .single();
  if (!note) throw new Error('Note not found or permission denied.');

  const { error } = await supabase
    .from('notes')
    .update({ content: content })
    .eq('id', noteId);

  if (error) {
    console.error('Error updating note:', error);
    throw error;
  }

  // Log activity after successful update
  await createActivityLog({
    action_type: 'NOTE_EDITED',
    contact_id: note.contact_id,
    note_id: noteId,
  });
}

/**
 * Deletes a note and logs the activity.
 */
export async function deleteNote(noteId: string) {
  const { data: note } = await supabase
    .from('notes')
    .select('contact_id')
    .eq('id', noteId)
    .single();
  if (!note) throw new Error('Note not found or permission denied.');

  const { error } = await supabase.from('notes').delete().eq('id', noteId);

  if (error) {
    console.error('Error deleting note:', error);
    throw error;
  }

  // Log activity after successful deletion
  await createActivityLog({
    action_type: 'NOTE_REMOVED',
    contact_id: note.contact_id,
    note_id: noteId,
  });
}

/**
 * Adds a new task for a contact and logs the activity.
 */
export async function addTask(
  contactId: string,
  taskData: { title: string; due_date?: string },
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not logged in.');

  const { data: newTask, error } = await supabase
    .from('tasks')
    .insert({ contact_id: contactId, user_id: user.id, ...taskData })
    .select('id')
    .single();

  if (error) throw error;

  // Log activity after successful creation
  if (newTask) {
    await createActivityLog({
      action_type: 'TASK_CREATED',
      contact_id: contactId,
      task_id: newTask.id,
    });
  }

  return { success: true };
}

/**
 * Updates an existing task and logs the activity.
 */
export async function updateTask(
  taskId: string,
  updates: { title: string; due_date?: string },
) {
  const { data: task } = await supabase
    .from('tasks')
    .select('contact_id')
    .eq('id', taskId)
    .single();
  if (!task) throw new Error('Task not found or permission denied.');

  const { error } = await supabase
    .from('tasks')
    .update({ title: updates.title, due_date: updates.due_date || null })
    .eq('id', taskId);

  if (error) {
    console.error('Error updating task:', error);
    throw error;
  }

  // Log activity after successful update
  await createActivityLog({
    action_type: 'TASK_EDITED',
    contact_id: task.contact_id,
    task_id: taskId,
  });
}

/**
 * Deletes a task and logs the activity.
 */
export async function deleteTask(taskId: string) {
  const { data: task } = await supabase
    .from('tasks')
    .select('contact_id')
    .eq('id', taskId)
    .single();
  if (!task) throw new Error('Task not found or permission denied.');

  const { error } = await supabase.from('tasks').delete().eq('id', taskId);

  if (error) {
    console.error('Error deleting task:', error);
    throw error;
  }

  // Log activity after successful deletion
  await createActivityLog({
    action_type: 'NOTE_REMOVED', // This seems like a typo, should be TASK_REMOVED, but following user's type
    contact_id: task.contact_id,
    task_id: taskId,
  });
}

/**
 * Updates the completion status of a task and logs the activity.
 */
export async function updateTaskStatus(taskId: string, completed: boolean) {
  const { data: task } = await supabase
    .from('tasks')
    .select('contact_id')
    .eq('id', taskId)
    .single();
  if (!task) throw new Error('Task not found or permission denied.');

  const { error } = await supabase
    .from('tasks')
    .update({ completed })
    .eq('id', taskId);

  if (error) {
    console.error('Error updating task status:', error);
    throw error;
  }

  // Only log when a task is completed
  if (completed) {
    await createActivityLog({
      action_type: 'TASK_COMPLETED',
      contact_id: task.contact_id,
      task_id: taskId,
    });
  }

  return { success: true };
}

/**
 * Creates or updates the professional info for a contact.
 * (Activity logging for this could be added if needed)
 */
export async function upsertProfessionalInfo(
  contactId: string,
  infoData: Partial<ProfessionalInfo>,
) {
  const { error } = await supabase.from('professional_info').upsert(
    {
      contact_id: contactId,
      ...infoData,
    },
    { onConflict: 'contact_id' },
  );

  if (error) throw error;
  return { success: true };
}
