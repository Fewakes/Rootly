import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
  Button,
} from '@/components/ui';

import { useAddGroupForm } from '@/logic/useAddGroupForm';

export default function AddGroupDialog() {
  const { open, form, handleSubmit, closeDialog } = useAddGroupForm();

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => (isOpen ? null : closeDialog())}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {form.getValues('groupName') ? 'Edit Group' : 'Add New Group'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
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
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="bg-primaryBlue text-white px-6 py-3 text-base font-semibold transition duration-150 transform hover:scale-[1.02] active:scale-[0.98] shadow hover:shadow-md hover:bg-primaryBlue"
              >
                {form.formState.isSubmitting
                  ? form.getValues('groupName')
                    ? 'Updating...'
                    : 'Creating...'
                  : form.getValues('groupName')
                    ? 'Update Group'
                    : 'Add Group'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
