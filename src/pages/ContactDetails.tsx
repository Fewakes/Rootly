import HeaderSection from '@/features/contact/HeaderSection';
import InfoTabs from '@/features/contact/InfoTabs';
import SidebarInfo from '@/features/contact/SidebarInfo';
import { contacts } from '@/features/contacts/contacts';
import { useParams } from 'react-router-dom';

export default function ContactDetail() {
  const { id } = useParams();
  const contact = contacts.find(c => c.id === parseInt(id || '', 10));

  if (!contact) return <div className="p-6">Contact not found.</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-4xl font-bold">Contact</h1>
      <div className=" flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <HeaderSection contact={contact} />
          <InfoTabs />
        </div>
        <SidebarInfo contact={contact} />
      </div>
    </div>
  );
}
