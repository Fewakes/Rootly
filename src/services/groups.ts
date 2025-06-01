import { supabase } from '@/lib/supabaseClient';
import type { Group, NewGroup } from '@/types/types';
export const getAllGroups = async (): Promise<
  (Group & { contact_count: number })[]
> => {
  const { data, error } = await supabase
    .from('groups')
    .select('id, name, created_at, contact_groups(count)');

  if (error) {
    console.error('Error fetching groups:', error.message);
    return [];
  }

  const groupsWithCount = data.map((group: any) => ({
    ...group,

    contact_count: group.contact_groups?.[0]?.count
      ? Number(group.contact_groups[0].count)
      : 0,
  }));

  return groupsWithCount;
};

/**
 * Fetches the most popular groups based on how many contacts are in each group.
 *
 * @returns {Promise<PopularGroup[]>} Sorted array of the top 5 most popular groups.
 */
export const getPopularGroups = async (
  limit: number,
): Promise<PopularGroup[]> => {
  const { data, error } = await supabase.from('contact_groups').select(
    `
      group_id,
      groups (
        id,
        name
      )
    `,
  );

  if (error) {
    console.error('Error fetching group contact data:', error.message);
    return [];
  }

  // Count how many times each group appears
  const groupCountMap: Record<string, { name: string; count: number }> = {};

  data?.forEach((entry: any) => {
    const groupId = entry.groups.id;
    const groupName = entry.groups.name;

    if (!groupCountMap[groupId]) {
      groupCountMap[groupId] = { name: groupName, count: 1 };
    } else {
      groupCountMap[groupId].count++;
    }
  });

  // Convert map to array, sort, and return top 5
  const sortedGroups: PopularGroup[] = Object.entries(groupCountMap)
    .map(([id, { name, count }]) => ({ id, name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return sortedGroups;
};

/**
 * Inserts a new group into the database.
 *
 * @param {NewGroup} group - Group data to insert.
 * @returns {Promise<object | null>} The inserted group object or null on failure.
 */
export const insertGroup = async (group: NewGroup): Promise<object | null> => {
  try {
    const { data, error } = await supabase
      .from('groups')
      .insert([group])
      .select()
      .single();

    if (error) {
      console.error('Error inserting group:', error.message);
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error('Unexpected error inserting group:', (err as Error).message);
    return null;
  }
};
