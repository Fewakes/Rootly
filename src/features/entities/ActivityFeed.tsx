// src/features/entities/ActivityFeed.tsx

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import {
  Pencil,
  PlusCircle,
  Trash2,
  Calendar as CalendarIcon,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import EntityEmptyState from '@/features/entities/EntityEmptyState';
import { useLogActivity } from '@/logic/useLogActivity';
import type { Note, Task, UserProfile } from '@/types/types';

// The component now accepts the services it needs to call directly.
type ActivityService<T> = {
  create: (data: Partial<T>) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<any>;
  deleteById: (id: string) => Promise<void>;
};

type ActivityFeedProps = {
  entityId: string;
  entityName: string;
  entityType: 'company' | 'tag' | 'group';
  userId: string;
  user: UserProfile | null;
  notes: Note[];
  tasks: Task[];
  isLoading: boolean;
  refetchNotes: () => Promise<void>;
  refetchTasks: () => Promise<void>;
  notesService: ActivityService<Note & { [key: string]: string }>;
  tasksService: ActivityService<Task & { [key: string]: string }>;
};

const INITIAL_ITEM_COUNT = 3;

export function ActivityFeed({
  entityId,
  entityName,
  entityType,
  userId,
  user,
  notes,
  tasks,
  isLoading,
  refetchNotes,
  refetchTasks,
  notesService,
  tasksService,
}: ActivityFeedProps) {
  // All state and handlers are now self-contained in this component.
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | undefined>();
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [tasksExpanded, setTasksExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { logActivity } = useLogActivity();
  const displayedNotes = notesExpanded
    ? notes
    : notes.slice(0, INITIAL_ITEM_COUNT);
  const displayedTasks = tasksExpanded
    ? tasks
    : tasks.slice(0, INITIAL_ITEM_COUNT);
  const entityIdKey = `${entityType}_id`;
  const entityNameKey = `${entityType}Name`;

  const handleAddNote = useCallback(async () => {
    if (!newNoteContent.trim()) return;
    setIsSubmitting(true);
    try {
      const newNote = await notesService.create({
        content: newNoteContent,
        [entityIdKey]: entityId,
        user_id: userId,
      });
      logActivity(
        `${entityType.toUpperCase()}_NOTE_CREATED`,
        'Note',
        newNote.id,
        { [entityNameKey]: entityName },
      );
      toast.success('Note Added');
      setNewNoteContent('');
      await refetchNotes();
    } catch (e) {
      toast.error('Failed to add note.');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    newNoteContent,
    entityId,
    userId,
    refetchNotes,
    notesService,
    entityIdKey,
    logActivity,
    entityName,
    entityType,
    entityNameKey,
  ]);

  const handleUpdateNote = useCallback(async () => {
    if (!editingNote) return;
    setIsSubmitting(true);
    try {
      await notesService.update(editingNote.id, {
        content: editingNote.content,
      });
      logActivity(
        `${entityType.toUpperCase()}_NOTE_EDITED`,
        'Note',
        editingNote.id,
        { [entityNameKey]: entityName },
      );
      toast.success('Note Updated');
      setEditingNote(null);
      await refetchNotes();
    } catch (e) {
      toast.error('Failed to update note.');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    editingNote,
    refetchNotes,
    notesService,
    logActivity,
    entityName,
    entityType,
    entityNameKey,
  ]);

  const handleDeleteNote = useCallback(
    async (noteId: string) => {
      if (!window.confirm('Are you sure you want to delete this note?')) return;
      await notesService.deleteById(noteId);
      logActivity(`${entityType.toUpperCase()}_NOTE_REMOVED`, 'Note', noteId, {
        [entityNameKey]: entityName,
      });
      toast.error('Note Deleted');
      await refetchNotes();
    },
    [
      refetchNotes,
      notesService,
      logActivity,
      entityName,
      entityType,
      entityNameKey,
    ],
  );

  const handleAddTask = useCallback(async () => {
    if (!newTaskTitle.trim() || !newTaskDueDate) {
      toast.error('Title and due date are required.');
      return;
    }
    setIsSubmitting(true);
    try {
      const newTask = await tasksService.create({
        title: newTaskTitle,
        due_date: newTaskDueDate,
        [entityIdKey]: entityId,
        user_id: userId,
        completed: false,
      });
      logActivity(
        `${entityType.toUpperCase()}_TASK_CREATED`,
        'Task',
        newTask.id,
        { [entityNameKey]: entityName, title: newTaskTitle },
      );
      toast.success('Task Added');
      setNewTaskTitle('');
      setNewTaskDueDate(undefined);
      await refetchTasks();
    } catch (e) {
      toast.error('Failed to add task.');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    newTaskTitle,
    newTaskDueDate,
    entityId,
    userId,
    refetchTasks,
    tasksService,
    entityIdKey,
    logActivity,
    entityName,
    entityType,
    entityNameKey,
  ]);

  const handleUpdateTask = useCallback(async () => {
    if (!editingTask || !editingTask.title || !editingTask.due_date) {
      toast.error('Title and due date are required.');
      return;
    }
    setIsSubmitting(true);
    try {
      await tasksService.update(editingTask.id, {
        title: editingTask.title,
        due_date: new Date(editingTask.due_date),
      });
      logActivity(
        `${entityType.toUpperCase()}_TASK_EDITED`,
        'Task',
        editingTask.id,
        { [entityNameKey]: entityName, title: editingTask.title },
      );
      toast.success('Task updated.');
      setEditingTask(null);
      await refetchTasks();
    } catch (e) {
      toast.error('Failed to update task.');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    editingTask,
    refetchTasks,
    tasksService,
    logActivity,
    entityName,
    entityType,
    entityNameKey,
  ]);

  const handleToggleTask = useCallback(
    async (task: Task) => {
      const isNowComplete = !task.completed;
      await tasksService.update(task.id, { completed: isNowComplete });
      const action = `${entityType.toUpperCase()}_TASK_${isNowComplete ? 'COMPLETED' : 'REOPENED'}`;
      logActivity(action, 'Task', task.id, { [entityNameKey]: entityName });
      toast.success(
        `Task marked as ${isNowComplete ? 'complete' : 'incomplete'}.`,
      );
      await refetchTasks();
    },
    [
      refetchTasks,
      tasksService,
      logActivity,
      entityName,
      entityType,
      entityNameKey,
    ],
  );

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      if (!window.confirm('Are you sure you want to delete this task?')) return;
      await tasksService.deleteById(taskId);
      logActivity(`${entityType.toUpperCase()}_TASK_REMOVED`, 'Task', taskId, {
        [entityNameKey]: entityName,
      });
      toast.error('Task Deleted');
      await refetchTasks();
    },
    [
      refetchTasks,
      tasksService,
      logActivity,
      entityName,
      entityType,
      entityNameKey,
    ],
  );

  return (
    <Card className="flex-1 flex flex-col">
      <Tabs defaultValue="notes" className="w-full h-full flex flex-col">
        <CardHeader className="flex-row items-center justify-between p-4 border-b">
          <CardTitle className="text-lg">Activity</CardTitle>
          <TabsList className="grid grid-cols-2 w-auto">
            <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
            <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-hidden">
          <TabsContent value="notes" className="h-full flex flex-col p-4 gap-3">
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {isLoading ? (
                <p>Loading...</p>
              ) : displayedNotes.length > 0 ? (
                displayedNotes.map(note => (
                  <div
                    key={note.id}
                    className="group relative bg-muted/50 p-3 rounded-lg text-sm"
                  >
                    {editingNote?.id === note.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editingNote.content}
                          onChange={e =>
                            setEditingNote({
                              ...editingNote,
                              content: e.target.value,
                            })
                          }
                          className="flex min-h-[60px] w-full rounded-md border"
                          rows={3}
                          autoFocus
                        />
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingNote(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleUpdateNote}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              'Save'
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-muted-foreground whitespace-pre-wrap break-words mr-10">
                          {note.content}
                        </p>
                        <p className="text-xs text-right mt-2">
                          - {user?.fullName || '...'},{' '}
                          {format(new Date(note.created_at), 'd MMM, p')}
                        </p>
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setEditingNote(note)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDeleteNote(note.id)}
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                !isLoading && (
                  <EntityEmptyState message="No notes yet." isCompact={true} />
                )
              )}
            </div>
            {notes.length > INITIAL_ITEM_COUNT && (
              <div className="mt-2">
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm"
                  onClick={() => setNotesExpanded(!notesExpanded)}
                >
                  {notesExpanded
                    ? 'Show less'
                    : `View all ${notes.length} notes...`}
                </Button>
              </div>
            )}
            <div className="pt-2 border-t space-y-2 mt-auto">
              <div className="flex gap-2">
                <Input
                  value={newNoteContent}
                  onChange={e => setNewNoteContent(e.target.value)}
                  placeholder="Add a new note..."
                  maxLength={80}
                />
                <Button
                  onClick={handleAddNote}
                  size="icon"
                  className="shrink-0"
                  disabled={isSubmitting}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              <p
                className={cn(
                  'text-xs text-right pr-1',
                  newNoteContent.length > 70
                    ? 'text-destructive'
                    : 'text-muted-foreground',
                )}
              >
                {80 - newNoteContent.length} characters remaining
              </p>
            </div>
          </TabsContent>
          <TabsContent value="tasks" className="h-full flex flex-col p-4 gap-3">
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {isLoading ? (
                <p>Loading...</p>
              ) : displayedTasks.length > 0 ? (
                displayedTasks.map(task => (
                  <div
                    key={task.id}
                    className="group flex items-center gap-3 text-sm p-2 rounded-md hover:bg-muted"
                  >
                    {editingTask?.id === task.id ? (
                      <div className="w-full space-y-2">
                        <Input
                          value={editingTask.title}
                          onChange={e =>
                            setEditingTask({
                              ...editingTask,
                              title: e.target.value,
                            })
                          }
                          className="text-sm h-8"
                          autoFocus
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={'outline'}
                              size="sm"
                              className={cn(
                                'w-full h-8 justify-start text-left font-normal',
                                !editingTask.due_date &&
                                  'text-muted-foreground',
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {editingTask.due_date
                                ? format(new Date(editingTask.due_date), 'PPP')
                                : 'Set Due Date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <DayPicker
                              mode="single"
                              selected={
                                editingTask.due_date
                                  ? new Date(editingTask.due_date)
                                  : undefined
                              }
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
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingTask(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleUpdateTask}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              'Save'
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <input
                          type="checkbox"
                          id={`task-${task.id}`}
                          checked={task.completed}
                          onChange={() => handleToggleTask(task)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <label
                          htmlFor={`task-${task.id}`}
                          title={task.title}
                          className={cn(
                            'flex-1 min-w-0 cursor-pointer break-words',
                            task.completed &&
                              'line-through text-muted-foreground',
                          )}
                        >
                          {task.title}
                        </label>
                        {task.due_date && (
                          <Badge
                            variant={
                              new Date(task.due_date) < new Date() &&
                              !task.completed
                                ? 'destructive'
                                : 'secondary'
                            }
                            className="shrink-0"
                          >
                            {format(new Date(task.due_date), 'd MMM')}
                          </Badge>
                        )}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setEditingTask(task)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                !isLoading && (
                  <EntityEmptyState message="No tasks yet." isCompact={true} />
                )
              )}
            </div>
            {tasks.length > INITIAL_ITEM_COUNT && (
              <div className="mt-2">
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm"
                  onClick={() => setTasksExpanded(!tasksExpanded)}
                >
                  {tasksExpanded
                    ? 'Show less'
                    : `View all ${tasks.length} tasks...`}
                </Button>
              </div>
            )}
            <div className="pt-2 border-t space-y-2 mt-auto">
              <div className="flex gap-2">
                <Input
                  value={newTaskTitle}
                  maxLength={70}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  placeholder="Add a new task..."
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[200px] justify-start text-left font-normal shrink-0',
                        !newTaskDueDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newTaskDueDate
                        ? format(newTaskDueDate, 'PPP')
                        : 'Pick a due date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <DayPicker
                      mode="single"
                      selected={newTaskDueDate}
                      onSelect={setNewTaskDueDate}
                      disabled={{ before: new Date() }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Button
                  onClick={handleAddTask}
                  size="icon"
                  className="shrink-0"
                  disabled={isSubmitting}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              <p
                className={cn(
                  'text-xs text-right pr-1',
                  newTaskTitle.length > 60
                    ? 'text-destructive'
                    : 'text-muted-foreground',
                )}
              >
                {70 - newTaskTitle.length} characters remaining
              </p>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
