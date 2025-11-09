import { useState, useMemo } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { MessageSquare, CheckCircle, Pencil, Trash2, CalendarIcon } from 'lucide-react';
import type { ActivityItem } from '@/logic/useRecentActivity';
import { taskSchema } from '@/logic/useContactTasks';

type RecentActivityCardProps = {
  activity: ActivityItem[];
  contactName: string;
  updateNote: (
    noteId: string,
    contactName: string,
    content: string,
  ) => Promise<void>;
  deleteNote: (noteId: string, contactName: string) => Promise<void>;
  updateTask: (
    taskId: string,
    contactName: string,
    data: z.infer<typeof taskSchema>,
  ) => Promise<void>;
  deleteTask: (taskId: string, contactName: string) => Promise<void>;
  updateTaskStatus: (
    taskId: string,
    contactName: string,
    completed: boolean,
  ) => Promise<void>;
};

export function RecentActivityCard({
  activity,
  contactName,
  updateNote,
  deleteNote,
  updateTask,
  deleteTask,
  updateTaskStatus,
}: RecentActivityCardProps) {
  const [editingNote, setEditingNote] = useState<{
    id: string;
    content: string;
  } | null>(null);
  const [editingTask, setEditingTask] = useState<{
    id: string;
    title: string;
    due_date?: Date;
  } | null>(null);
  const [filter, setFilter] = useState<'all' | 'notes' | 'tasks'>('all');

  const filteredActivity = useMemo(() => {
    if (filter === 'all') return activity;
    return activity.filter(item =>
      filter === 'notes' ? item.type === 'note' : item.type === 'task',
    );
  }, [activity, filter]);

  const handleSaveNote = async () => {
    if (!editingNote) return;
    try {
      await updateNote(editingNote.id, contactName, editingNote.content);
      setEditingNote(null);
    } catch (error) {
      toast.error('Failed to save note.');
    }
  };

  const handleSaveTask = async () => {
    if (!editingTask || !editingTask.title || !editingTask.due_date) {
      toast.error('Task title and due date are required.');
      return;
    }
    try {
      await updateTask(editingTask.id, contactName, {
        title: editingTask.title,
        due_date: editingTask.due_date,
      });
      setEditingTask(null);
    } catch (error) {
      toast.error('Failed to save task.');
    }
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle>Notes & tasks</CardTitle>
          <CardDescription>
            Review everything logged against {contactName} and keep items current.
          </CardDescription>
        </div>
        <Tabs value={filter} onValueChange={value => setFilter(value as any)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 overflow-hidden">
        <div className="space-y-3 overflow-y-auto pr-1" style={{ maxHeight: '32rem' }}>
          {filteredActivity.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No {filter !== 'all' ? filter : ''} activity yet.
            </p>
          )}

          {filteredActivity.map(item => {
            const originalId = item.id.replace(/^(note|task)-/, '');
            const isEditingNote = editingNote?.id === originalId;
            const isEditingTask = editingTask?.id === originalId;

            return (
              <div key={item.id} className="rounded-lg border bg-muted/20 p-4">
                <div className="mb-2 flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-foreground">
                    {item.type === 'note' ? (
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                    ) : (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  <span className="capitalize">{item.type}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span>{format(item.date, 'd MMM, yyyy')}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={() =>
                      item.type === 'note'
                        ? setEditingNote({
                            id: originalId,
                            content: item.content,
                          })
                        : setEditingTask({
                            id: originalId,
                            title: item.content,
                            due_date: item.due_date,
                          })
                    }
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive/70 hover:text-destructive"
                    onClick={() =>
                      item.type === 'note'
                        ? deleteNote(originalId, contactName)
                        : deleteTask(originalId, contactName)
                    }
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              </div>

              <div className="text-sm">
                {item.type === 'note' &&
                  (isEditingNote ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editingNote.content}
                        onChange={e =>
                          setEditingNote({
                            ...editingNote,
                            content: e.target.value,
                          })
                        }
                        autoFocus
                      />
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingNote(null)}
                        >
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveNote}>
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {item.content}
                    </p>
                  ))}

                {item.type === 'task' &&
                  (isEditingTask ? (
                    <div className="space-y-2">
                      <Input
                        value={editingTask.title}
                        onChange={e =>
                          setEditingTask({
                            ...editingTask,
                            title: e.target.value,
                          })
                        }
                        autoFocus
                      />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !editingTask.due_date && 'text-muted-foreground',
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {editingTask.due_date
                              ? format(editingTask.due_date, 'PPP')
                              : 'Pick a due date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <DayPicker
                            mode="single"
                            selected={editingTask.due_date}
                            onSelect={date =>
                              setEditingTask({
                                ...editingTask,
                                due_date: date || undefined,
                              })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingTask(null)}
                        >
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveTask}>
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={item.id}
                          checked={item.status === 'completed'}
                          onChange={() =>
                            updateTaskStatus(
                              originalId,
                              contactName,
                              item.status === 'pending',
                            )
                          }
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <label
                          htmlFor={item.id}
                          className={cn(
                            'cursor-pointer',
                            item.status === 'completed' &&
                              'line-through text-muted-foreground',
                          )}
                        >
                          {item.content}
                        </label>
                      </div>
                      {item.status === 'pending' && item.due_date && (
                        <Badge
                          variant="secondary"
                          className={cn(
                            new Date() > item.due_date
                              ? 'bg-destructive/10 text-destructive border-destructive/20'
                              : '',
                          )}
                        >
                          Due {format(item.due_date, 'd MMM')}
                        </Badge>
                      )}
                    </div>
                  ))}
              </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
