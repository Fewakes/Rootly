import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useDialog } from '@/contexts/DialogContext';
import { useAddCompanyForm } from '@/logic/useAddCompanyForm';

export default function AddCompanyDialog() {
  const { openDialogName, closeDialog } = useDialog();
  const open = openDialogName === 'addCompany';

  const { form, onSubmit } = useAddCompanyForm();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('logo', file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <Dialog open={open} onOpenChange={isOpen => !isOpen && closeDialog()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            {/* Company Name */}
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Logo Upload */}
            <FormItem>
              <FormLabel>Company Logo</FormLabel>
              <FormControl>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onLogoChange}
                  className="block w-full text-sm text-muted-foreground
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary file:text-primary-foreground
                    hover:file:bg-primary/80"
                />
              </FormControl>
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="mt-2 h-24 w-24 rounded object-cover"
                />
              )}
            </FormItem>

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Add Company
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
