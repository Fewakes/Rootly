import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar'; // Using the shadcn Calendar component
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  CheckCircle,
  MessageSquare,
  PhoneCall,
  Send,
  Calendar as CalendarIcon,
} from 'lucide-react';

import { noteSchema } from '@/logic/useContactNotes';
import { taskSchema } from '@/logic/useContactTasks';

type QuickActionsCardProps = {
  contactName: string;
  addNote: (contactName: string, content: string) => Promise<void>;
  addTask: (
    contactName: string,
    data: z.infer<typeof taskSchema>,
  ) => Promise<void>;
};

export function QuickActionsCard({
  contactName,
  addNote,
  addTask,
}: QuickActionsCardProps) {
  const [mode, setMode] = useState<'idle' | 'note' | 'task'>('idle');

  const NoteFormView = () => {
    const form = useForm<z.infer<typeof noteSchema>>({
      resolver: zodResolver(noteSchema),
      defaultValues: { content: '' },
    });
    const noteContent = form.watch('content') || '';

    const handleNoteSubmit = async (data: z.infer<typeof noteSchema>) => {
      try {
        await addNote(contactName, data.content);
        form.reset();
        setMode('idle');
      } catch (error) {
        // The hook now handles its own error toasts
      }
    };

    return (
      <div className="p-1">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleNoteSubmit)}
            className="space-y-2"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Add a new note..."
                      maxLength={80}
                      {...field}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p
              className={cn(
                'text-xs text-right pr-1',
                noteContent.length > 70
                  ? 'text-destructive'
                  : 'text-muted-foreground',
              )}
            >
              {80 - noteContent.length} characters remaining
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setMode('idle')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={form.formState.isSubmitting}
              >
                Save Note
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  };

  const TaskFormView = () => {
    const form = useForm<z.infer<typeof taskSchema>>({
      resolver: zodResolver(taskSchema),
      defaultValues: { title: '', due_date: undefined },
    });
    const taskTitle = form.watch('title') || '';

    const handleTaskSubmit = async (data: z.infer<typeof taskSchema>) => {
      try {
        await addTask(contactName, data);
        form.reset();
        setMode('idle');
      } catch (error) {
        // The hook now handles its own error toasts
      }
    };

    return (
      <div className="p-1">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleTaskSubmit)}
            className="space-y-2"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Add a new task..."
                      maxLength={70}
                      {...field}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p
              className={cn(
                'text-xs text-right pr-1',
                taskTitle.length > 60
                  ? 'text-destructive'
                  : 'text-muted-foreground',
              )}
            >
              {70 - taskTitle.length} characters remaining
            </p>
            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a due date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={date =>
                          date < new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setMode('idle')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={form.formState.isSubmitting}
              >
                Save Task
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  };

  const IdleView = () => (
    <div className="flex flex-col gap-3">
      <Button
        variant="outline"
        className="justify-start"
        onClick={() => setMode('note')}
      >
        <MessageSquare className="h-4 w-4 mr-3" /> Add a Note
      </Button>
      <Button
        variant="outline"
        className="justify-start"
        onClick={() => setMode('task')}
      >
        <CheckCircle className="h-4 w-4 mr-3" /> Create a Task
      </Button>
      <Button variant="outline" className="justify-start" disabled>
        <Send className="h-4 w-4 mr-3" /> Send Email
      </Button>
      <Button variant="outline" className="justify-start" disabled>
        <PhoneCall className="h-4 w-4 mr-3" /> Log a Call
      </Button>
    </div>
  );

  return (
    <Card className="shadow-md h-full">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        {mode === 'idle' ? (
          <IdleView />
        ) : mode === 'note' ? (
          <NoteFormView />
        ) : (
          <TaskFormView />
        )}
      </CardContent>
    </Card>
  );
}
