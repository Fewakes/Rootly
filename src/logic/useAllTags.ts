import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { TagWithContacts } from '@/types/types';

export const useAllTags = () => {
  const [tags, setTags] = useState<TagWithContacts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.from('tags').select(`
            id,
            name,
            color,
            created_at,
            contacts:contact_tags(
              contacts(id, avatar_url)
            )
          `);

        if (error) throw error;

        const tagsWithData = (data ?? []).map(tag => {
          const contacts = tag.contacts ?? [];
          return {
            ...tag,
            contact_avatars: contacts
              .map((c: any) => c.contacts)
              .filter(Boolean),
            contact_count: contacts.length,
          } as TagWithContacts;
        });

        setTags(tagsWithData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  return { tags, loading, error };
};
