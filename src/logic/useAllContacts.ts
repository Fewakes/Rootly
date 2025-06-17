import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { ContactWithDetails } from '@/types/types'; // You'll need an updated type

export const useAllContacts = () => {
  const [contacts, setContacts] = useState<ContactWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllContacts = async () => {
      setLoading(true);
      setError(null);
      try {
        // This query fetches contacts and all their related info at once
        const { data, error } = await supabase.from('contacts').select(`
            id, name, email, avatar_url, created_at,
            contact_companies ( companies ( id, name, company_logo ) ),
            contact_groups ( groups ( id, name ) ),
            contact_tags ( tags ( id, name, color ) )
          `);

        if (error) throw error;

        // Transform the data to a flatter, easier-to-use structure
        const processedData = data.map(c => ({
          ...c,
          company: c.contact_companies[0]?.companies || null,
          groups: c.contact_groups.map(g => g.groups),
          tags: c.contact_tags.map(t => t.tags),
        }));

        setContacts(processedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllContacts();
  }, []);

  return { contacts, loading, error };
};

// You should also define the `ContactWithDetails` type in your types file
// File: src/types/types.ts
export type ContactWithDetails = {
  id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  company: { id: string; name: string; company_logo: string | null } | null;
  groups: { id: string; name: string }[];
  tags: { id: string; name: string; color: string | null }[];
};
