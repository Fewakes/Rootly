import HeaderSection from '@/features/contact/HeaderSection';
import InfoTabs from '@/features/contact/InfoTabs';
import SidebarInfo from '@/features/contact/SidebarInfo';
import { getContactById } from '@/lib/supabase/supabase';
import type { Contact } from '@/types/types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ContactDetail() {
  const { id } = useParams<{ id: string }>();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        if (!id) {
          throw new Error('No contact ID provided.');
        }

        setLoading(true);
        const contactData = await getContactById(id);

        if (!contactData) {
          throw new Error('Contact not found.');
        }

        setContact(contactData);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
        setContact(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [id]);

  if (loading) return <p>Loading contact...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!contact) return <p>No contact data found.</p>;

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
