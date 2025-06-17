import { supabase } from '@/lib/supabaseClient';
import type { NewTag, Tag, PopularTag } from '@/types/types';

type TagUpdatePayload = {
  name?: string;
  description?: string;
  color?: string;
};

export const getAllTags = async (): Promise<Tag[]> => {
  const { data, error } = await supabase
    .from('tags')
    .select(`id, name, color, created_at, description, contact_tags(count)`);

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
      description,
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

export async function updateTag(
  id: string,
  data: TagUpdatePayload,
): Promise<boolean> {
  const { error } = await supabase.from('tags').update(data).eq('id', id);

  if (error) {
    console.error('Supabase update error:', error);
    throw new Error(error.message);
  }

  return true;
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

export const getTagsDataForPieChart = async () => {
  const { data, error } = await supabase
    .from('tags')
    .select(`id, name, color, contact_tags(count)`);

  if (error) {
    console.error('Error fetching tags for chart:', error.message);
    throw error;
  }

  const chartData = data
    .map((tag: any) => ({
      id: tag.id,
      name: tag.name,
      color: tag.color || '#8884d8',
      value: tag.contact_tags[0]?.count ?? 0,
    }))
    .filter(tag => tag.value > 0);

  return chartData;
};

export async function getTagByIdWithRank(tagId: string): Promise<Tag | null> {
  const { data, error } = await supabase
    .rpc('get_tag_details_with_rank', {
      p_tag_id: tagId,
    })
    .single();

  if (error) {
    console.error('Error fetching tag by ID with rank:', error.message);

    throw error;
  }

  return data;
}
