import { contacts } from '@/features/contacts/contacts';
import { useParams } from 'react-router-dom';
import HeaderSection from './HeaderSection';
import InfoTabs from './InfoTabs';
import SidebarInfo from './SidebarInfo';

export default function ContactDetail() {
  const { id } = useParams();
  const contact = contacts.find(c => c.id === parseInt(id || '', 10));

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
