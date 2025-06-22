import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  getTasksForContact,
  addTask as apiAddTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
  updateTaskStatus as apiUpdateTaskStatus,
} from '@/services/crm_details';
import type { Task } from '@/types/types';
import { useLogActivity } from './useLogActivity';

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required.')
    .max(70, 'Task cannot exceed 70 characters.'),
  due_date: z.date({ required_error: 'A due date is required.' }),
});

export function useContactTasks(contactId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { logActivity } = useLogActivity();

  const fetchTasks = useCallback(async () => {
    if (!contactId) {
      setTasks([]);
      return;
    }
    try {
      const data = await getTasksForContact(contactId);
      setTasks(
        (data || []).sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        ),
      );
    } catch (error) {
      toast.error('Failed to load tasks.');
      console.error(error);
    }
  }, [contactId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (
    contactName: string,
    data: z.infer<typeof taskSchema>,
  ) => {
    if (!contactId) throw new Error('Contact ID is missing.');
    try {
      const { title, due_date } = data;
      const utcDate = new Date(
        Date.UTC(
          due_date.getFullYear(),
          due_date.getMonth(),
          due_date.getDate(),
        ),
      );
      const payload = { title, due_date: utcDate.toISOString() };
      const newResponse = await apiAddTask(contactId, payload);
      logActivity('TASK_CREATED', 'Task', newResponse.id, {
        ...payload,
        contactName,
      });
      toast.success('Task added!');
      await fetchTasks();
    } catch (error) {
      toast.error('Failed to add task.');
      console.error('Add Task Error:', error);
      throw error;
    }
  };

  const updateTask = async (
    taskId: string,
    contactName: string,
    data: z.infer<typeof taskSchema>,
  ) => {
    if (!taskId) throw new Error('Update failed: Task ID is missing.');
    try {
      const { title, due_date } = data;
      const utcDate = new Date(
        Date.UTC(
          due_date.getFullYear(),
          due_date.getMonth(),
          due_date.getDate(),
        ),
      );
      const payload = { title, due_date: utcDate.toISOString() };
      await apiUpdateTask(taskId, payload);
      logActivity('TASK_EDITED', 'Task', taskId, { ...payload, contactName });
      toast.success('Task updated!');
      await fetchTasks();
    } catch (error) {
      toast.error('Failed to update task.');
      console.error('Update Task Error:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId: string, contactName: string) => {
    if (!taskId) throw new Error('Delete failed: Task ID is missing.');
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await apiDeleteTask(taskId);
      logActivity('TASK_REMOVED', 'Task', taskId, { contactName });
      toast.success('Task deleted.');
      await fetchTasks();
    } catch (error) {
      toast.error('Failed to delete task.');
      console.error('Delete Task Error:', error);
      throw error;
    }
  };

  const updateTaskStatus = async (
    taskId: string,
    contactName: string,
    completed: boolean,
  ) => {
    if (!taskId) throw new Error('Status update failed: Task ID is missing.');
    try {
      await apiUpdateTaskStatus(taskId, completed);
      const eventType = completed ? 'TASK_COMPLETED' : 'TASK_REOPENED';
      logActivity(eventType, 'Task', taskId, { contactName });
      toast.success(`Task marked as ${completed ? 'complete' : 'incomplete'}.`);
      await fetchTasks();
    } catch (error) {
      toast.error('Failed to update status.');
      console.error('Update Status Error:', error);
      throw error;
    }
  };

  return { tasks, addTask, updateTask, deleteTask, updateTaskStatus };
}
