import { supabase } from '@/lib/supabaseClient';
import type { Group, PopularGroup, Contact, GroupWithRank } from '@/types/types';

/**
 * Fetches all groups and includes a count of associated contacts.
 */
export const getAllGroups = async (): Promise<
  (Group & { contact_count: number })[]
> => {
  const { data, error } = await supabase
    .from('groups')
    .select('id, name, created_at, contact_groups(count)')
    .returns<(Group & { contact_groups: { count: number }[] })[]>();

  if (error) {
    console.error('Error fetching groups:', error.message);
    return [];
  }

  return (data || []).map(group => ({
    ...group,
    contact_count: group.contact_groups[0]?.count ?? 0,
  }));
};

/**
 * Fetches a list of the most popular groups based on contact count.
 * See the explanation below the code block for the required SQL.
 */
export const getPopularGroups = async (
  limit: number,
): Promise<PopularGroup[]> => {
  const { data, error } = await supabase
    .rpc('get_popular_groups', { p_limit: limit })
    .returns<PopularGroup[]>();

  if (error) {
    console.error('Error fetching popular groups:', error.message);
    return [];
  }

  return Array.isArray(data) ? (data as PopularGroup[]) : [];
};

/**
 * Inserts a single new group into the database.
 */
export const insertGroup = async (
  group: Omit<Group, 'id' | 'created_at'>,
): Promise<Group | null> => {
  const { data, error } = await supabase
    .from('groups')
    .insert([group])
    .select()
    .single<Group>();

  if (error) {
    console.error('Error inserting group:', error.message);
    throw new Error(error.message);
  }
  return data;
};

/**
 * Updates a group's details by its ID.
 */
export async function updateGroup(
  id: string,
  updates: Partial<Omit<Group, 'id' | 'created_at'>>,
): Promise<Group | null> {
  const { data, error } = await supabase
    .from('groups')
    .update(updates)
    .eq('id', id)
    .select()
    .single<Group>();

  if (error) {
    console.error('Failed to update group:', error);
    return null;
  }
  return data;
}

/**
 * Deletes a group by its ID.
 */
export async function deleteGroup(id: string): Promise<Group | null> {
  const { data, error } = await supabase
    .from('groups')
    .delete()
    .eq('id', id)
    .select()
    .single<Group>();

  if (error) {
    console.error('Failed to delete group:', error.message);
    return null;
  }
  return data;
}

/**
 * Fetches a single group's details including its popularity rank.
 */
export async function getGroupById(
  groupId: string,
): Promise<GroupWithRank | null> {
  const { data, error } = await supabase
    .rpc('get_group_details_with_rank', { p_group_id: groupId })
    .returns<(Group & { rank: number; total_groups: number }) | null>()
    .single();

  if (error) {
    console.error('Error fetching group by ID with rank:', error.message);
    return null;
  }
  if (!data) return null;

  const { total_groups, ...rest } = data as Group & {
    rank: number;
    total_groups: number;
  };

  return {
    ...rest,
    totalGroups: total_groups,
  };
}

/**
 * Fetches all groups and includes a list of associated contacts.
 */
export const getAllGroupsWithContactCounts = async (): Promise<
  { id: string; name: string; value: number; contacts: Pick<Contact, 'id' | 'avatar_url'>[] }[]
> => {
  type RawGroup = Group & {
    contacts: { contacts: Pick<Contact, 'id' | 'avatar_url'> | null }[];
  };

  const { data, error } = await supabase
    .from('groups')
    .select('id, name, contacts:contact_groups(contacts(id, avatar_url))')
    .returns<RawGroup[]>();

  if (error) {
    console.error('Error fetching groups with contacts:', error);
    throw error;
  }

  const mapped = (data ?? []).map(g => {
    const flattened: { id: string; avatar_url: string | null }[] = (g.contacts ?? [])
      .map(cg => cg.contacts)
      .filter(Boolean)
      .map((contact: any) => ({
        id: contact.id,
        avatar_url: contact.avatar_url ?? null,
      }));

    return {
      id: g.id,
      name: g.name,
      value: flattened.length,
      contacts: flattened,
    };
  });

  mapped.sort((a, b) => b.value - a.value);

  return mapped;
};
