import { supabase } from '@/lib/supabaseClient';
import {
  TAG_SOLID_COLORS,
  TAG_BG_CLASSES,
  TAG_TEXT_CLASSES,
} from '@/lib/utils';
import type {
  Tag,
  PopularTag,
  TagColor,
  TagWithRank,
  TagUpdatePayload,
  ChartData,
  Contact,
} from '@/types/types';

/**
 * Fetches all tags and includes a count of associated contacts.
 */
export const getAllTags = async (): Promise<
  (Tag & { contact_count: number })[]
> => {
  const { data, error } = await supabase
    .from('tags')
    .select(`id, name, color, created_at, description, contact_tags(count)`)
    .returns<(Tag & { contact_tags: { count: number }[] })[]>();

  if (error) {
    console.error('Error fetching tags:', error.message);
    return [];
  }

  return (data || []).map(tag => ({
    ...tag,
    contact_count: tag.contact_tags[0]?.count ?? 0,
  }));
};

/**
 * Fetches tags sorted by the number of contacts they are associated with.
 */
export const getPopularTags = async (limit: number): Promise<PopularTag[]> => {
  const { data, error } = await supabase
    .from('tags')
    .select(`id, name, color, description, contact_tags(contact_id)`)
    .returns<(Tag & { contact_tags: { contact_id: string }[] })[]>();

  if (error) {
    console.error('Error fetching popular tags:', error.message);
    return [];
  }

  return (data ?? [])
    .map(tag => ({
      ...tag,
      count: tag.contact_tags.length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

/**
 * Inserts a single new tag into the database.
 */
export const insertTag = async (
  tag: Omit<Tag, 'id' | 'created_at'>,
): Promise<Tag | null> => {
  const { data, error } = await supabase
    .from('tags')
    .insert([tag])
    .select()
    .single<Tag>();

  if (error) {
    console.error('Error inserting tag:', error.message);
    throw new Error(error.message);
  }
  return data;
};

/**
 * Fetches a single tag by its ID.
 */
export async function getTagById(tagId: string): Promise<Tag | null> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('id', tagId)
    .single<Tag>();

  if (error) {
    return null;
  }
  return data;
}

/**
 * Deletes a tag by its ID.
 */
export async function deleteTag(tagId: string): Promise<boolean> {
  const { error } = await supabase.from('tags').delete().eq('id', tagId);
  if (error) {
    throw new Error(`Failed to delete tag: ${error.message}`);
  }
  return true;
}

/**
 * Updates a tag with new data.
 */
export async function updateTag(
  id: string,
  data: TagUpdatePayload,
): Promise<boolean> {
  const { error } = await supabase.from('tags').update(data).eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
  return true;
}

/**
 * Associates multiple tags with a single contact.
 */
export async function addMultipleTagsToContact(
  contactId: string,
  tagIds: string[],
) {
  if (!tagIds || tagIds.length === 0) return;

  const insertData = tagIds.map(tagId => ({
    contact_id: contactId,
    tag_id: tagId,
  }));

  const { error } = await supabase.from('contact_tags').insert(insertData);
  if (error) {
    throw error;
  }
}

/**
 * Fetches and formats tag data for use in charts.
 */
export const getTagsDataForChart = async (): Promise<ChartData[]> => {
  const { data, error } = await supabase
    .from('tags')
    .select('id, name, color, contact_tags(contacts(id, avatar_url))');

  if (error) {
    console.error('Error fetching tags for chart:', error.message);
    throw error;
  }

  return (data || [])
    .map(tag => {
      const colorKey: TagColor =
        tag.color in TAG_SOLID_COLORS ? tag.color : 'rose';

      // Flatten nested structure: contact_tags[].contacts
      const flattenedContacts: Pick<Contact, 'id' | 'avatar_url'>[] = (
        tag.contact_tags?.map(ct => ct.contacts).filter(Boolean) ?? []
      ).map((contact: any) => ({
        id: contact.id,
        avatar_url: contact.avatar_url ?? null,
      }));

      return {
        id: tag.id,
        name: tag.name,
        value: flattenedContacts.length,
        color: TAG_SOLID_COLORS[colorKey],
        bgColorClass: TAG_BG_CLASSES[colorKey],
        textColorClass: TAG_TEXT_CLASSES[colorKey],
        contacts: flattenedContacts,
      };
    })
    .sort((a, b) => b.value - a.value);
};

/**
 * Fetches a single tag's details including its popularity rank.
 */
export async function getTagByIdWithRank(
  tagId: string,
): Promise<TagWithRank | null> {
  const { data, error } = await supabase
    .rpc('get_tag_details_with_rank', { p_tag_id: tagId })
    .single<Tag & { rank: number; total_tags: number }>();

  if (error) {
    console.error('Error fetching tag by ID with rank:', error.message);
    return null;
  }
  if (!data) return null;

  const { total_tags, ...rest } = data;

  return {
    ...rest,
    totalTags: total_tags,
  };
}
