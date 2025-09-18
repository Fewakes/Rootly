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
            description,
            created_at,
            contacts:contact_groups(
              contacts(id, name, avatar_url)
            )
          `);

        if (error) throw error;

        const groupsWithData: GroupWithContacts[] = (data ?? []).map(group => {
          const contacts = group.contacts ?? [];
          const contactAvatars = contacts
            .map((c: any) => c.contacts)
            .filter(Boolean)
            .map((contact: any) => ({
              id: contact.id,
              name: contact.name,
              avatar_url: contact.avatar_url ?? null,
            }));

          return {
            id: group.id,
            name: group.name,
            description: group.description ?? null,
            created_at: group.created_at,
            contact_avatars: contactAvatars,
            contact_count: contacts.length,
          };
        });

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
