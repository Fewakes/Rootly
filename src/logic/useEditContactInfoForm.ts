import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useDialog } from '@/contexts/DialogContext';
import { updateContactInfo } from '@/services/contact';
import { useLogActivity } from './useLogActivity';
import { getCurrentUserId } from '@/services/users';

// --- Form Validation Schema ---
const contactInfoSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  contactNumber: z.string().optional(),
  location: z.string().optional(), // This maps to 'town'
  country: z.string().optional(),
  birthday: z.string().optional(),
  linkName: z.string().optional(),
  socialLink: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  companyId: z.string().optional(),
});

type ContactInfoFormData = z.infer<typeof contactInfoSchema>;

// --- Type definition for the contact object ---
type Contact = {
  id: string;
  name: string; // Required for logging purposes
  email: string;
  contact_number?: string | null;
  town?: string | null;
  country?: string | null;
  birthday?: string | null;
  link_name?: string | null;
  link_url?: string | null;
  contact_companies?: { id: string; name: string }[] | null;
} | null;

// --- Hook to manage the edit contact info form ---
export function useEditContactInfoForm(contactToEdit: Contact) {
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

  const form = useForm<ContactInfoFormData>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      email: '',
      contactNumber: '',
      location: '',
      country: '',
      birthday: '',
      linkName: '',
      socialLink: '',
      companyId: '',
    },
  });

  // Pre-fill form with existing contact data
  useEffect(() => {
    if (contactToEdit) {
      form.reset({
        email: contactToEdit.email || '',
        contactNumber: contactToEdit.contact_number || '',
        location: contactToEdit.town || '',
        country: contactToEdit.country || '',
        birthday: contactToEdit.birthday
          ? new Date(contactToEdit.birthday).toISOString().split('T')[0]
          : '',
        linkName: contactToEdit.link_name || '',
        socialLink: contactToEdit.link_url || '',
        companyId: contactToEdit.contact_companies?.[0]?.id || '',
      });
    }
  }, [contactToEdit, form]);

  const onSubmit = async (data: ContactInfoFormData) => {
    if (!contactToEdit || !userId) {
      toast.error('No contact or user selected for editing.');
      return;
    }

    try {
      await updateContactInfo(contactToEdit.id, data);

      // Log the activity on successful update
      logActivity('CONTACT_UPDATED', 'Contact', contactToEdit.id, {
        name: contactToEdit.name,
      });

      toast.success('Contact information updated successfully!');
      closeDialog();
    } catch (error: any) {
      toast.error(`Failed to update contact: ${error.message}`);
    }
  };

  return { form, onSubmit };
}
