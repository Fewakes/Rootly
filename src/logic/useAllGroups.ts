import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { GroupWithContacts } from '@/types/types';

export const useAllGroups = () => {
  const [groups, setGroups] = useState<GroupWithContacts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllGroups = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.from('groups').select(`
            id,
            name,
            created_at,
            contacts:contact_groups(
              contacts(id, name, avatar_url)
            )
          `);

        if (error) throw error;

        const groupsWithData = data.map(group => ({
          ...group,
          contact_avatars: group.contacts.map(c => c.contacts).filter(Boolean),
          contact_count: group.contacts.length,
        }));

        setGroups(groupsWithData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllGroups();
  }, []);

  return { groups, loading, error };
};

export type GroupWithContacts = {
  id: string;
  name: string;
  created_at: string;
  contact_count: number;
  contact_avatars: {
    id: string;
    name: string | null;
    avatar_url: string | null;
  }[];
};
