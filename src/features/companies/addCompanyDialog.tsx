import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { useAddCompanyForm } from '@/logic/useAddCompanyForm';

export default function AddCompanyDialog() {
  const { open, form, handleSubmit, closeDialog, logoPreview, onLogoChange } =
    useAddCompanyForm();

  return (
    <Dialog open={open} onOpenChange={isOpen => !isOpen && closeDialog()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {' '}
            {form.getValues('companyName') ? 'Edit Company' : 'Add New Company'}
          </DialogTitle>
        </DialogHeader>

        {/* Wrap form inside Form for context */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter company name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Company Logo</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  {/* Preview or Placeholder */}
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm text-gray-500">Logo</span>
                    )}
                  </div>

                  {/* File input */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onLogoChange}
                    className="block text-sm text-muted-foreground 
          file:py-2 file:px-4 file:rounded-full 
          file:border-0 file:text-sm file:font-semibold 
          file:bg-[#005df4] file:text-white 
          hover:file:bg-[#005df4]/90"
                  />
                </div>
              </FormControl>
            </FormItem>

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
                className="bg-primaryBlue text-white px-6 py-3 text-base font-semibold transition duration-150 transform hover:scale-[1.02] active:scale-[0.98] shadow hover:shadow-md hover:bg-primaryBlue disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {form.formState.isSubmitting
                  ? form.getValues('companyName')
                    ? 'Updating...'
                    : 'Creating...'
                  : form.getValues('companyName')
                    ? 'Update Company'
                    : 'Add Company'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
