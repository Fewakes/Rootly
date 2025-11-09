import { useEffect } from 'react';
import { useForm, type SubmitHandler, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useDialog } from '@/contexts/DialogContext';
import { useLogActivity } from '@/logic/useLogActivity';
import { updateContactInfo, updateContactProfile } from '@/services/contact';
import type { ContactWithDetails } from '@/types/types';

const profileFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  surname: z.string().optional(),
  email: z.string().email('Please provide a valid email address.'),
  contactNumber: z.string().optional(),
  location: z.string().optional(),
  country: z.string().optional(),
  birthday: z.string().optional(),
  linkName: z.string().optional(),
  socialLink: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      value => value === undefined || value === '' || /^https?:\/\/.+/.test(value),
      'Link must include http(s)://',
    ),
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
  email: string;
  contactNumber?: string;
  location?: string;
  country?: string;
  birthday?: string;
  linkName?: string;
  socialLink?: string;
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
      email: '',
      contactNumber: '',
      location: '',
      country: '',
      birthday: '',
      linkName: '',
      socialLink: '',
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
        email: contactToEdit.email || '',
        contactNumber: contactToEdit.contact_number || '',
        location: contactToEdit.town || '',
        country: contactToEdit.country || '',
        birthday: contactToEdit.birthday
          ? new Date(contactToEdit.birthday).toISOString().split('T')[0]
          : '',
        linkName: contactToEdit.link_name || '',
        socialLink: contactToEdit.link_url || '',
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

        await updateContactInfo(contactToEdit.id, {
          email: data.email,
          contactNumber: data.contactNumber,
          location: data.location,
          country: data.country,
          birthday: data.birthday,
          linkName: data.linkName,
          socialLink: data.socialLink,
          companyId: data.companyId || undefined,
        });

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
