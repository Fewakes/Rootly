import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import {
  getNotesForContact,
  updateNote,
  deleteNote,
  addNote,
} from '@/services/crm_details';

import type { Note } from '@/types/types';
import { useLogActivity } from './useLogActivity';

export function useContactNotes(contactId: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    if (!contactId) return;
    try {
      setLoading(true);
      const data = await getNotesForContact(contactId);
      setNotes(data);
    } catch {
      toast.error('Failed to load notes.');
    } finally {
      setLoading(false);
    }
  }, [contactId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return { notes, loading, refetch: fetchNotes };
}

const noteSchema = z.object({
  content: z.string().min(1, 'Note cannot be empty.'),
});

export function useAddNoteForm(
  contactId: string,
  contactName: string,
  onNoteAdded: () => Promise<void>,
) {
  const { logActivity } = useLogActivity();

  const form = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: { content: '' },
  });

  const onSubmit = async (data: z.infer<typeof noteSchema>) => {
    try {
      const newNote = await addNote(contactId, data.content);
      toast.success('Note added!');
      logActivity('NOTE_CREATED', 'Note', newNote.id, {
        content: data.content,
        contactName,
      });
      form.reset();
      await onNoteAdded(); // Await here
    } catch {
      toast.error('Failed to add note.');
    }
  };

  return { form, onSubmit };
}

export function useUpdateNoteForm(
  noteId: string | null,
  contactName: string,
  onNoteUpdated: () => Promise<void>,
) {
  const { logActivity } = useLogActivity();

  const form = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: { content: '' },
  });

  const onSubmit = async (data: z.infer<typeof noteSchema>) => {
    if (!noteId) return;
    try {
      await updateNote(noteId, data.content);
      toast.success('Note updated!');
      logActivity('NOTE_EDITED', 'Note', noteId, {
        content: data.content,
        contactName,
      });
      await onNoteUpdated(); // Await here
    } catch {
      toast.error('Failed to update note.');
    }
  };

  return { form, onSubmit };
}

export function useDeleteNote(
  contactName: string,
  onSuccess: () => Promise<void>,
) {
  const { logActivity } = useLogActivity();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteNoteMutation = async (noteId: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    setIsDeleting(true);
    try {
      await deleteNote(noteId);
      toast.success('Note deleted.');
      logActivity('NOTE_REMOVED', 'Note', noteId, { contactName });
      await onSuccess(); // Await here
    } catch {
      toast.error('Failed to delete note.');
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteNote: deleteNoteMutation, isDeleting };
}
