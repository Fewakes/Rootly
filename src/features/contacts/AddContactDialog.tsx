import { useEffect, useState } from 'react';
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
import { useAddContactForm } from '@/logic/useAddContactForm';
import { getAllTags } from '@/services/tags';
import { getAllGroups } from '@/services/groups';
import { useAllCompanies } from '@/logic/useAllCompanies';
import default_woman from '@/assets/default_woman.svg';
import default_man from '@/assets/default_man.svg';

export default function AddContactDialog() {
  // Core hooks for dialog and form state
  const { openDialogName, closeDialog } = useDialog();
  const { form, onSubmit } = useAddContactForm();
  const open = openDialogName === 'addContact';

  // State for populating dropdowns
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const {
    companies,
    loading: companiesLoading,
    error: companiesError,
  } = useAllCompanies();

  // State for UI feedback
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Fetch initial data for dropdowns
  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        const allGroups = await getAllGroups();
        setGroups(allGroups);
        const allTags = await getAllTags();
        setTags(allTags);
      };
      fetchData();
    }
  }, [open]);

  // Handler for avatar file selection
  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('avatarUrl', file);
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      form.setValue('avatarUrl', '');
      setAvatarPreview(null);
    }
  };

  // Wrapper for form submission to handle loading state
  const handleSubmit = async (data: any) => {
    setUploadingAvatar(true);
    try {
      await onSubmit(data);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Handler for closing the dialog and resetting the form
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
      setAvatarPreview(null);
      closeDialog();
    }
  };

  // Filter out any invalid company data to prevent crashes
  const validCompanies = companies.filter(c => c.id && c.id.trim() !== '');

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 py-4"
          >
            {/* Section: Avatar */}
            <FormItem>
              <FormLabel>Avatar</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  {/* Avatar Preview */}
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border">
                    <img
                      src={
                        avatarPreview ||
                        (form.getValues('gender') === 'male'
                          ? default_man
                          : default_woman)
                      }
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    id="avatar-upload"
                    onChange={onAvatarChange}
                    className="hidden"
                  />

                  {/* Custom Upload Button */}
                  <label
                    htmlFor="avatar-upload"
                    className="cursor-pointer px-4 py-2 rounded-full bg-primaryBlue text-white font-semibold hover:bg-primaryBlue/90 text-sm"
                  >
                    Upload Image
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* Section: Personal Information */}
            <div className="border rounded-xl p-4 bg-muted/30 space-y-4">
              <h3 className="text-sm text-muted-foreground font-medium">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="surname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Surname</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section: Contact Information */}
            <div className="border rounded-xl p-4 bg-muted/30 space-y-4">
              <h3 className="text-sm text-muted-foreground font-medium">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" {...field} />
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
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section: Profile Details */}
            <div className="border rounded-xl p-4 bg-muted/30 space-y-4">
              <h3 className="text-sm text-muted-foreground font-medium">
                Profile Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="groupIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {groups
                            .filter(g => g.id && g.id.trim() !== '')
                            .map(group => (
                              <SelectItem key={group.id} value={group.id}>
                                {group.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tagIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tag</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tag" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tags
                            .filter(t => t.id && t.id.trim() !== '')
                            .map(tag => (
                              <SelectItem key={tag.id} value={tag.id}>
                                {tag.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                        disabled={companiesLoading || !!companiesError}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                companiesLoading
                                  ? 'Loading...'
                                  : companiesError
                                    ? 'Error'
                                    : 'Select company'
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {validCompanies.map(company => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={uploadingAvatar || form.formState.isSubmitting}
                className="bg-primaryBlue text-white"
              >
                {uploadingAvatar ? 'Uploading...' : 'Add Contact'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
