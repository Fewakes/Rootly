import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useDialog } from '@/contexts/DialogContext';
import { insertContact, uploadAvatar } from '@/services/contacts';
import default_woman from '@/assets/default_woman.svg';
import default_man from '@/assets/default_man.svg';
import type { NewContact } from '@/types/types';
import { useLogActivity } from './useLogActivity';

const phoneRegex =
  /^(\+?\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}$/;

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  surname: z.string().min(1, 'Surname is required'),
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({ message: 'Please select a valid gender' }),
  }),
  email: z.string().email('Invalid email'),
  contactNumber: z
    .string()
    .optional()
    .refine(val => !val || phoneRegex.test(val), {
      message: 'Invalid phone number format',
    }),
  groupIds: z.string().optional(),
  tagIds: z.string().optional(),
  companyIds: z.string().optional(),
  avatarUrl: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function useAddContactForm() {
  const navigate = useNavigate();
  const { closeDialog } = useDialog();

  const { logActivity, userId } = useLogActivity();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      surname: '',
      gender: '' as 'male' | 'female',
      email: '',
      contactNumber: '',
      groupIds: '',
      tagIds: '',
      companyIds: '',
      avatarUrl: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!userId) {
      toast.error('Authentication error. Please log in again.');
      return;
    }

    try {
      const contactId = uuidv4();
      let finalAvatarUrl: string;

      if (data.avatarUrl instanceof File) {
        finalAvatarUrl = await uploadAvatar(data.avatarUrl, contactId);
      } else {
        finalAvatarUrl = data.gender === 'male' ? default_man : default_woman;
      }

      const newContact: NewContact = {
        id: contactId,
        user_id: userId,
        name: `${data.firstName} ${data.surname}`,
        email: data.email,
        gender: data.gender,
        avatar_url: finalAvatarUrl,
        created_at: new Date().toISOString(),
        contact_number: data.contactNumber || null,
        town: null,
        country: null,
        birthday: null,
        link_name: null,
        link_url: null,
      };

      const saved = await insertContact(
        newContact,
        data.tagIds ? [data.tagIds] : [],
        data.groupIds ? [data.groupIds] : [],
        data.companyIds ? [data.companyIds] : [],
      );

      if (!saved) throw new Error('Failed to save contact');

      logActivity('CONTACT_CREATED', 'Contact', saved.id, {
        name: newContact.name,
      });

      toast.success('Contact created successfully', {
        action: {
          label: 'View Contact',
          onClick: () => navigate(`/contacts/${saved.id}`),
        },
      });

      form.reset();
      closeDialog();
    } catch (err: any) {
      toast.error('Failed to create contact', {
        description: err.message || 'An unexpected error occurred.',
      });
    }
  };

  return { form, onSubmit };
}
