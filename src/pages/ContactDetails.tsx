import { ContactHeader } from '@/features/contact/ContactHeader';
import { ContactInformationCard } from '@/features/contact/ContactInformationCard';
import { ContactTabs } from '@/features/contact/ContactTabs';
import { useContactDetail } from '@/logic/useContactDetails';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Contact() {
  const { contact, loading, error } = useContactDetail();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.16))]">
        Loading contact details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.16))] text-red-500">
        Error: {error.message}
      </div>
    );
  }

  if (!contact) {
    toast.error('Contact not found.');
    navigate('/contacts');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:p-8 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <ContactHeader contact={contact} />
          <ContactInformationCard contact={contact} />
        </div>

        <div className="md:col-span-1">
          <ContactTabs contact={contact} />
        </div>
      </div>
    </div>
  );
}
