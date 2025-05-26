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
import { TAG_COLORS } from '@/lib/utils';
import { insertTag } from '@/services/tags';
import { getCurrentUserId } from '@/services/users';

// UI Components (grouped from a single barrel file)
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from '@/components/ui';

const formSchema = z.object({
  tagName: z.string().min(1, 'Tag name is required'),
  color: z.enum(TAG_COLORS as [string, ...string[]], {
    required_error: 'Tag color is required',
  }),
});

export default function AddTag() {
  const { openDialogName, closeDialog } = useDialog();
  const navigate = useNavigate();

  const open = openDialogName === 'addTag';

  // Open dialog only if context name matches 'addContact'

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tagName: '',
      color: 'red',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const newTag = {
      id: uuidv4(),
      user_id: await getCurrentUserId(),
      name: data.tagName,
      color: data.color,
      created_at: new Date().toISOString(),
      logo: null,
    };
    console.log('start');
    console.log(newTag);
    console.log('stop');
    const saved = await insertTag(newTag);

    if (saved) {
      toast.success('Tag created successfully', {
        action: {
          label: 'View Tags',
          onClick: () => navigate('/tags'), // Replace `/tags` with your route
        },
      });
      form.reset();
      closeDialog();
    } else {
      toast.error('Failed to create tag');
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => (isOpen ? null : closeDialog())}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Tag</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="tagName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter tag name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TAG_COLORS.map(color => (
                        <SelectItem key={color} value={color}>
                          {color.charAt(0).toUpperCase() + color.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                {form.formState.isSubmitting ? 'Creating...' : 'Create Tag'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
