// src/components/AddContactDialog.tsx

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
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserIcon, Users, Tags, Building2 } from 'lucide-react';

import { useDialog } from '@/contexts/DialogContext';
import { useAddContactForm } from '@/logic/useAddContactForm';
import { getAllTags } from '@/services/tags'; // Assuming this is correct
import { getAllGroups } from '@/services/groups'; // Assuming this is correct

import default_woman from '@/assets/default_woman.svg';
import default_man from '@/assets/default_man.svg';
import { useAllCompanies } from '@/logic/useAllCompanies';

export default function AddContactDialog() {
  const { openDialogName, closeDialog } = useDialog();
  const open = openDialogName === 'addContact';

  const { form, onSubmit } = useAddContactForm();

  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  // NEW: Use the useAllCompanies hook
  const {
    companies,
    loading: companiesLoading,
    error: companiesError,
  } = useAllCompanies();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Fetch groups on mount
  useEffect(() => {
    const fetchGroups = async () => {
      const allGroups = await getAllGroups();
      setGroups(allGroups.map(({ id, name }) => ({ id, name })));
    };
    fetchGroups();
  }, []);

  // Fetch tags on mount
  useEffect(() => {
    const fetchTags = async () => {
      const allTags = await getAllTags();
      setTags(allTags.map(({ id, name }) => ({ id, name })));
    };
    fetchTags();
  }, []);

  // Handle avatar file selection and preview
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

  // Wrapper for onSubmit to handle loading state
  const handleSubmit = async (data: any) => {
    setUploadingAvatar(true);
    try {
      await onSubmit(data);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Resetting on Dialog Open Change
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
                <input
                  type="file"
                  accept="image/*"
                  onChange={onAvatarChange}
                  className="block w-full text-sm text-muted-foreground
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-primary-foreground
                  hover:file:bg-primary/80"
                />
              </FormControl>
              {(avatarPreview || form.getValues('gender')) && (
                <img
                  src={
                    avatarPreview ||
                    (form.getValues('gender') === 'male'
                      ? default_man
                      : default_woman)
                  }
                  alt="Avatar preview"
                  className="mt-2 h-24 w-24 rounded-full object-cover"
                />
              )}
              <FormMessage />
            </FormItem>

            {/* Personal Info */}
            <section>
              <h3 className="text-sm text-muted-foreground font-medium mb-2">
                Personal Information
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
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
            </section>

            <Separator />

            {/* Contact Info */}
            <section>
              <h3 className="text-sm text-muted-foreground font-medium mb-2">
                Contact Information
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john.doe@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
            </section>

            <Separator />

            {/* Profile Details */}
            <section>
              <h3 className="text-sm text-muted-foreground font-medium mb-2">
                Profile Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Gender */}
                <div className="border rounded-xl p-4 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Gender
                    </span>
                  </div>
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
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
                            <SelectTrigger>
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
                </div>

                {/* Group */}
                <div className="border rounded-xl p-4 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Group
                    </span>
                  </div>
                  <FormField
                    control={form.control}
                    name="groupIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ''}
                          >
                            <SelectTrigger>
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
                </div>

                {/* Tag */}
                <div className="border rounded-xl p-4 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Tags className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Tag
                    </span>
                  </div>
                  <FormField
                    control={form.control}
                    name="tagIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ''}
                          >
                            <SelectTrigger>
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
                </div>

                <div className="border rounded-xl p-4 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Company
                    </span>
                  </div>
                  <FormField
                    control={form.control}
                    name="companyIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ''}
                            disabled={companiesLoading || companiesError}
                          >
                            <SelectTrigger>
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
