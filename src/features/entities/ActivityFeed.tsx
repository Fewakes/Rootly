//New
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import EntityEmptyState from '@/features/entities/EntityEmptyState';
import type { Note, Task, UserProfile } from '@/types/types';

type ActivityService<T> = {
  create: (data: Partial<T>) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<any>;
  deleteById: (id: string) => Promise<void>;
};

type ActivityFeedProps = {
  entityId: string;
  userId: string;
  user: UserProfile | null;
  notes: Note[];
  tasks: Task[];
  isLoadingNotes: boolean;
  isLoadingTasks: boolean;
  refetchNotes: () => Promise<void>;
  refetchTasks: () => Promise<void>;
  notesService: ActivityService<Note & { [key: string]: string }>;
  tasksService: ActivityService<Task & { [key: string]: string }>;
  entityType: 'company' | 'tag' | 'group';
};

const INITIAL_ITEM_COUNT = 2;

export function ActivityFeed({
  entityId,
  userId,
  user,
  notes,
  tasks,
  isLoadingNotes,
  isLoadingTasks,
  refetchNotes,
  refetchTasks,
  notesService,
  tasksService,
  entityType,
}: ActivityFeedProps) {
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | undefined>();
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [tasksExpanded, setTasksExpanded] = useState(false);

  const displayedNotes = notesExpanded
    ? notes
    : notes.slice(0, INITIAL_ITEM_COUNT);
  const displayedTasks = tasksExpanded
    ? tasks
    : tasks.slice(0, INITIAL_ITEM_COUNT);

  const entityIdKey = `${entityType}_id`;

  const handleAddNote = useCallback(async () => {
    if (!newNoteContent.trim()) return;
    await notesService.create({
      content: newNoteContent,
      [entityIdKey]: entityId,
      user_id: userId,
    });
    setNewNoteContent('');
    await refetchNotes();
    toast.success('Note Added');
  }, [
    newNoteContent,
    entityId,
    userId,
    refetchNotes,
    notesService,
    entityIdKey,
  ]);

  const handleUpdateNote = useCallback(async () => {
    if (!editingNote) return;
    await notesService.update(editingNote.id, { content: editingNote.content });
    setEditingNote(null);
    await refetchNotes();
    toast.success('Note Updated');
  }, [editingNote, refetchNotes, notesService]);

  const handleDeleteNote = useCallback(
    async (noteId: string) => {
      await notesService.deleteById(noteId);
      await refetchNotes();
      toast.error('Note Deleted');
    },
    [refetchNotes, notesService],
  );

  const handleAddTask = useCallback(async () => {
    if (!newTaskTitle.trim()) return;
    await tasksService.create({
      title: newTaskTitle,
      due_date: newTaskDueDate,
      [entityIdKey]: entityId,
      user_id: userId,
      completed: false,
    });
    setNewTaskTitle('');
    setNewTaskDueDate(undefined);
    await refetchTasks();
    toast.success('Task Added');
  }, [
    newTaskTitle,
    newTaskDueDate,
    entityId,
    userId,
    refetchTasks,
    tasksService,
    entityIdKey,
  ]);

  const handleToggleTask = useCallback(
    async (task: Task) => {
      await tasksService.update(task.id, { completed: !task.completed });
      await refetchTasks();
    },
    [refetchTasks, tasksService],
  );

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      await tasksService.deleteById(taskId);
      await refetchTasks();
      toast.error('Task Deleted');
    },
    [refetchTasks, tasksService],
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
          {/* Notes Tab */}
          <TabsContent value="notes" className="h-full flex flex-col p-4 gap-3">
            {/* Note List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {isLoadingNotes ? (
                <p>Loading...</p>
              ) : displayedNotes.length > 0 ? (
                displayedNotes.map(note => (
                  <div
                    key={note.id}
                    className="group relative bg-muted/50 p-3 rounded-lg text-sm"
                  >
                    {editingNote?.id === note.id /* Edit View */ ? (
                      <div className="space-y-2">
                        <textarea
                          value={editingNote.content}
                          onChange={e =>
                            setEditingNote({
                              ...editingNote,
                              content: e.target.value,
                            })
                          }
                          className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          rows={3}
                        />
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingNote(null)}
                          >
                            Cancel
                          </Button>
                          <Button size="sm" onClick={handleUpdateNote}>
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* Display View */
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
                <EntityEmptyState message="No notes yet." isCompact={true} />
              )}
            </div>
            {/* Expander Button */}
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
            {/* Add Note Form */}
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
          {/* Tasks Tab */}
          <TabsContent value="tasks" className="h-full flex flex-col p-4 gap-3">
            {/* Task List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {isLoadingTasks ? (
                <p>Loading...</p>
              ) : displayedTasks.length > 0 ? (
                displayedTasks.map(task => (
                  <div
                    key={task.id}
                    className="group flex items-center gap-3 text-sm p-2 rounded-md hover:bg-muted"
                  >
                    <input
                      type="checkbox"
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onChange={() => handleToggleTask(task)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={`task-${task.id}`}
                        title={task.title}
                        className={cn(
                          'cursor-pointer break-words',
                          task.completed &&
                            'line-through text-muted-foreground',
                        )}
                      >
                        {task.title}
                      </label>
                    </div>
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
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <EntityEmptyState message="No tasks yet." isCompact={true} />
              )}
            </div>
            {/* Expander Button */}
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
            {/* Add Task Form */}
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
