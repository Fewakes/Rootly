import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { useDialog } from '@/contexts/DialogContext';
import { cn, TAG_BG_CLASSES, TAG_TEXT_CLASSES } from '@/lib/utils';

import { getAllTags } from '@/services/tags';
import { getAllGroups } from '@/services/groups';
import { getAllCompanies } from '@/services/companies';
import default_woman from '@/assets/default_woman.svg';
import default_man from '@/assets/default_man.svg';
import { useEditProfileForm } from '@/logic/useEditProfileForm';

const STEP_CONFIG = [
  { title: 'Profile basics', fields: ['firstName', 'surname', 'email', 'contactNumber'] },
  { title: 'Location & personal', fields: ['location', 'country', 'birthday'] },
  { title: 'Organization', fields: ['companyId', 'groupId', 'tagIds'] },
  { title: 'Online presence', fields: ['linkName', 'socialLink'] },
] as const;

type StepKey = (typeof STEP_CONFIG)[number]['fields'][number];

export default function EditContactProfileDialog() {
  const { openDialogName, dialogPayload, closeDialog } = useDialog();
  const open = openDialogName === 'editProfile';

  const contactToEdit =
    dialogPayload?.type === 'editContact' ? dialogPayload.contact : null;

  const { form, onSubmit } = useEditProfileForm(contactToEdit);

  const [tags, setTags] = useState<{ id: string; name: string; color: string | null }[]>([]);
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [tagSearch, setTagSearch] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (open) {
      getAllGroups().then(allGroups =>
        setGroups(allGroups.map(({ id, name }) => ({ id, name }))),
      );
      getAllTags().then(allTags =>
        setTags(allTags.map(({ id, name, color }) => ({ id, name, color: color ?? null }))),
      );
      getAllCompanies().then(allCompanies =>
        setCompanies(allCompanies.map(({ id, name }) => ({ id, name }))),
      );
      setCurrentStep(0);
      setTagSearch('');
    }
  }, [open]);

  useEffect(() => {
    if (contactToEdit && open) {
      const nameParts = contactToEdit.name.split(' ') || [];
      const firstName = nameParts[0] || '';
      const surname = nameParts.slice(1).join(' ') || '';
      const groupId = contactToEdit.contact_groups?.[0]?.id || '';
      const tagIds = contactToEdit.contact_tags?.map(t => t.id) || [];
      const companyId = contactToEdit.contact_companies?.[0]?.id || '';

      form.reset({
        firstName,
        surname,
        email: contactToEdit.email || '',
        contactNumber: contactToEdit.contact_number || '',
        location: contactToEdit.town || '',
        country: contactToEdit.country || '',
        birthday: contactToEdit.birthday
          ? new Date(contactToEdit.birthday).toISOString().split('T')[0]
          : '',
        linkName: contactToEdit.link_name || '',
        socialLink: contactToEdit.link_url || '',
        groupId,
        tagIds,
        companyId,
        avatarUrl: contactToEdit.avatar_url || '',
      });

      setAvatarPreview(contactToEdit.avatar_url || null);
    }
  }, [contactToEdit, open, form]);

  const onAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
      setTagSearch('');
      setCurrentStep(0);
    }
  };

  const defaultAvatar =
    contactToEdit?.gender === 'male' ? default_man : default_woman;

  const filteredTags = useMemo(() => {
    const term = tagSearch.trim().toLowerCase();
    if (!term) return tags;
    return tags.filter(tag => tag.name.toLowerCase().includes(term));
  }, [tags, tagSearch]);

  const totalSteps = STEP_CONFIG.length;

  const handleNext = async () => {
    const fields = [...STEP_CONFIG[currentStep].fields] as StepKey[];
    const isValid = await form.trigger(fields as any);
    if (!isValid) return;
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <section className="space-y-4 rounded-xl border bg-muted/20 p-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Profile details
              </h3>

              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border bg-muted">
                      <img
                        src={avatarPreview || defaultAvatar}
                        alt="Avatar preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onAvatarChange}
                      className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:font-semibold file:text-primary-foreground hover:file:bg-primary/90 sm:w-auto"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
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
            </section>

            <section className="space-y-4 rounded-xl border bg-muted/20 p-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Contact information
              </h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="name@company.com" {...field} />
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
                        <Input placeholder="e.g., +1 555 0101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>
          </div>
        );
      case 1:
        return (
          <section className="space-y-4 rounded-xl border bg-muted/20 p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Location & personal
            </h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Town / City</FormLabel>
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
                      <Input placeholder="e.g., United States" {...field} />
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
          </section>
        );
      case 2:
        return (
          <div className="space-y-6">
            <section className="space-y-4 rounded-xl border bg-muted/20 p-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Organization
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
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
              </div>
            </section>

            <section className="space-y-4 rounded-xl border bg-muted/20 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Tags
                </h3>
                <span className="text-xs text-muted-foreground">
                  Up to 3 selections
                </span>
              </div>
              <FormField
                control={form.control}
                name="tagIds"
                render={({ field }) => {
                  const selectedIds = new Set(field.value || []);
                  const limitReached = selectedIds.size >= 3;
                  const selectedTags = tags.filter(tag => selectedIds.has(tag.id));

                  const toggleTag = (tagId: string) => {
                    const next = new Set(selectedIds);
                    if (next.has(tagId)) {
                      next.delete(tagId);
                    } else {
                      if (next.size >= 3) return;
                      next.add(tagId);
                    }
                    field.onChange(Array.from(next));
                  };

                  return (
                    <FormItem className="space-y-4">
                      {selectedTags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedTags.map(tag => (
                            <span
                              key={tag.id}
                              className={cn(
                                'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium shadow-sm',
                                tag.color && TAG_BG_CLASSES[tag.color as keyof typeof TAG_BG_CLASSES]
                                  ? TAG_BG_CLASSES[tag.color as keyof typeof TAG_BG_CLASSES]
                                  : 'bg-primary/10',
                                tag.color && TAG_TEXT_CLASSES[tag.color as keyof typeof TAG_TEXT_CLASSES]
                                  ? TAG_TEXT_CLASSES[tag.color as keyof typeof TAG_TEXT_CLASSES]
                                  : 'text-primary',
                              )}
                            >
                              <span className="flex items-center gap-1">
                                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-background/70 text-[0.65rem] font-semibold text-primary">
                                  #
                                </span>
                                {tag.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleTag(tag.id)}
                                className="text-xs text-muted-foreground hover:text-foreground"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No tags selected yet.
                        </p>
                      )}

                      <div className="space-y-3">
                        <Input
                          value={tagSearch}
                          onChange={event => setTagSearch(event.target.value)}
                          placeholder="Search tags..."
                        />
                        <div className="grid gap-2 sm:grid-cols-2">
                          {filteredTags.length === 0 ? (
                            <p className="px-3 py-4 text-sm text-muted-foreground sm:col-span-2">
                              No tags match your search.
                            </p>
                          ) : (
                            filteredTags.map(tag => {
                              const isSelected = selectedIds.has(tag.id);
                              const disabled = !isSelected && limitReached;
                              return (
                                <button
                                  key={tag.id}
                                  type="button"
                                  onClick={() => toggleTag(tag.id)}
                                  disabled={disabled}
                                  className={cn(
                                    'flex items-center justify-between rounded-lg border px-3 py-2 text-left transition hover:border-primary hover:shadow-sm',
                                    isSelected && 'border-primary bg-primary/10',
                                    disabled && 'cursor-not-allowed opacity-60',
                                  )}
                                >
                                  <div className="flex items-center gap-3">
                                    <span
                                      className={cn(
                                        'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold',
                                        tag.color && TAG_BG_CLASSES[tag.color as keyof typeof TAG_BG_CLASSES]
                                          ? TAG_BG_CLASSES[tag.color as keyof typeof TAG_BG_CLASSES]
                                          : 'bg-muted',
                                        tag.color && TAG_TEXT_CLASSES[tag.color as keyof typeof TAG_TEXT_CLASSES]
                                          ? TAG_TEXT_CLASSES[tag.color as keyof typeof TAG_TEXT_CLASSES]
                                          : 'text-muted-foreground',
                                      )}
                                    >
                                      #{tag.name.charAt(0).toUpperCase()}
                                    </span>
                                    <div className="space-y-1">
                                      <p className="text-sm font-medium text-foreground">
                                        {tag.name}
                                      </p>
                                      <span className="text-xs text-muted-foreground">
                                        Click to {isSelected ? 'remove' : 'add'}
                                      </span>
                                    </div>
                                  </div>
                                  <Checkbox checked={isSelected} disabled={disabled} className="pointer-events-none" />
                                </button>
                              );
                            })
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {selectedIds.size} of 3 selected
                        </p>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </section>
          </div>
        );
      case 3:
        return (
          <section className="space-y-4 rounded-xl border bg-muted/20 p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Online presence
            </h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="linkName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link label</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., LinkedIn" {...field} />
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
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-h-[90vh] overflow-y-auto sm:max-w-xl lg:max-w-2xl xl:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Step {currentStep + 1} of {totalSteps}
              </div>
              <div className="flex items-center gap-2">
                {STEP_CONFIG.map((step, index) => (
                  <span
                    key={step.title}
                    className={cn(
                      'h-2 w-8 rounded-full bg-muted',
                      index <= currentStep && 'bg-primary',
                    )}
                  />
                ))}
              </div>
            </div>

            {renderStepContent()}

            <DialogFooter className="pt-2">
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {STEP_CONFIG[currentStep].title}
                </p>
                <div className="flex justify-end gap-2">
                  {currentStep > 0 && (
                    <Button type="button" variant="outline" onClick={handlePrevious}>
                      Back
                    </Button>
                  )}
                  {currentStep < totalSteps - 1 ? (
                    <Button type="button" onClick={handleNext}>
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? 'Saving…' : 'Save changes'}
                    </Button>
                  )}
                </div>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
