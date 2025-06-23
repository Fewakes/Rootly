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

        const tagsWithData = data.map(tag => ({
          ...tag,

          contact_avatars: tag.contacts.map(c => c.contacts).filter(Boolean),
          contact_count: tag.contacts.length,
        }));

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

export type TagWithContacts = {
  id: string;
  name: string;
  color: string | null;
  created_at: string;
  contact_count: number;
  contact_avatars: {
    id: string;
    avatar_url: string | null;
  }[];
};
