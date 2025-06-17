import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

import { Input } from '@/components/ui/input';

import { Progress } from '@/components/ui/progress';
import {
  Pencil,
  PlusCircle,
  Trash2,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { cn, TAG_BG_CLASSES, TAG_TEXT_CLASSES } from '@/lib/utils';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts';

import type { AssignEntity, Tag, Note, Task } from '@/types/types';

import {
  getAssignedContacts,
  getEligibleContacts,
  addContactToEntity,
  removeContactFromEntity,
  type ContactWithDetails,
} from '@/services/assignContactService';
import { getCurrentUserId } from '@/services/users';
import { useTagNotes, useTagTasks } from '@/logic/useEntityNotesTasks';
import { useUserAuthProfile } from '@/logic/useUserAuthProfile';
import { tagNotesService, tagTasksService } from '@/services/entityNotesTasks';
import SkeletonList from '@/features/entities/SkeletonList';
import EntityContactListItem from '@/features/entities/EntityContactListItem';
import EntityPaginationControls from '@/features/entities/EntityPaginationControls';
import EntityDetailsSkeleton from '@/features/entities/EntityDetailsSkeleton';
import EntityEmptyState from '@/features/entities/EntityEmptyState';
import { useDialog } from '@/contexts/DialogContext';
import useTag from '@/logic/useTag';

function useEntityContacts(entity: AssignEntity | null) {
  const [assigned, setAssigned] = useState<ContactWithDetails[]>([]);
  const [eligible, setEligible] = useState<ContactWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshContacts = useCallback(async () => {
    if (!entity) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [assignedList, eligibleList] = await Promise.all([
        getAssignedContacts(entity),
        getEligibleContacts(entity),
      ]);
      setAssigned(assignedList);
      setEligible(eligibleList);
    } catch (error) {
      console.error('Failed to refresh contacts:', error);
      toast.error('Could not load contact lists.');
    } finally {
      setLoading(false);
    }
  }, [entity]);

  useEffect(() => {
    refreshContacts();
  }, [refreshContacts]);

  const addContact = async (contactId: string) => {
    if (!entity) return;
    await addContactToEntity(entity, contactId);
    toast.success('Contact added.');
    await refreshContacts();
  };
  const removeContact = async (contactId: string) => {
    if (!entity) return;
    await removeContactFromEntity(entity, contactId);
    toast.error('Contact removed.');
    await refreshContacts();
  };

  return { assigned, eligible, loading, addContact, removeContact };
}

const CHART_COLORS = ['#005df4', '#a1a1aa'];

