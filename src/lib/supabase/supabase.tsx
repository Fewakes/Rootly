// Function to read current Users ID

import { supabase } from '@/lib/supabaseClient';
import type { Contact } from '@/types/types';

/**
 * Get the currently logged-in user's ID from Supabase Auth.
 * @returns {Promise<string|null>} - A promise that resolves to the user ID, or null if not logged in or error occurs.
 */
export const getCurrentUserId = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;

    const userId = session?.user?.id || null;
    return userId;
  } catch (err) {
    console.error('Failed to get current user ID:', err.message);
    return null;
  }
};

// Function to get Contacts Data based on User ID

/**
 * Fetch all contacts for a specific user.
 * @param {string} userId - The user ID whose contacts to retrieve.
 * @returns {Promise<Array>} - A promise that resolves to an array of contacts.
 */

export const getContactsByUser = async (userId: string): Promise<Contact[]> => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select(
        `
  id,
  name,
  email,
  avatar_url,
  created_at,
  company:companies!company_id(name, logo_url),
  contact_groups:contact_groups!inner(groups(id, name)),
  contact_tags:contact_tags!inner(tags(id, name, color))
`,
      )

      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contacts:', error.message);
      throw new Error(error.message);
    }
    // 🔍 Log the raw Supabase response
    console.log('Raw Supabase data:', data);

    const fixedData: Contact[] = (data ?? []).map((contact: any) => ({
      ...contact,
      company: contact.company ?? null,

      contact_groups: contact.contact_groups.map((g: any) => g.groups),
      contact_tags: contact.contact_tags.map((t: any) => t.tags),
    }));

    return fixedData;
  } catch (err) {
    console.error(
      'Unexpected error fetching contacts:',
      (err as Error).message,
    );

    return [];
  }
};

/**
 * Fetch recent contacts for a specific user, limited by number.
 * Returns only id, name, avatar_url, and contact_tags.
 *
 * @param {string} userId - The user ID whose recent contacts to retrieve.
 * @param {number} limit - The max number of recent contacts to fetch.
 * @returns {Promise<Contact[]>} - Promise resolving to an array of recent contacts.
 */
export const getRecentContactsByUser = async (
  userId: string,
  limit: number,
): Promise<Contact[]> => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select(
        `
    id,
    name,
    avatar_url,
    contact_tags:contact_tags!inner(tags(id, name, color))
  `,
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false }) // <-- This is the key line
      .limit(limit);

    if (error) {
      console.error('Error fetching recent contacts:', error.message);
      throw new Error(error.message);
    }

    const fixedData: Contact[] = (data ?? []).map((contact: any) => ({
      ...contact,
      contact_tags: Array.isArray(contact.contact_tags)
        ? contact.contact_tags.map((ct: any) => ct.tags)
        : [], // default to empty array if undefined or not an array
    }));

    return fixedData;
  } catch (err) {
    console.error(
      'Unexpected error fetching recent contacts:',
      (err as Error).message,
    );
    return [];
  }
};

import type { Tag } from '@/types/types'; // define this interface if you haven’t

export const getAllTags = async (): Promise<Tag[]> => {
  const { data, error } = await supabase
    .from('tags')
    .select('id, name, color, created_at');

  if (error) {
    console.error('Error fetching tags:', error.message);
    return [];
  }

  return data;
};

import type { Group } from '@/types/types'; // define this interface

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
