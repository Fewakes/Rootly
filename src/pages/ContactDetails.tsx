import ContactBody from '@/features/contact/ContactBody';
import ContactHeader from '@/features/contact/ContactHeader';
import ContactInformation from '@/features/contact/ContatInformation';
import { useContactDetail } from '@/logic/useContactDetails';

export default function Contact() {
  const { contact, loading, error } = useContactDetail();

  if (loading) return <div className="p-6">Loading...</div>;
  if (error)
    return <div className="p-6 text-red-500">Error: {error.message}</div>;
  if (!contact) return <div className="p-6">Contact not found.</div>;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      <div className="flex-1 space-y-6">
        <ContactHeader contact={contact} />
        <ContactBody />
      </div>
      <ContactInformation contact={contact} />
    </div>
  );
}
