import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  getNotesForContact,
  getTasksForContact,
  getProfessionalInfoForContact,
  addNote,
  updateNote,
  deleteNote,
  addTask,
  updateTask,
  deleteTask,
  upsertProfessionalInfo,
  updateTaskStatus,
} from '@/services/crm_details';
import type { Note, Task, ProfessionalInfo } from '@/types/types';

// ============================================================================
// DATA FETCHING HOOKS
// ============================================================================

export function useContactNotes(contactId: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    if (!contactId) return;
    try {
      setLoading(true);
      const data = await getNotesForContact(contactId);
      setNotes(data);
    } catch (error) {
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

export function useContactTasks(contactId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!contactId) return;
    try {
      setLoading(true);
      const data = await getTasksForContact(contactId);
      setTasks(data);
    } catch (error) {
      toast.error('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [contactId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, refetch: fetchTasks };
}

export function useContactProfessionalInfo(contactId: string) {
  const [info, setInfo] = useState<ProfessionalInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchInfo = useCallback(async () => {
    if (!contactId) return;
    try {
      setLoading(true);
      const data = await getProfessionalInfoForContact(contactId);
      setInfo(data);
    } catch (error) {
      toast.error('Failed to load professional info.');
    } finally {
      setLoading(false);
    }
  }, [contactId]);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);

  return { info, loading, refetch: fetchInfo };
}

// ============================================================================
// FORM & MUTATION HOOKS
// ============================================================================

// --- Note Schemas and Hooks ---
const noteSchema = z.object({
  content: z.string().min(1, 'Note cannot be empty.'),
});

export function useAddNoteForm(contactId: string, onNoteAdded: () => void) {
  const form = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: { content: '' },
  });

  const onSubmit = async (data: z.infer<typeof noteSchema>) => {
    try {
      await addNote(contactId, data.content);
      toast.success('Note added!');
      form.reset();
      onNoteAdded();
    } catch (error) {
      toast.error('Failed to add note.');
    }
  };

  return { form, onSubmit };
}

export function useUpdateNoteForm(
  noteId: string | null,
  onNoteUpdated: () => void,
) {
  const form = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: { content: '' },
  });

  const onSubmit = async (data: z.infer<typeof noteSchema>) => {
    if (!noteId) return;
    try {
      await updateNote(noteId, data.content);
      toast.success('Note updated!');
      onNoteUpdated();
    } catch (error) {
      toast.error('Failed to update note.');
    }
  };

  return { form, onSubmit };
}

export function useDeleteNote(onSuccess: () => void) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteNoteMutation = async (noteId: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    setIsDeleting(true);
    try {
      await deleteNote(noteId);
      toast.success('Note deleted.');
      onSuccess();
    } catch (error) {
      toast.error('Failed to delete note.');
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteNote: deleteNoteMutation, isDeleting };
}

// --- Task Schemas and Hooks ---
const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required.'),
  due_date: z.string().optional(),
});

export function useAddTaskForm(contactId: string, onTaskAdded: () => void) {
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: '', due_date: '' },
  });

  const onSubmit = async (data: z.infer<typeof taskSchema>) => {
    try {
      await addTask(contactId, data);
      toast.success('Task added!');
      form.reset();
      onTaskAdded();
    } catch (error) {
      toast.error('Failed to add task.');
    }
  };
  return { form, onSubmit };
}

export function useUpdateTaskForm(
  taskId: string | null,
  onSuccess: () => void,
) {
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: '', due_date: '' },
  });

  const onSubmit = async (data: z.infer<typeof taskSchema>) => {
    if (!taskId) return;
    try {
      await updateTask(taskId, data);
      toast.success('Task updated!');
      onSuccess();
    } catch (error) {
      toast.error('Failed to update task.');
    }
  };

  return { form, onSubmit };
}

export function useDeleteTask(onSuccess: () => void) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteTaskMutation = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setIsDeleting(true);
    try {
      await deleteTask(taskId);
      toast.success('Task deleted.');
      onSuccess();
    } catch (error) {
      toast.error('Failed to delete task.');
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteTask: deleteTaskMutation, isDeleting };
}

export function useUpdateTaskStatus() {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStatus = async (
    taskId: string,
    newStatus: boolean,
    onSuccess: () => void,
  ) => {
    setIsUpdating(true);
    try {
      await updateTaskStatus(taskId, newStatus);
      toast.success(
        newStatus ? 'Task completed!' : 'Task marked as incomplete.',
      );
      onSuccess();
    } catch (error) {
      toast.error('Failed to update task status.');
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateStatus, isUpdating };
}

// --- Professional Info Hooks ---
const professionalInfoSchema = z.object({
  job_title: z.string().optional(),
  department: z.string().optional(),
  skills: z.string().transform(val =>
    val
      .split(',')
      .map(s => s.trim())
      .filter(Boolean),
  ),
});

export function useProfessionalInfoForm(
  contactId: string,
  initialData: ProfessionalInfo | null,
  onInfoUpdated: () => void,
) {
  const form = useForm({
    resolver: zodResolver(professionalInfoSchema),
    defaultValues: {
      job_title: '',
      department: '',
      skills: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        job_title: initialData.job_title || '',
        department: initialData.department || '',
        skills: initialData.skills?.join(', ') || '',
      });
    }
  }, [initialData, form.reset]);

  const onSubmit = async (data: any) => {
    try {
      await upsertProfessionalInfo(contactId, data);
      toast.success('Professional info updated!');
      onInfoUpdated();
    } catch (error) {
      toast.error('Failed to update info.');
    }
  };
  return { form, onSubmit };
}
