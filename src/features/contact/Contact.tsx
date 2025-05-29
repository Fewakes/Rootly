import { useContactDetail } from '@/logic/useContactDetails';
import ContactInformation from './ContatInformation';
import ContactBody from './ContactBody';
import ContactHeader from './ContactHeader';

export default function Contact() {
  const contact = useContactDetail();

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