export default function TagDetails() {
  const { id } = useParams<{ id: string }>();
  const [userId, setUserId] = useState<string | null>(null);
  const { user } = useUserAuthProfile();

  const { openDialogName } = useDialog();
  const prevOpenDialogName = useRef(openDialogName);

  const entity = useMemo(
    () => (id ? ({ id, type: 'tag' } as AssignEntity) : null),
    [id],
  );

  const { tag, loading: isLoadingTag, refetch: refetchTag } = useTag(id);
  const {
    assigned,
    eligible,
    loading: isLoadingContacts,
    addContact,
    removeContact,
  } = useEntityContacts(entity);
  const {
    items: notes,
    loading: isLoadingNotes,
    refetch: refetchNotes,
  } = useTagNotes(userId || '', id || '');
  const {
    items: tasks,
    loading: isLoadingTasks,
    refetch: refetchTasks,
  } = useTagTasks(userId || '', id || '');

  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | undefined>();
  const [assignedSearch, setAssignedSearch] = useState('');
  const [eligibleSearch, setEligibleSearch] = useState('');
  const [assignedPage, setAssignedPage] = useState(1);
  const [eligiblePage, setEligiblePage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const [notesExpanded, setNotesExpanded] = useState(false);
  const [tasksExpanded, setTasksExpanded] = useState(false);
  const INITIAL_ITEM_COUNT = 2;

  const displayedNotes = notesExpanded
    ? notes
    : notes.slice(0, INITIAL_ITEM_COUNT);
  const displayedTasks = tasksExpanded
    ? tasks
    : tasks.slice(0, INITIAL_ITEM_COUNT);

  useEffect(() => {
    const fetchUser = async () => {
      const id = await getCurrentUserId();
      setUserId(id);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (prevOpenDialogName.current === 'editTag' && openDialogName === null) {
      toast.info('Refreshing tag data...');
      refetchTag();
    }

    prevOpenDialogName.current = openDialogName;
  }, [openDialogName, refetchTag]);

  const filteredAssigned = useMemo(
    () =>
      assigned.filter(c =>
        c.name.toLowerCase().includes(assignedSearch.toLowerCase()),
      ),
    [assigned, assignedSearch],
  );
  const paginatedAssigned = useMemo(
    () =>
      filteredAssigned.slice(
        (assignedPage - 1) * ITEMS_PER_PAGE,
        assignedPage * ITEMS_PER_PAGE,
      ),
    [filteredAssigned, assignedPage],
  );
  const totalAssignedPages = Math.ceil(
    filteredAssigned.length / ITEMS_PER_PAGE,
  );
  const filteredEligible = useMemo(
    () =>
      eligible.filter(c =>
        c.name.toLowerCase().includes(eligibleSearch.toLowerCase()),
      ),
    [eligible, eligibleSearch],
  );
  const paginatedEligible = useMemo(
    () =>
      filteredEligible.slice(
        (eligiblePage - 1) * ITEMS_PER_PAGE,
        eligiblePage * ITEMS_PER_PAGE,
      ),
    [filteredEligible, eligiblePage],
  );
  const totalEligiblePages = Math.ceil(
    filteredEligible.length / ITEMS_PER_PAGE,
  );
  const taskStatusData = useMemo(
    () => [
      { name: 'Completed', value: tasks.filter(t => t.completed).length },
      { name: 'Pending', value: tasks.filter(t => !t.completed).length },
    ],
    [tasks],
  );

  const handleAddNote = useCallback(async () => {
    if (!newNoteContent.trim() || !id || !userId) return;
    await tagNotesService.create({
      content: newNoteContent,
      tag_id: id,
      user_id: userId,
    });
    setNewNoteContent('');
    await refetchNotes();
    toast.success('Note Added');
  }, [newNoteContent, id, userId, refetchNotes]);

  const handleUpdateNote = useCallback(async () => {
    if (!editingNote) return;
    await tagNotesService.update(editingNote.id, {
      content: editingNote.content,
    });
    setEditingNote(null);
    await refetchNotes();
    toast.success('Note Updated');
  }, [editingNote, refetchNotes]);

  const handleDeleteNote = useCallback(
    async (noteId: string) => {
      await tagNotesService.deleteById(noteId);
      await refetchNotes();
      toast.error('Note Deleted');
    },
    [refetchNotes],
  );

  const handleAddTask = useCallback(async () => {
    if (!newTaskTitle.trim() || !id || !userId) return;
    await tagTasksService.create({
      title: newTaskTitle,
      due_date: newTaskDueDate,
      tag_id: id,
      user_id: userId,
      completed: false,
    });
    setNewTaskTitle('');
    setNewTaskDueDate(undefined);
    await refetchTasks();
    toast.success('Task Added');
  }, [newTaskTitle, newTaskDueDate, id, userId, refetchTasks]);

  const handleToggleTask = useCallback(
    async (task: Task) => {
      await tagTasksService.update(task.id, { completed: !task.completed });
      await refetchTasks();
    },
    [refetchTasks],
  );

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      await tagTasksService.deleteById(taskId);
      await refetchTasks();
      toast.error('Task Deleted');
    },
    [refetchTasks],
  );

  if (isLoadingTag) return <EntityDetailsSkeleton />;
  if (!tag) return <div className="p-8 text-center">Tag not found.</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* --- MODIFIED: `onEdit` prop is removed --- */}
      <TagHeader tag={tag} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          <Card className="flex flex-col flex-1">
            <Tabs defaultValue="assigned" className="flex flex-col flex-1">
              <CardHeader>
                <TabsList className="grid grid-cols-2 w-full sm:w-[300px]">
                  <TabsTrigger value="assigned">
                    Assigned ({assigned.length})
                  </TabsTrigger>
                  <TabsTrigger value="available">
                    Available ({eligible.length})
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <TabsContent
                  value="assigned"
                  className="flex-1 flex flex-col space-y-4"
                >
                  <Input
                    placeholder="Search assigned contacts..."
                    value={assignedSearch}
                    onChange={e => {
                      setAssignedSearch(e.target.value);
                      setAssignedPage(1);
                    }}
                  />
                  <div className="space-y-2 flex-1 overflow-y-auto pr-2">
                    {isLoadingContacts ? (
                      <SkeletonList />
                    ) : paginatedAssigned.length > 0 ? (
                      paginatedAssigned.map(c => (
                        <EntityContactListItem
                          key={c.id}
                          contact={c}
                          type="remove"
                          onAction={() => removeContact(c.id)}
                        />
                      ))
                    ) : (
                      <EntityEmptyState message="No contacts assigned." />
                    )}
                  </div>
                  <EntityPaginationControls
                    currentPage={assignedPage}
                    totalPages={totalAssignedPages}
                    onPageChange={setAssignedPage}
                  />
                </TabsContent>
                <TabsContent
                  value="available"
                  className="flex-1 flex flex-col space-y-4"
                >
                  <Input
                    placeholder="Search available contacts..."
                    value={eligibleSearch}
                    onChange={e => {
                      setEligibleSearch(e.target.value);
                      setEligiblePage(1);
                    }}
                  />
                  <div className="space-y-2 flex-1 overflow-y-auto pr-2">
                    {isLoadingContacts ? (
                      <SkeletonList />
                    ) : paginatedEligible.length > 0 ? (
                      paginatedEligible.map(c => (
                        <EntityContactListItem
                          key={c.id}
                          contact={c}
                          type="add"
                          onAction={() => addContact(c.id)}
                        />
                      ))
                    ) : (
                      <EntityEmptyState message="No contacts available to add." />
                    )}
                  </div>
                  <EntityPaginationControls
                    currentPage={eligiblePage}
                    totalPages={totalEligiblePages}
                    onPageChange={setEligiblePage}
                  />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>At a Glance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-muted-foreground">Tag Rank</span>
                  <span className="font-semibold">
                    Top{' '}
                    {tag?.rank && tag?.total_tags
                      ? Math.ceil((tag.rank / tag.total_tags) * 100)
                      : '-'}
                    % ({tag?.rank} of {tag?.total_tags})
                  </span>
                </div>
                <Progress
                  value={
                    tag?.rank && tag?.total_tags
                      ? 100 - (tag.rank / tag.total_tags) * 100
                      : 0
                  }
                  className="h-2 [&>div]:bg-[#005df4]"
                />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Task Status</h4>
                <div className="h-32 -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskStatusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={50}
                        paddingAngle={5}
                      >
                        {taskStatusData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        cursor={{ fill: 'hsl(var(--muted))' }}
                        contentStyle={{
                          background: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 text-xs mt-2">
                  {taskStatusData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-1.5">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: CHART_COLORS[index] }}
                      ></div>
                      <span>{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1 flex flex-col">
            <Tabs defaultValue="notes" className="w-full h-full flex flex-col">
              <CardHeader className="flex-row items-center justify-between p-4 border-b">
                <CardTitle className="text-lg">Activity</CardTitle>
                <TabsList className="grid grid-cols-2 w-auto">
                  <TabsTrigger value="notes">
                    Notes ({notes.length})
                  </TabsTrigger>
                  <TabsTrigger value="tasks">
                    Tasks ({tasks.length})
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-hidden">
                <TabsContent
                  value="notes"
                  className="h-full flex flex-col p-4 gap-3"
                >
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {isLoadingNotes ? (
                      <p className="text-center text-muted-foreground">
                        Loading...
                      </p>
                    ) : notes.length > 0 ? (
                      displayedNotes.map(note => (
                        <div
                          key={note.id}
                          className="group relative bg-muted/50 p-3 rounded-lg text-sm"
                        >
                          {editingNote?.id === note.id ? (
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
                            <>
                              <p className="text-muted-foreground whitespace-pre-wrap cursor-pointer break-words mr-10">
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
                      <EntityEmptyState
                        message="No notes yet."
                        isCompact={true}
                      />
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

                <TabsContent
                  value="tasks"
                  className="h-full flex flex-col p-4 gap-3"
                >
                  <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                    {isLoadingTasks ? (
                      <p className="text-center text-muted-foreground">
                        Loading...
                      </p>
                    ) : tasks.length > 0 ? (
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
                      <EntityEmptyState
                        message="No tasks yet."
                        isCompact={true}
                      />
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
        </div>
      </div>
    </div>
  );
}

function TagHeader({ tag }: { tag: Tag }) {
  const { openDialog } = useDialog();

  const handleEditClick = () => {
    openDialog('editTag', {
      type: 'tag',
      ...tag,
    });
  };

  return (
    <Card>
      <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Badge
            variant="outline"
            style={{
              color: TAG_TEXT_CLASSES[tag.color] || '',
              backgroundColor: TAG_BG_CLASSES[tag.color] || '',
            }}
          >
            Tag
          </Badge>
          <h1 className="text-3xl font-bold break-words mt-1">{tag.name}</h1>
          <p className="text-muted-foreground text-sm max-w-prose mt-2">
            {tag.description}
          </p>
        </div>
        <Button variant="outline" onClick={handleEditClick}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit Details
        </Button>
      </CardContent>
    </Card>
  );
}
