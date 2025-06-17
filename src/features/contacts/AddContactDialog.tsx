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

import default_woman from '@/assets/default_woman.svg';
import default_man from '@/assets/default_man.svg';
import { useAllCompanies } from '@/logic/useAllCompanies';

export default function AddContactDialog() {
  const { openDialogName, closeDialog } = useDialog();
  const open = openDialogName === 'addContact';

  const { form, onSubmit } = useAddContactForm();

  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);

  const {
    companies,
    loading: companiesLoading,
    error: companiesError,
  } = useAllCompanies();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      const allGroups = await getAllGroups();
      setGroups(allGroups.map(({ id, name }) => ({ id, name })));
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      const allTags = await getAllTags();
      setTags(allTags.map(({ id, name }) => ({ id, name })));
    };
    fetchTags();
  }, []);

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

  const handleSubmit = async (data: any) => {
    setUploadingAvatar(true);
    try {
      await onSubmit(data);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset({
        firstName: '',
        surname: '',
        gender: '' as 'male' | 'female',
        email: '',
        contactNumber: '',
        groupIds: '',
        tagIds: '',
        companyIds: '',
        avatarUrl: '',
      });
      setAvatarPreview(null);
      closeDialog();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 py-4"
          >
            {/* Avatar Upload */}

            <FormItem>
              <FormLabel>Avatar</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  {/* Avatar preview or placeholder on the left */}
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300">
                    {avatarPreview || form.getValues('gender') ? (
                      <img
                        src={
                          avatarPreview ||
                          (form.getValues('gender') === 'male'
                            ? default_man
                            : default_woman)
                        }
                        alt="Avatar preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm text-gray-500">Logo</span>
                    )}
                  </div>

                  {/* File input with styled file button */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onAvatarChange}
                    className="block text-sm text-muted-foreground
          file:py-2 file:px-4 file:rounded-full
          file:border-0 file:text-sm file:font-semibold
          file:bg-[#005df4] file:text-white
          hover:file:bg-[#005df4]/90"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* Personal Info */}
            <section>
              <div className="border rounded-xl p-4 bg-muted/30 space-y-4">
                <h3 className="text-sm text-muted-foreground font-medium">
                  Personal Information
                </h3>
                <div className="flex flex-col md:flex-row gap-4">
                  {/* First Name */}
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Surname */}
                  <FormField
                    control={form.control}
                    name="surname"
                    render={({ field }) => (
                      <FormItem className="w-full">
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
            </section>

            {/* Contact Info */}
            <section>
              <div className="border rounded-xl p-4 bg-muted/30 space-y-4">
                <h3 className="text-sm text-muted-foreground font-medium">
                  Contact Information
                </h3>
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="john.doe@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Contact Number */}
                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem className="w-full">
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
            </section>

            {/* Profile Details */}
            <section>
              <div className="border rounded-xl p-4 bg-muted/30 space-y-4">
                <h3 className="text-sm text-muted-foreground font-medium">
                  Profile Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Gender */}
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={value => {
                              field.onChange(value);
                              if (!form.getValues('avatarUrl')) {
                                setAvatarPreview(
                                  value === 'male'
                                    ? default_man
                                    : default_woman,
                                );
                              }
                            }}
                            value={field.value || ''}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Group */}
                  <FormField
                    control={form.control}
                    name="groupIds"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Group</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ''}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select group" />
                            </SelectTrigger>
                            <SelectContent>
                              {groups.map(group => (
                                <SelectItem key={group.id} value={group.id}>
                                  {group.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tag */}
                  <FormField
                    control={form.control}
                    name="tagIds"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Tag</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ''}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select tag" />
                            </SelectTrigger>
                            <SelectContent>
                              {tags.map(tag => (
                                <SelectItem key={tag.id} value={tag.id}>
                                  {tag.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Company */}
                  <FormField
                    control={form.control}
                    name="companyIds"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ''}
                            disabled={companiesLoading || companiesError}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={
                                  companiesLoading
                                    ? 'Loading companies...'
                                    : companiesError
                                      ? 'Error loading companies'
                                      : 'Select company'
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {companies.length > 0 ? (
                                companies.map(company => (
                                  <SelectItem
                                    key={company.id}
                                    value={company.id}
                                  >
                                    {company.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="" disabled>
                                  No companies found
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </section>

            <DialogFooter>
              <Button
                type="submit"
                disabled={uploadingAvatar || form.formState.isSubmitting}
                className="bg-primaryBlue text-white px-6 py-3 text-base font-semibold transition duration-150 transform hover:scale-[1.02] active:scale-[0.98] shadow hover:shadow-md hover:bg-primaryBlue"
              >
                {uploadingAvatar ? 'Uploading Avatar...' : 'Add Contact'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
