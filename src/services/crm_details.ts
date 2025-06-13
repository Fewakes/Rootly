import { supabase } from '@/lib/supabaseClient';
import type { Note, Task, ProfessionalInfo } from '@/types/types';

// ======================================================
// FETCH FUNCTIONS
// ======================================================

export async function getNotesForContact(contactId: string): Promise<Note[]> {
  if (!contactId) return [];

  const { data, error } = await supabase
    .from('notes')
    .select('id, content, created_at')
    .eq('contact_id', contactId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Error fetching notes: ${error.message}`);
  return data || [];
}

export async function getTasksForContact(contactId: string): Promise<Task[]> {
  if (!contactId) return [];

  const { data, error } = await supabase
    .from('tasks')
    .select('id, title, due_date, completed, created_at')
    .eq('contact_id', contactId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Error fetching tasks: ${error.message}`);
  return data || [];
}

export async function getProfessionalInfoForContact(
  contactId: string,
): Promise<ProfessionalInfo | null> {
  if (!contactId) return null;

  const { data, error } = await supabase
    .from('professional_info')
    .select('id, job_title, department, skills')
    .eq('contact_id', contactId)
    .single();

  if (error && error.code !== 'PGRST116')
    throw new Error(`Error fetching professional info: ${error.message}`);
  return data;
}

// ======================================================
// NOTE FUNCTIONS
// ======================================================

export async function addNote(contactId: string, content: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('User not logged in.');

  const { data: newNote, error } = await supabase
    .from('notes')
    .insert({ contact_id: contactId, user_id: user.id, content })
    .select('*')
    .single();

  if (error) throw new Error(`Error adding note: ${error.message}`);
  return newNote;
}

export async function updateNote(noteId: string, content: string) {
  const { data: note } = await supabase
    .from('notes')
    .select('contact_id')
    .eq('id', noteId)
    .single();

  if (!note) throw new Error('Note not found or permission denied.');

  const { error } = await supabase
    .from('notes')
    .update({ content })
    .eq('id', noteId);

  if (error) throw new Error(`Error updating note: ${error.message}`);
}

export async function deleteNote(noteId: string) {
  const { data: note } = await supabase
    .from('notes')
    .select('contact_id')
    .eq('id', noteId)
    .single();

  if (!note) throw new Error('Note not found or permission denied.');

  const { error } = await supabase.from('notes').delete().eq('id', noteId);
  if (error) throw new Error(`Error deleting note: ${error.message}`);
}

// ======================================================
// TASK FUNCTIONS
// ======================================================

export async function addTask(
  contactId: string,
  taskData: { title: string; due_date?: string },
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('User not logged in.');

  const { error } = await supabase
    .from('tasks')
    .insert({ contact_id: contactId, user_id: user.id, ...taskData });

  if (error) throw new Error(`Error adding task: ${error.message}`);
  return { success: true };
}

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

  if (error) throw new Error(`Error updating task: ${error.message}`);
}

export async function deleteTask(taskId: string) {
  const { data: task } = await supabase
    .from('tasks')
    .select('contact_id')
    .eq('id', taskId)
    .single();

  if (!task) throw new Error('Task not found or permission denied.');

  const { error } = await supabase.from('tasks').delete().eq('id', taskId);
  if (error) throw new Error(`Error deleting task: ${error.message}`);
}

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

  if (error) throw new Error(`Error updating task status: ${error.message}`);
  return { success: true };
}

// ======================================================
// PROFESSIONAL INFO FUNCTIONS
// ======================================================

export async function upsertProfessionalInfo(
  contactId: string,
  infoData: Partial<ProfessionalInfo>,
) {
  const { error } = await supabase
    .from('professional_info')
    .upsert(
      { contact_id: contactId, ...infoData },
      { onConflict: 'contact_id' },
    );

  if (error)
    throw new Error(`Error upserting professional info: ${error.message}`);
  return { success: true };
}
