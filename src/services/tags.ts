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

export async function getTagById(tagId: string): Promise<Tag | null> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('id', tagId)
    .single();

  if (error) {
    console.error('Error fetching tag:', error);
    return null;
  }

  return data;
}

export async function deleteTag(tagId: string): Promise<boolean> {
  const { error } = await supabase.from('tags').delete().eq('id', tagId);

  if (error) {
    throw new Error(`Failed to delete tag: ${error.message}`);
  }

  return true;
}

export async function updateTag(tag: Tag) {
  const { error } = await supabase
    .from('tags')
    .update({
      name: tag.name,
      color: tag.color,
    })
    .eq('id', tag.id);

  return !error;
}

export async function addMultipleTagsToContact(
  contactId: string,
  tagIds: string[],
) {
  if (!tagIds || tagIds.length === 0) {
    console.warn('No tags provided to add to contact.');
    return;
  }

  const insertData = tagIds.map(tagId => ({
    contact_id: contactId,
    tag_id: tagId,
  }));

  const { error } = await supabase.from('contact_tags').insert(insertData);

  if (error) {
    console.error('Error adding multiple tags to contact:', error.message);
    throw error;
  }
}

/**
 * Fetches all tags with their contact counts, formatted for use in a pie chart.
 * This is an adapted version of your existing `getAllTags` function.
 */
export const getTagsDataForPieChart = async () => {
  const { data, error } = await supabase
    .from('tags')
    .select(`id, name, color, contact_tags(count)`);

  if (error) {
    console.error('Error fetching tags for chart:', error.message);
    throw error;
  }

  // Transform the data to match the shape the chart component expects:
  // - The count property is renamed to `value`.
  // - A fallback color is provided if one isn't set in your database.
  const chartData = data
    .map((tag: any) => ({
      id: tag.id,
      name: tag.name,
      color: tag.color || '#8884d8', // Use DB color or a fallback
      value: tag.contact_tags[0]?.count ?? 0,
    }))
    .filter(tag => tag.value > 0); // Only include tags that are in use

  return chartData;
};
