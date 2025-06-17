import { useState, useRef } from 'react';
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
import { Plus, Pencil, Save, Trash2, X } from 'lucide-react';
import {
  useContactTasks,
  useAddTaskForm,
  useUpdateTaskStatus,
  useDeleteTask,
  useUpdateTaskForm,
} from '@/logic/useContactTasks';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { CalendarPopover } from './CalendarPopover';

export function TasksSection({
  contactId,
  contactName,
}: {
  contactId: string;
  contactName: string;
}) {
  // Fetch tasks & loading state
  const { tasks, loading, refetch } = useContactTasks(contactId);

  // Add task form
  const { form: addTaskForm, onSubmit: onAddTaskSubmit } = useAddTaskForm(
    contactId,
    contactName,
    refetch,
  );

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const { updateStatus, isUpdating } = useUpdateTaskStatus(contactName);

  const { deleteTask: deleteTaskMutation, isDeleting } = useDeleteTask(
    contactName,
    refetch,
  );

  const { form: updateTaskForm, onSubmit: onUpdateTaskSubmit } =
    useUpdateTaskForm(editingTaskId, contactName, () => {
      setEditingTaskId(null);
      refetch();
    });

  const [addCalendarOpen, setAddCalendarOpen] = useState(false);
  const addCalendarButtonRef = useRef<HTMLButtonElement>(null);
  const [addCalendarAnchor, setAddCalendarAnchor] = useState<DOMRect | null>(
    null,
  );

  const [editCalendarOpen, setEditCalendarOpen] = useState(false);
  const editCalendarButtonRef = useRef<HTMLButtonElement>(null);
  const [editCalendarAnchor, setEditCalendarAnchor] = useState<DOMRect | null>(
    null,
  );

  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);

  const handleUpdateStatus = async (taskId: string, completed: boolean) => {
    const newStatus = completed ? 'completed' : 'pending';
    await updateStatus(taskId, newStatus);
    await refetch();
  };

  const handleEditClick = (task: any) => {
    setEditingTaskId(task.id);
    updateTaskForm.reset({
      title: task.title,
      due_date: task.due_date
        ? new Date(task.due_date).toISOString().split('T')[0]
        : '',
    });
  };

  return (
    <Card className="h-full">
      <CardContent className="p-4 text-sm space-y-3 h-full overflow-auto custom-scrollbar">
        {loading && <p>Loading tasks...</p>}

        {!loading && tasks.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            No tasks yet.
          </p>
        )}

        {tasks.map(task => {
          const isCompleted = task.completed;
          const dueDate = task.due_date ? new Date(task.due_date) : null;

          return (
            <div
              key={task.id}
              className="group flex items-center gap-2 border-l-2 pl-3 py-1 border-border relative"
            >
              {editingTaskId === task.id ? (
                <Form {...updateTaskForm}>
                  <form
                    onSubmit={updateTaskForm.handleSubmit(onUpdateTaskSubmit)}
                    className="flex items-center gap-2 flex-grow"
                  >
                    <FormField
                      control={updateTaskForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormControl>
                            <Input {...field} autoFocus />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={updateTaskForm.control}
                      name="due_date"
                      render={({ field }) => {
                        const selectedDate = field.value
                          ? new Date(field.value)
                          : undefined;

                        return (
                          <FormItem className="flex-grow-0 relative">
                            <FormControl>
                              <Button
                                type="button" // <-- Add this
                                ref={editCalendarButtonRef}
                                variant="outline"
                                onClick={() => {
                                  if (editCalendarOpen) {
                                    setEditCalendarOpen(false);
                                    setEditCalendarAnchor(null);
                                  } else {
                                    setEditCalendarAnchor(
                                      editCalendarButtonRef.current?.getBoundingClientRect() ||
                                        null,
                                    );
                                    setEditCalendarOpen(true);
                                  }
                                }}
                                className="max-w-[160px] w-full text-left"
                              >
                                {selectedDate
                                  ? selectedDate.toLocaleDateString()
                                  : 'Pick deadline'}
                              </Button>
                            </FormControl>

                            {editCalendarOpen && editCalendarAnchor && (
                              <CalendarPopover
                                anchorRect={editCalendarAnchor}
                                onClose={() => {
                                  setEditCalendarOpen(false);
                                  setEditCalendarAnchor(null);
                                }}
                              >
                                <DayPicker
                                  mode="single"
                                  selected={selectedDate}
                                  onSelect={date => {
                                    field.onChange(
                                      date
                                        ? date.toISOString().split('T')[0]
                                        : '',
                                    );
                                    setEditCalendarOpen(false);
                                    setEditCalendarAnchor(null);
                                  }}
                                  disabled={{ before: minDate }}
                                  fromDate={minDate}
                                />
                              </CalendarPopover>
                            )}
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    <Button
                      type="submit"
                      size="icon"
                      variant="outline"
                      disabled={updateTaskForm.formState.isSubmitting}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditingTaskId(null);
                        setEditCalendarOpen(false);
                        setEditCalendarAnchor(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </form>
                </Form>
              ) : (
                <>
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={e =>
                      handleUpdateStatus(task.id, e.target.checked)
                    }
                    disabled={isUpdating}
                    className="h-4 w-4 cursor-pointer rounded border border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0"
                    aria-checked={isCompleted}
                    role="checkbox"
                  />

                  <span
                    className={`flex-grow italic cursor-pointer select-none ${
                      isCompleted ? 'line-through text-muted-foreground' : ''
                    }`}
                    title={task.title}
                  >
                    {task.title}
                  </span>

                  {dueDate && (
                    <Badge
                      variant={
                        dueDate < new Date() ? 'destructive' : 'secondary'
                      }
                      className="text-xs"
                    >
                      Due: {dueDate.toLocaleDateString()}
                    </Badge>
                  )}

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ml-2">
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
                </>
              )}
            </div>
          );
        })}

        {/* Add new task form */}
        <Form {...addTaskForm}>
          <form
            onSubmit={addTaskForm.handleSubmit(onAddTaskSubmit)}
            className="flex gap-2 pt-4 border-t items-center"
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
              render={({ field }) => {
                const selectedDate = field.value
                  ? new Date(field.value)
                  : undefined;

                return (
                  <FormItem className="relative">
                    <FormControl>
                      <Button
                        ref={addCalendarButtonRef}
                        variant="outline"
                        type="button"
                        onClick={() => {
                          if (addCalendarOpen) {
                            setAddCalendarOpen(false);
                            setAddCalendarAnchor(null);
                          } else {
                            setAddCalendarAnchor(
                              addCalendarButtonRef.current?.getBoundingClientRect() ||
                                null,
                            );
                            setAddCalendarOpen(true);
                          }
                        }}
                        className="max-w-[160px] w-full text-left"
                      >
                        {selectedDate
                          ? selectedDate.toLocaleDateString()
                          : 'Pick deadline'}
                      </Button>
                    </FormControl>

                    {addCalendarOpen && addCalendarAnchor && (
                      <CalendarPopover
                        anchorRect={addCalendarAnchor}
                        onClose={() => {
                          setAddCalendarOpen(false);
                          setAddCalendarAnchor(null);
                        }}
                      >
                        <DayPicker
                          mode="single"
                          selected={selectedDate}
                          onSelect={date => {
                            field.onChange(
                              date ? date.toISOString().split('T')[0] : '',
                            );
                            setAddCalendarOpen(false);
                            setAddCalendarAnchor(null);
                          }}
                          disabled={{ before: minDate }}
                          fromDate={minDate}
                        />
                      </CalendarPopover>
                    )}
                    <FormMessage />
                  </FormItem>
                );
              }}
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
