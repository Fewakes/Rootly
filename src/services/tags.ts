import { supabase } from '@/lib/supabaseClient';
import type { NewTag, Tag, PopularTag } from '@/types/types';

export const getAllTags = async (): Promise<Tag[]> => {
  const { data, error } = await supabase
    .from('tags')
    .select(`id, name, color, created_at, contact_tags(count)`);

  if (error) {
    console.error('Error fetching tags:', error.message);
    return [];
  }

  const tagsWithCount = data.map((tag: any) => ({
    ...tag,
    contact_count: tag.contact_tags[0]?.count ?? 0,
  }));

  return tagsWithCount;
};

/**
 * Fetches the most popular tags based on the number of contacts using each tag.
 *
 * @param {number} limit - Maximum number of tags to return.
 * @returns {Promise<PopularTag[]>} Sorted array of popular tags.
 */
export const getPopularTags = async (limit: number): Promise<PopularTag[]> => {
  const { data, error } = await supabase.from('tags').select(`
      id,
      name,
      color,
      contact_tags(contact_id)
    `);

  if (error) {
    console.error('Error fetching popular tags:', error.message);
    return [];
  }

  // Map tags with contact usage count and sort descending
  const sortedTags = (data ?? [])
    .map(tag => ({
      id: tag.id,
      name: tag.name,
      color: tag.color,
      count: tag.contact_tags.length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return sortedTags;
};

/**
 * Inserts a new tag into the database.
 *
 * @param {NewTag} tag - Tag data to insert.
 * @returns {Promise<object | null>} The inserted tag object or null on failure.
 */
export const insertTag = async (tag: NewTag): Promise<object | null> => {
  try {
    const { data, error } = await supabase
      .from('tags')
      .insert([tag])
      .select()
      .single();

    if (error) {
      console.error('Error inserting tag:', error.message);
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error('Unexpected error inserting tag:', (err as Error).message);
    return null;
  }
};
