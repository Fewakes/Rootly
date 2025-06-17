import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { TagWithContacts } from '@/types/types'; // You'll need an updated type

// ✨ This hook now fetches the nested contact data needed for the avatar stack
export const useAllTags = () => {
  const [tags, setTags] = useState<TagWithContacts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      setError(null);

      try {
        // This query now fetches each tag AND its related contacts (id and avatar_url)
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

        // Transform the data to the shape our component expects
        const tagsWithData = data.map(tag => ({
          ...tag,
          // The nested structure is a bit deep, so we flatten it
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

// You should also define the `TagWithContacts` type in your types file
// File: src/types/types.ts
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
