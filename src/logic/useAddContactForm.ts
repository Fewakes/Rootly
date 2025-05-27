// useAddContactForm.ts
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useDialog } from '@/contexts/DialogContext';
import { insertContact } from '@/services/contacts';
import { getCurrentUserId } from '@/services/users';
import default_woman from '@/assets/default_woman.svg';
import default_man from '@/assets/default_man.svg';
import { v4 as uuidv4 } from 'uuid';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  surname: z.string().min(1, 'Surname is required'),
  gender: z.enum(['male', 'female'], { required_error: 'Gender is required' }),
  email: z.string().email('Invalid email'),
  contactNumber: z.string().optional(),
});

export function useAddContactForm() {
  const navigate = useNavigate();
  const { closeDialog } = useDialog();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      surname: '',
      gender: 'male',
      email: '',
      contactNumber: '',
    },
  });

  const onSubmit = async data => {
    const avatarUrl = data.gender === 'male' ? default_man : default_woman;

    const newContact = {
      id: uuidv4(),
      user_id: await getCurrentUserId(),
      name: `${data.firstName} ${data.surname}`,
      email: data.email,
      gender: data.gender,
      avatar_url: avatarUrl,
      company_id: null,
      created_at: new Date().toISOString(),
      contact_number: data.contactNumber || null,
      town: null,
      country: null,
      birthday: null,
      link_name: null,
      link_url: null,
    };

    const saved = await insertContact(newContact);

    if (saved) {
      form.reset();
      closeDialog();
      navigate(`/contacts/${saved.id}`);
    } else {
      console.error('Failed to create contact');
    }
  };

  return { form, onSubmit };
}
