import { useEffect } from 'react';
import { useForm, type SubmitHandler, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useDialog } from '@/contexts/DialogContext';
import { useLogActivity } from '@/logic/useLogActivity';
import { updateContactProfile } from '@/services/contact';
import type { ContactWithDetails } from '@/types/types';

const profileFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  surname: z.string().optional(),
  avatarUrl: z.any().optional(),
  companyId: z.string().optional().nullable(),
  groupId: z.string().optional().nullable(),
  tagIds: z
    .array(z.string())
    .max(3, { message: 'A contact can have a maximum of 3 tags.' })
    .default([]),
});

type ProfileFormValues = {
  firstName: string;
  surname?: string;
  avatarUrl?: File | string | null;
  companyId?: string | null;
  groupId?: string | null;
  tagIds: string[];
};

export function useEditProfileForm(
  contactToEdit: ContactWithDetails | null,
): {
  form: UseFormReturn<ProfileFormValues>;
  onSubmit: SubmitHandler<ProfileFormValues>;
} {
  const { closeDialog, dialogPayload } = useDialog();
  const { logActivity } = useLogActivity();

  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: '',
      surname: '',
      avatarUrl: null,
      companyId: null,
      groupId: null,
      tagIds: [],
    },
  }) as UseFormReturn<ProfileFormValues>;

  useEffect(() => {
    if (contactToEdit) {
      const nameParts = contactToEdit.name.split(' ') || [];

      form.reset({
        firstName: nameParts[0] || '',
        surname: nameParts.slice(1).join(' ') || '',
        avatarUrl: contactToEdit.avatar_url || null,
        companyId: contactToEdit.contact_companies?.[0]?.id || null,
        groupId: contactToEdit.contact_groups?.[0]?.id || null,
        tagIds: contactToEdit.contact_tags?.map(t => t.id) || [],
      });
    }
  }, [contactToEdit, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!contactToEdit) return;

    await toast.promise(
      async () => {
        const payload = {
          firstName: data.firstName,
          surname: data.surname ?? '',
          groupId: data.groupId || undefined,
          companyId: data.companyId || undefined,
          tagIds: data.tagIds ?? [],
          avatarUrl: data.avatarUrl ?? undefined,
        };

        await updateContactProfile(contactToEdit.id, payload);

        logActivity('CONTACT_UPDATED', 'Contact', contactToEdit.id, {
          name: `${data.firstName} ${data.surname || ''}`.trim(),
        });

        if (
          dialogPayload &&
          'onActionSuccess' in dialogPayload &&
          typeof dialogPayload.onActionSuccess === 'function'
        ) {
          await dialogPayload.onActionSuccess();
        }
      },
      {
        loading: 'Saving profile...',
        success: () => {
          closeDialog();
          return 'Profile updated successfully!';
        },
        error: (err: any) => err.message || 'An unexpected error occurred.',
      },
    );
  };

  return { form, onSubmit };
}
