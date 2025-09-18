// src/components/dialogs/CompanyDialog.tsx
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Building, Upload } from 'lucide-react';
import { useCompanyForm } from '@/logic/useCompanyForm';

export default function CompanyDialog() {
  const {
    open,
    form,
    handleSubmit,
    closeDialog,
    isEditing,
    logoPreview,
    handleLogoChange,
  } = useCompanyForm();

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent
        aria-labelledby="company-dialog-title"
        aria-describedby="company-dialog-description"
      >
        <DialogHeader>
          <DialogTitle id="company-dialog-title">
            {isEditing ? 'Edit Company' : 'Add a New Company'}
          </DialogTitle>
          <DialogDescription id="company-dialog-description">
            {isEditing
              ? "Update the company's details below."
              : 'Add a new company to your records.'}
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
                    <Input placeholder="e.g., Acme Corporation" {...field} />
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
              name="logoFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border">
                      {/* FIX: Pass undefined instead of empty string to src */}
                      <AvatarImage src={logoPreview || undefined} />
                      <AvatarFallback>
                        <Building />
                      </AvatarFallback>
                    </Avatar>
                    <FormControl>
                      <Button asChild variant="outline">
                        <label htmlFor="logo-upload">
                          <Upload className="mr-2 h-4 w-4" /> Upload
                          <input
                            id="logo-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            name={field.name}
                            ref={field.ref}
                            onChange={event =>
                              handleLogoChange(event, field.onChange)
                            }
                          />
                        </label>
                      </Button>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={closeDialog}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {isEditing ? 'Save Changes' : 'Add Company'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
