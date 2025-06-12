import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useContactNotes,
  useContactTasks,
  useContactProfessionalInfo,
  useAddNoteForm,
  useUpdateNoteForm,
  useDeleteNote,
  useAddTaskForm,
  useUpdateTaskForm,
  useDeleteTask,
  useUpdateTaskStatus,
  useProfessionalInfoForm,
} from '@/logic/crmDetailHooks';
import { Plus, Pencil, Save, Trash2, X } from 'lucide-react';

/**
 * Renders the main tabbed interface for a contact's details.
 */
export function ContactTabs({ contactId }: { contactId: string }) {
  return (
    <Tabs defaultValue="notes" className="w-full h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="professional">Professional</TabsTrigger>
      </TabsList>
      <TabsContent value="notes" className="mt-4 flex-1">
        <NotesSection contactId={contactId} />
      </TabsContent>
      <TabsContent value="tasks" className="mt-4 flex-1">
        <TasksSection contactId={contactId} />
      </TabsContent>
      <TabsContent value="professional" className="mt-4 flex-1">
        <ProfessionalInfoSection contactId={contactId} />
      </TabsContent>
    </Tabs>
  );
}

/**
 * Displays and manages notes for a contact.
 */
function NotesSection({ contactId }: { contactId: string }) {
  const { notes, loading, refetch } = useContactNotes(contactId);
  const { form: addNoteForm, onSubmit: onAddNoteSubmit } = useAddNoteForm(
    contactId,
    refetch,
  );
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const { form: updateNoteForm, onSubmit: onUpdateNoteSubmit } =
    useUpdateNoteForm(editingNoteId, () => {
      setEditingNoteId(null);
      refetch();
    });

  const { deleteNote: deleteNoteMutation, isDeleting } = useDeleteNote(refetch);

  const handleEditClick = (note: { id: string; content: string }) => {
    setEditingNoteId(note.id);
    updateNoteForm.reset({ content: note.content });
  };

  return (
    <Card className="h-full">
      <CardContent className="p-4 text-sm space-y-4 h-full overflow-auto custom-scrollbar">
        {loading && <p>Loading notes...</p>}
        {!loading && notes.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            No notes yet.
          </p>
        )}
        {notes.map(note => (
          <div key={note.id} className="group">
            {editingNoteId === note.id ? (
              <Form {...updateNoteForm}>
                <form
                  onSubmit={updateNoteForm.handleSubmit(onUpdateNoteSubmit)}
                  className="flex items-start gap-2"
                >
                  <FormField
                    control={updateNoteForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <textarea
                            {...field}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-1">
                    <Button
                      type="submit"
                      size="icon"
                      variant="outline"
                      disabled={updateNoteForm.formState.isSubmitting}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingNoteId(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="border-l-2 pl-3 py-1 border-border italic text-muted-foreground relative">
                "{note.content}"
                <span className="block text-xs text-right opacity-60 not-italic mt-1">
                  {new Date(note.created_at).toLocaleDateString()}
                </span>
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => handleEditClick(note)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => deleteNoteMutation(note.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
        <Form {...addNoteForm}>
          <form
            onSubmit={addNoteForm.handleSubmit(onAddNoteSubmit)}
            className="flex gap-2 pt-4 border-t"
          >
            <FormField
              control={addNoteForm.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <textarea
                      placeholder="Add a new note..."
                      {...field}
                      className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="icon"
              disabled={addNoteForm.formState.isSubmitting}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

/**
 * Displays and manages tasks for a contact.
 */
function TasksSection({ contactId }: { contactId: string }) {
  const { tasks, loading, refetch } = useContactTasks(contactId);
  const { form: addTaskForm, onSubmit: onAddTaskSubmit } = useAddTaskForm(
    contactId,
    refetch,
  );
  const { updateStatus, isUpdating } = useUpdateTaskStatus();
  const { deleteTask: deleteTaskMutation, isDeleting } = useDeleteTask(refetch);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const { form: updateTaskForm, onSubmit: onUpdateTaskSubmit } =
    useUpdateTaskForm(editingTaskId, () => {
      setEditingTaskId(null);
      refetch();
    });

  const handleEditClick = (task: any) => {
    setEditingTaskId(task.id);
    updateTaskForm.reset({
      title: task.title,
      due_date: task.due_date
        ? new Date(task.due_date).toISOString().split('T')[0]
        : '',
    });
  };

  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);

  return (
    <Card className="h-full">
      <CardContent className="p-4 text-sm space-y-3 h-full overflow-auto custom-scrollbar">
        {loading && <p>Loading tasks...</p>}
        {!loading && tasks.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            No tasks yet.
          </p>
        )}
        {tasks.map(task => (
          <div key={task.id} className="group">
            {editingTaskId === task.id ? (
              <Form {...updateTaskForm}>
                <form
                  onSubmit={updateTaskForm.handleSubmit(onUpdateTaskSubmit)}
                  className="flex items-center gap-2"
                >
                  <FormField
                    control={updateTaskForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={updateTaskForm.control}
                    name="due_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            className="w-auto"
                            min={minDate.toISOString().split('T')[0]}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={updateTaskForm.formState.isSubmitting}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => setEditingTaskId(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </form>
              </Form>
            ) : (
              <div
                className={`flex items-center justify-between ${task.completed ? 'opacity-50' : ''}`}
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-primary rounded"
                    checked={task.completed}
                    onChange={() =>
                      updateStatus(task.id, !task.completed, refetch)
                    }
                    disabled={isUpdating}
                  />
                  <span className={`${task.completed ? 'line-through' : ''}`}>
                    {task.title}
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  {task.due_date && !task.completed && (
                    <Badge variant="destructive" className="text-xs">
                      Due:{' '}
                      {new Date(task.due_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Badge>
                  )}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => handleEditClick(task)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => deleteTaskMutation(task.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        <Form {...addTaskForm}>
          <form
            onSubmit={addTaskForm.handleSubmit(onAddTaskSubmit)}
            className="flex gap-2 pt-4 border-t"
          >
            <FormField
              control={addTaskForm.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input placeholder="Add a new task..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={addTaskForm.control}
              name="due_date"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      className="w-auto"
                      min={minDate.toISOString().split('T')[0]}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="icon"
              disabled={addTaskForm.formState.isSubmitting}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

/**
 * Displays and manages professional information for a contact.
 */
function ProfessionalInfoSection({ contactId }: { contactId: string }) {
  const { info, loading, refetch } = useContactProfessionalInfo(contactId);
  const [isEditing, setIsEditing] = useState(false);
  const { form, onSubmit } = useProfessionalInfoForm(contactId, info, () => {
    refetch();
    setIsEditing(false);
  });

  if (loading) return <p>Loading professional info...</p>;

  return (
    <Card className="h-full">
      <CardContent className="p-4 text-sm space-y-3 h-full overflow-auto custom-scrollbar">
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="job_title"
                render={({ field }) => (
                  <FormItem>
                    <h4 className="font-semibold text-foreground mb-1">
                      Job Title
                    </h4>
                    <FormControl>
                      <Input placeholder="e.g., Senior Engineer" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <h4 className="font-semibold text-foreground mb-1">
                      Department
                    </h4>
                    <FormControl>
                      <Input placeholder="e.g., Product" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <h4 className="font-semibold text-foreground mb-1">
                      Key Skills
                    </h4>
                    <FormControl>
                      <Input placeholder="e.g., React, Node, SQL" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={form.formState.isSubmitting}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Job Title</h4>
              <p>{info?.job_title || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Department</h4>
              <p>{info?.department || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Key Skills</h4>
              <div className="flex flex-wrap gap-1">
                {info?.skills && info.skills.length > 0 ? (
                  info.skills.map((skill: string, i: number) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="text-xs px-2 py-0.5"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p>No skills listed.</p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 text-primary"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Professional Info
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
