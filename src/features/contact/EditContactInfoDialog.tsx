// src/components/EditContactInfoDialog.tsx

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDialog } from '@/contexts/DialogContext';
import { useAllCompanies } from '@/logic/useAllCompanies';
import { useEditContactInfoForm } from '@/logic/useEditContactInfoForm';

export default function EditContactInfoDialog() {
  const { openDialogName, dialogPayload, closeDialog } = useDialog();
  const open = openDialogName === 'editContactInfo';

  const contactToEdit =
    dialogPayload?.type === 'editContact' ? dialogPayload.contact : null;

  const { form, onSubmit } = useEditContactInfoForm(contactToEdit);
  const { companies, loading: companiesLoading } = useAllCompanies();

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      closeDialog();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Contact & Professional Info</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            {/* Section: Contact Details */}
            <div className="border rounded-xl p-4 bg-muted/30 space-y-4">
              <h3 className="text-sm text-muted-foreground font-medium">
                Contact Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section: Location Details */}
            <div className="border rounded-xl p-4 bg-muted/30 space-y-4">
              <h3 className="text-sm text-muted-foreground font-medium">
                Location & Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Town</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., USA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birthday</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section: Professional Details */}
            <div className="border rounded-xl p-4 bg-muted/30 space-y-4">
              <h3 className="text-sm text-muted-foreground font-medium">
                Professional Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="linkName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Social Link Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., LinkedIn Profile"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="socialLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Social Link URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., https://linkedin.com/in/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={companiesLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              companiesLoading ? 'Loading...' : 'Select company'
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companies.map(c => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="bg-primaryBlue text-white"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
