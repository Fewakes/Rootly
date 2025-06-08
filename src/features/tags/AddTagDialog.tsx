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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from '@/components/ui';

import { useAddTagForm } from '@/logic/useAddTagForm';

export default function AddTagDialog() {
  const { open, form, TAG_COLORS, handleSubmit, closeDialog } = useAddTagForm();

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => (isOpen ? null : closeDialog())}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {form.getValues('tagName') ? 'Edit Tag' : 'Add New Tag'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
                {form.formState.isSubmitting
                  ? form.getValues('tagName')
                    ? 'Updating...'
                    : 'Creating...'
                  : form.getValues('tagName')
                    ? 'Update Tag'
                    : 'Create Tag'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
