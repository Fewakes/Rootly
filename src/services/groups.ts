import { supabase } from '@/lib/supabaseClient';
import type { Group, NewGroup, PopularGroup } from '@/types/types';
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

  const sortedGroups: PopularGroup[] = Object.entries(groupCountMap)
    .map(([id, { name, count }]) => ({ id, name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return sortedGroups;
};

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

export async function updateGroup(id: string, updates: { name: string }) {
  const { data, error } = await supabase
    .from('groups')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Failed to update group:', error);
    return null;
  }

  return data;
}

export async function deleteGroup(id: string) {
  const { data, error } = await supabase
    .from('groups')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Failed to delete group:', error.message);
    return null;
  }

  return data;
}

export async function getGroupById(groupId: string): Promise<Group | null> {
  const { data, error } = await supabase
    .rpc('get_group_details_with_rank', {
      p_group_id: groupId,
    })
    .single();

  if (error) {
    console.error('Error fetching group by ID with rank:', error.message);
    return null;
  }
  return data;
}

export const getAllGroupsWithContactCounts = async () => {
  const { data, error } = await supabase
    .from('groups')
    .select('id, name, contacts!contact_groups(id, avatar_url)');

  if (error) {
    console.error('Error fetching groups with contacts:', error);
    throw error;
  }

  return data
    .map(group => ({
      id: group.id,
      name: group.name,
      value: group.contacts?.length || 0,
      contacts: group.contacts || [],
    }))
    .sort((a, b) => b.value - a.value);
};
