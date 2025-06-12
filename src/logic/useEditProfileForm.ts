import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { useDialog } from '@/contexts/DialogContext';
import { updateContactProfile } from '@/services/contact';
import { useLogActivity } from './useLogActivity';
import { getCurrentUserId } from '@/services/users';

// --- Form Validation Schema ---
const profileFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  surname: z.string().min(1, 'Surname is required'),
  groupId: z.string().optional(),
  tagId: z.string().optional(),
  avatarUrl: z.any().optional(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

type ContactToEdit = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  group?: { id: string; name: string } | null;
  tag?: { id: string; name: string } | null;
} | null;

// --- Hook to manage the edit profile form ---
export function useEditProfileForm(contactToEdit: ContactToEdit) {
  const { closeDialog } = useDialog();

  // Initialize activity logger
  const [userId, setUserId] = useState<string | null>(null);
  const { logActivity } = useLogActivity(userId);

  useEffect(() => {
    const fetchUser = async () => {
      const id = await getCurrentUserId();
      setUserId(id);
    };
    fetchUser();
  }, []);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: '',
      surname: '',
      groupId: '',
      tagId: '',
      avatarUrl: '',
    },
  });

  // Pre-fill form with existing contact data
  useEffect(() => {
    if (contactToEdit) {
      const nameParts = contactToEdit.name.split(' ');
      const firstName = nameParts[0] || '';
      const surname = nameParts.slice(1).join(' ') || '';

      form.reset({
        firstName: firstName,
        surname: surname,
        groupId: contactToEdit.group?.id || '',
        tagId: contactToEdit.tag?.id || '',
        avatarUrl: contactToEdit.avatarUrl || '',
      });
    }
  }, [contactToEdit, form]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!contactToEdit || !userId) {
      toast.error('No contact or user selected for editing.');
      return;
    }

    try {
      await updateContactProfile(contactToEdit.id, data);

      // Log the activity on successful update
      logActivity('CONTACT_UPDATED', 'Contact', contactToEdit.id, {
        name: `${data.firstName} ${data.surname}`,
      });

      toast.success('Profile updated successfully!');
      closeDialog();
    } catch (error: any) {
      toast.error(`Failed to update profile: ${error.message}`);
    }
  };

  return { form, onSubmit };
}
