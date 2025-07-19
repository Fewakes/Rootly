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

import { getAllTags } from '@/services/tags';
import { getAllGroups } from '@/services/groups';
import { getAllCompanies } from '@/services/companies';
import default_woman from '@/assets/default_woman.svg';
import default_man from '@/assets/default_man.svg';
import { useEditProfileForm } from '@/logic/useEditProfileForm';
import { MultiSelect } from '@/components/ui/multi-select';

export default function EditContactProfileDialog() {
  const { openDialogName, dialogPayload, closeDialog } = useDialog();
  const open = openDialogName === 'editProfile';

  const contactToEdit =
    dialogPayload?.type === 'editContact' ? dialogPayload.contact : null;

  const { form, onSubmit } = useEditProfileForm(contactToEdit);

  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      getAllGroups().then(allGroups =>
        setGroups(allGroups.map(({ id, name }) => ({ id, name }))),
      );
      getAllTags().then(allTags =>
        setTags(allTags.map(({ id, name }) => ({ id, name }))),
      );
      getAllCompanies().then(allCompanies => {
        console.log('Available Companies (Dropdown Options):', allCompanies);
        setCompanies(allCompanies.map(({ id, name }) => ({ id, name })));
      });
    }
  }, [open]);

  useEffect(() => {
    if (contactToEdit && open) {
      console.log('Assigned Company:', contactToEdit.contact_companies?.[0]);

      const nameParts = contactToEdit.name.split(' ') || [];
      const firstName = nameParts[0] || '';
      const surname = nameParts.slice(1).join(' ') || '';
      const groupId = contactToEdit.contact_groups?.[0]?.id || '';
      const tagIds = contactToEdit.contact_tags?.map(t => t.id) || [];
      const companyId = contactToEdit.contact_companies?.[0]?.id || '';

      form.reset({
        firstName: firstName,
        surname: surname,
        groupId: groupId,
        tagIds: tagIds,
        companyId: companyId,
        avatarUrl: contactToEdit.avatar_url || '',
      });

      setAvatarPreview(contactToEdit.avatar_url || null);
    }
  }, [contactToEdit, open, form]);

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('avatarUrl', file);
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      form.setValue('avatarUrl', contactToEdit?.avatar_url || '');
      setAvatarPreview(contactToEdit?.avatar_url || null);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      closeDialog();
      form.reset();
      setAvatarPreview(null);
    }
  };

  const defaultAvatar =
    contactToEdit?.gender === 'male' ? default_man : default_woman;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            <div className="border rounded-xl p-4 bg-muted/30 space-y-4">
              <h3 className="text-sm text-muted-foreground font-medium">
                Profile Details
              </h3>

              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300">
                      <img
                        src={avatarPreview || defaultAvatar}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onAvatarChange}
                      className="block text-sm text-muted-foreground file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#005df4] file:text-white hover:file:bg-[#005df4]/90"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="border rounded-xl p-4 bg-muted/30 space-y-4">
              <h3 className="text-sm text-muted-foreground font-medium">
                Organization
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="groupId"
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
                          {groups.map(g => (
                            <SelectItem key={g.id} value={g.id}>
                              {g.name}
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
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select company" />
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

                <FormField
                  control={form.control}
                  name="tagIds"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Tags</FormLabel>
                      <MultiSelect
                        options={tags.map(t => ({
                          value: t.id,
                          label: t.name,
                        }))}
                        selected={field.value || []}
                        onChange={field.onChange}
                        placeholder="Select tags..."
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
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
