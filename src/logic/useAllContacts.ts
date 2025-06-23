import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { ContactWithDetails } from '@/services/assignContactService';

export const sortContacts = (contactList: ContactWithDetails[]) => {
  return [...contactList].sort((a, b) => {
    if (b.favourite && !a.favourite) return 1;

    if (a.favourite && !b.favourite) return -1;

    return a.name.localeCompare(b.name);
  });
};

export const useAllContacts = () => {
  const [contacts, setContacts] = useState<ContactWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAndSortContacts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('contacts').select(`
          id, name, email, avatar_url, created_at, favourite,
          contact_companies ( companies ( id, name, company_logo ) ),
          contact_groups ( groups ( id, name ) ),
          contact_tags ( tags ( id, name, color ) )
        `);

      if (error) throw error;

      const processedData = data.map(c => ({
        ...c,
        company: c.contact_companies[0]?.companies || null,
        groups: c.contact_groups.map(g => g.groups),
        tags: c.contact_tags.map(t => t.tags),
      }));

      setContacts(sortContacts(processedData));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndSortContacts();

    const channel = supabase
      .channel('realtime-contacts-subscription')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contacts' },
        payload => {
          console.log('Realtime change received!', payload);
          fetchAndSortContacts();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAndSortContacts]);

  return { contacts, setContacts, loading, error };
};
