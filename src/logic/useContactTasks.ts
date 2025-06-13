import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import {
  getTasksForContact,
  addTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from '@/services/crm_details';

import type { Task } from '@/types/types';
import { useLogActivity } from './useLogActivity';

export function useContactTasks(contactId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!contactId) return;
    try {
      setLoading(true);
      const data = await getTasksForContact(contactId);
      setTasks(data);
    } catch {
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

const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required.'),
  due_date: z.string().optional(),
});

export function useAddTaskForm(
  contactId: string,
  contactName: string,
  onTaskAdded: () => void,
) {
  const { logActivity } = useLogActivity();

  const form = useForm<z.infer<typeof taskSchema>>({
    mode: 'onSubmit',
    resolver: zodResolver(taskSchema),
    defaultValues: { title: '', due_date: '' },
  });

  const onSubmit = async (data: z.infer<typeof taskSchema>) => {
    try {
      const newTask = await addTask(contactId, data);
      toast.success('Task added!');
      logActivity('TASK_CREATED', 'Task', newTask.id, {
        title: data.title,
        due_date: data.due_date,
        contactName,
      });
      form.reset();
      onTaskAdded();
    } catch {
      toast.error('Failed to add task.');
    }
  };

  return { form, onSubmit };
}

export function useUpdateTaskForm(
  taskId: string | null,
  contactName: string,
  onSuccess: () => void,
) {
  const { logActivity } = useLogActivity();

  const form = useForm<z.infer<typeof taskSchema>>({
    mode: 'onSubmit',
    resolver: zodResolver(taskSchema),
    defaultValues: { title: '', due_date: '' },
  });

  const onSubmit = async (data: z.infer<typeof taskSchema>) => {
    if (!taskId) return;
    try {
      await updateTask(taskId, data);
      toast.success('Task updated!');
      logActivity('TASK_EDITED', 'Task', taskId, {
        title: data.title,
        due_date: data.due_date,
        contactName,
      });
      onSuccess();
    } catch {
      toast.error('Failed to update task.');
    }
  };

  return { form, onSubmit };
}

export function useDeleteTask(contactName: string, onSuccess: () => void) {
  const { logActivity } = useLogActivity();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteTaskMutation = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setIsDeleting(true);
    try {
      await deleteTask(taskId);
      toast.success('Task deleted.');
      logActivity('TASK_REMOVED', 'Task', taskId, { contactName });
      onSuccess();
    } catch {
      toast.error('Failed to delete task.');
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteTask: deleteTaskMutation, isDeleting };
}

export function useUpdateTaskStatus(contactName: string) {
  const { logActivity } = useLogActivity();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStatus = async (taskId: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      // Convert string status to boolean for updateTaskStatus
      const completed = newStatus === 'completed';
      await updateTaskStatus(taskId, completed);

      toast.success(
        newStatus === 'completed'
          ? 'Task completed!'
          : 'Task marked as incomplete.',
      );

      logActivity(
        newStatus === 'completed' ? 'TASK_COMPLETED' : 'TASK_REOPENED',
        'Task',
        taskId,
        { contactName },
      );
    } catch {
      toast.error('Failed to update task status.');
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateStatus, isUpdating };
}
