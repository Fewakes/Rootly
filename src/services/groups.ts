import { supabase } from '@/lib/supabaseClient';
import type { Group } from '@/types/types';
import type { PopularGroup } from '@/lib/supabase/supabase';

/**
 * Fetches all groups from the database.
 *
 * @returns {Promise<Group[]>} An array of all groups or an empty array on error.
 */
export const getAllGroups = async (): Promise<Group[]> => {
  const { data, error } = await supabase
    .from('groups')
    .select('name, created_at');

  if (error) {
    console.error('Error fetching groups:', error.message);
    return [];
  }

  return data;
};

/**
 * Fetches the most popular groups based on how many contacts are in each group.
 *
 * @returns {Promise<PopularGroup[]>} Sorted array of the top 5 most popular groups.
 */
export const getPopularGroups = async (): Promise<PopularGroup[]> => {
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
    .slice(0, 5);

  return sortedGroups;
};
