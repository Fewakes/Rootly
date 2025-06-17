// src/components/dialogs/TagDialog.tsx
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
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  TAG_COLORS,
  cn,
  TAG_BG,
  TAG_BG_CLASSES,
  TAG_TEXT_CLASSES,
} from '@/lib/utils';
import { useTagForm } from '@/logic/useTagForm';

export default function TagDialog() {
  const { open, form, handleSubmit, closeDialog, isEditing } = useTagForm();
  const name = form.watch('name');
  const color = form.watch('color');

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Tag' : 'Create a New Tag'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the tag's details below."
              : 'Create a new tag to organize your items.'}
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
                    <Input placeholder="e.g., Urgent" {...field} />
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
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {TAG_COLORS.map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => field.onChange(c)}
                          className={cn(
                            'h-6 w-6 rounded-full transition-transform hover:scale-110 focus:outline-none',
                            TAG_BG[c] || 'bg-gray-500',
                            field.value === c &&
                              'ring-2 ring-offset-2 ring-offset-background ring-ring',
                          )}
                          aria-label={`Select color ${c}`}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">Preview</label>
              <div className="p-4 rounded-lg bg-muted flex items-center justify-center">
                <Badge
                  className={cn(
                    'text-base border-none shadow-sm px-3 py-1',
                    TAG_BG_CLASSES[color] || 'bg-gray-100',
                    TAG_TEXT_CLASSES[color] || 'text-gray-800',
                  )}
                >
                  {name || 'Tag Name'}
                </Badge>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {isEditing ? 'Save Changes' : 'Create Tag'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
