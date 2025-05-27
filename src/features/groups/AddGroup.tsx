// React hook form and validation
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Utilities
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// Routing and context
import { useNavigate } from 'react-router-dom';
import { useDialog } from '@/contexts/DialogContext';

// App constants and services
import { getCurrentUserId } from '@/services/users';

// UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
  Button,
} from '@/components/ui';
import { insertGroup } from '@/services/groups';

const formSchema = z.object({
  groupName: z.string().min(1, 'Group name is required'),
});

export default function AddGroup() {
  const { openDialogName, closeDialog } = useDialog();
  const navigate = useNavigate();

  const open = openDialogName === 'addGroup';

  // Open dialog only if context name matches 'addGroup'

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const newGroup = {
      id: uuidv4(),
      user_id: await getCurrentUserId(),
      name: data.groupName,
      created_at: new Date().toISOString(),
      logo: null,
    };

    const saved = await insertGroup(newGroup);

    if (saved) {
      toast.success('Group created successfully', {
        action: {
          label: 'View Groups',
          onClick: () => navigate('/groups'),
        },
      });
      form.reset();
      closeDialog();
    } else {
      toast.error('Failed to create group');
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => (isOpen ? null : closeDialog())}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Group</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="groupName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter group name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="space-x-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  form.reset();
                  closeDialog();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creating...' : 'Create Group'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
