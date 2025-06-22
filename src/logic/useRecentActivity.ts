import { useMemo } from 'react';
import type { Note, Task } from '@/types/types';

export type ActivityItem = {
  id: string;
  type: 'note' | 'task';
  content: string;
  date: Date;
  status?: 'completed' | 'pending';
  due_date?: Date;
};

export const useRecentActivity = (
  notes: Note[],
  tasks: Task[],
): ActivityItem[] => {
  const activity = useMemo<ActivityItem[]>(() => {
    if (!notes || !tasks) return [];

    const mappedNotes: ActivityItem[] = notes.map(note => ({
      id: `note-${note.id}`,
      type: 'note',
      content: note.content,
      date: new Date(note.created_at),
    }));

    const mappedTasks: ActivityItem[] = tasks.map(task => ({
      id: `task-${task.id}`,
      type: 'task',
      content: task.title,
      date: new Date(task.created_at),
      status: task.completed ? 'completed' : 'pending',
      due_date: task.due_date ? new Date(task.due_date) : undefined,
    }));

    const allActivity = [...mappedNotes, ...mappedTasks];
    allActivity.sort((a, b) => b.date.getTime() - a.date.getTime());

    return allActivity;
  }, [notes, tasks]);

  return activity;
};
