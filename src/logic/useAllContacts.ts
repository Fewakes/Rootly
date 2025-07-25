import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import type { ContactWithDetails } from '@/services/assignContactService';

// Sorts contacts by favourite status, then alphabetically by name.
export const sortContacts = (
  contactList: ContactWithDetails[],
): ContactWithDetails[] => {
  return [...contactList].sort((a, b) => {
    if (a.favourite && !b.favourite) return -1;
    if (b.favourite && !a.favourite) return 1;
    return a.name.localeCompare(b.name);
  });
};

// Custom hook to fetch and manage all contacts for the main list view.
export const useAllContacts = () => {
  const [contacts, setContacts] = useState<ContactWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Core function to fetch data from the database.
  const fetchAndSortContacts = useCallback(async () => {
    setLoading(true);
    try {
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
      toast.error('Failed to load contacts.');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect for initial data fetch and real-time subscriptions.
  useEffect(() => {
    fetchAndSortContacts();

    const channel = supabase
      .channel('realtime-contacts-subscription')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contacts' },
        () => {
          console.log('Realtime change detected, refetching contacts...');
          fetchAndSortContacts();
        },
      )
      .subscribe();

    // Cleanup subscription on component unmount.
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAndSortContacts]);

  // Public API of the hook.
  return { contacts, loading, error, refetch: fetchAndSortContacts };
};
