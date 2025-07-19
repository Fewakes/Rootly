import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useDialog } from '@/contexts/DialogContext';
import { useLogActivity } from '@/logic/useLogActivity';
import { updateContactProfile } from '@/services/contact';
import type { Company, Group, Tag } from '@/types/types';

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

type ProfileFormData = z.infer<typeof profileFormSchema>;

type ContactToEdit = {
  id: string;
  name: string;
  avatar_url?: string | null;
  gender?: string | null;
  contact_groups?: Group[];
  contact_tags?: Tag[];
  contact_companies?: Company[];
} | null;

export function useEditProfileForm(contactToEdit: ContactToEdit) {
  const { closeDialog, dialogPayload } = useDialog();
  const { logActivity } = useLogActivity();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: '',
      surname: '',
      avatarUrl: null,
      companyId: null,
      groupId: null,
      tagIds: [],
    },
  });

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
  }, [contactToEdit, form.reset]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!contactToEdit) return;

    await toast.promise(
      async () => {
        await updateContactProfile(contactToEdit.id, data);

        logActivity('CONTACT_UPDATED', 'Contact', contactToEdit.id, {
          name: `${data.firstName} ${data.surname || ''}`.trim(),
        });

        if (
          dialogPayload?.onActionSuccess &&
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
