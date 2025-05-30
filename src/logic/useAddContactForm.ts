import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useDialog } from '@/contexts/DialogContext';
import {
  insertContact,
  insertContactGroups,
  insertContactTags,
  uploadAvatar,
} from '@/services/contacts';
import { getCurrentUserId } from '@/services/users';
import default_woman from '@/assets/default_woman.svg';
import default_man from '@/assets/default_man.svg';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

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
  avatarUrl: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

type NewContact = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  gender: string;
  avatar_url: string;
  company_id: string | null;
  created_at: string;
  contact_number: string | null;
  town: string | null;
  country: string | null;
  birthday: string | null;
  link_name: string | null;
  link_url: string | null;
};

export function useAddContactForm() {
  const navigate = useNavigate();
  const { closeDialog } = useDialog();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      surname: '',
      gender: '',
      email: '',
      contactNumber: '',
      groupIds: '',
      tagIds: '',
      avatarUrl: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    const contactId = uuidv4();
    console.log('Generated contactId:', contactId);

    let finalAvatarUrl: string;
    if (data.avatarUrl instanceof File) {
      try {
        finalAvatarUrl = await uploadAvatar(data.avatarUrl, contactId);
      } catch (err) {
        return;
      }
    } else if (
      typeof data.avatarUrl === 'string' &&
      data.avatarUrl.length > 0
    ) {
      finalAvatarUrl = data.avatarUrl;
    } else {
      finalAvatarUrl = data.gender === 'male' ? default_man : default_woman;
    }

    const userId = await getCurrentUserId();
    if (!userId) {
      console.error('User not authenticated');
      return;
    }
    console.log('User ID:', userId);

    const newContact: NewContact = {
      id: contactId,
      user_id: userId,
      name: `${data.firstName} ${data.surname}`,
      email: data.email,
      gender: data.gender,
      avatar_url: finalAvatarUrl,
      company_id: null,
      created_at: new Date().toISOString(),
      contact_number: data.contactNumber || null,
      town: null,
      country: null,
      birthday: null,
      link_name: null,
      link_url: null,
    };

    try {
      const saved = await insertContact(newContact);
      console.log('Contact inserted:', saved);
      if (!saved) throw new Error('Insert contact returned falsy');

      if (data.groupIds) {
        await insertContactGroups(saved.id, [data.groupIds]);
      }
      if (data.tagIds) {
        await insertContactTags(saved.id, [data.tagIds]);
      }

      form.reset();
      closeDialog();

      toast.success('Contact created successfully', {
        description: 'Click below to view and update their information.',
        action: {
          label: 'View Contact',
          onClick: () => navigate(`/contacts/${saved.id}`),
        },
      });
    } catch (err) {
      console.error('Insert contact failed:', err);
      toast.error('Failed to create contact', {
        description: 'Something went wrong. Please try again.',
      });
    }
  };

  return { form, onSubmit };
}
