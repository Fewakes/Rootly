import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  getNotesForContact,
  updateNote as apiUpdateNote,
  deleteNote as apiDeleteNote,
  addNote as apiAddNote,
} from '@/services/crm_details';
import type { Note } from '@/types/types';
import { useLogActivity } from './useLogActivity';

export const noteSchema = z.object({
  content: z
    .string()
    .min(1, 'Note cannot be empty.')
    .max(80, 'Note cannot exceed 80 characters.'),
});

export function useContactNotes(contactId: string | undefined) {
  const [notes, setNotes] = useState<Note[]>([]);
  const { logActivity } = useLogActivity();

  const fetchNotes = useCallback(async () => {
    if (!contactId) {
      setNotes([]);
      return;
    }
    try {
      const data = await getNotesForContact(contactId);
      setNotes(
        (data || []).sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        ),
      );
    } catch (error) {
      toast.error('Failed to load notes.');
      console.error(error);
    }
  }, [contactId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const addNote = async (contactName: string, content: string) => {
    if (!contactId) throw new Error('Contact ID is missing.');
    try {
      const newNote = await apiAddNote(contactId, content);
      logActivity('NOTE_CREATED', 'Note', newNote.id, { content, contactName });
      toast.success('Note added!');
      await fetchNotes();
    } catch (error) {
      toast.error('Failed to add note.');
      console.error(error);
      throw error;
    }
  };

  const updateNote = async (
    noteId: string,
    contactName: string,
    content: string,
  ) => {
    if (!noteId) throw new Error('Note ID is missing.');
    try {
      await apiUpdateNote(noteId, content);
      logActivity('NOTE_EDITED', 'Note', noteId, { content, contactName });
      toast.success('Note updated!');
      await fetchNotes();
    } catch (error) {
      toast.error('Failed to update note.');
      console.error(error);
      throw error;
    }
  };

  const deleteNote = async (noteId: string, contactName: string) => {
    if (!noteId) throw new Error('Note ID is missing.');
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await apiDeleteNote(noteId);
      logActivity('NOTE_REMOVED', 'Note', noteId, { contactName });
      toast.success('Note deleted.');
      await fetchNotes();
    } catch (error) {
      toast.error('Failed to delete note.');
      console.error(error);
      throw error;
    }
  };

  return { notes, addNote, updateNote, deleteNote };
}
