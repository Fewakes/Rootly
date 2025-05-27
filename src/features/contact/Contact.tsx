import { useContactDetail } from '@/logic/useContactDetails';
import HeaderSection from './ContactHeader';
import InfoTabs from './ContactBody';
import SidebarInfo from './ContatInformation';

export default function Contact() {
  const contact = useContactDetail();

  if (!contact) return <div className="p-6">Contact not found.</div>;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      <div className="flex-1 space-y-6">
        <HeaderSection contact={contact} />
        <InfoTabs />
      </div>
      <SidebarInfo contact={contact} />
    </div>
  );
}
