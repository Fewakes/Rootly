// src/components/dialogs/GroupDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useGroupForm } from '@/logic/useGroupForm';

export default function GroupDialog() {
  const { open, form, handleSubmit, closeDialog, isEditing } = useGroupForm();

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Group' : 'Create a New Group'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your group's details."
              : 'Groups help you organize related companies and contacts.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Q1 Prospects" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button variant="outline" type="button" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {isEditing ? 'Save Changes' : 'Create Group'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
