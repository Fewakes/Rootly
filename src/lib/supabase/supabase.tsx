// Function to read current Users ID

import { supabase } from '@/lib/supabaseClient';
import type { Contact, NewContact } from '@/types/types';

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

/**
 * Fetch all contacts for the currently authenticated user.
 * Returns contacts with related company, groups, and tags.
 *
 * @returns {Promise<Contact[]>} - Promise resolving to an array of contacts.
 */
export const getContactsByUser = async (userId: string): Promise<Contact[]> => {
  const { data, error } = await supabase
    .from('contacts')
    .select(
      `
      id,
      name,
      email,
      avatar_url,
      created_at,
      contact_number,
      town,
      country,
      birthday,
      link_name,
      link_url,
      gender,
      company:companies!company_id(name, logo_url),
      contact_groups(groups(id, name)),
      contact_tags(tags(id, name, color))
    `,
    )
    .eq('user_id', userId) // Adjust if you're using some other auth logic
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contacts:', error.message);
    return [];
  }

  return data.map((c: any) => ({
    ...c,
    company: c.company ?? null,
    contact_groups: c.contact_groups?.map((g: any) => g.groups) ?? [],
    contact_tags: c.contact_tags?.map((t: any) => t.tags) ?? [],
  }));
};

export const getRecentContacts = async (limit: number): Promise<Contact[]> => {
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
      .order('created_at', { ascending: false }) // most recent first
      .limit(limit);

    if (error) {
      console.error('Error fetching recent contacts:', error.message);
      throw new Error(error.message);
    }

    const fixedData: Contact[] = (data ?? []).map((contact: any) => ({
      ...contact,
      contact_tags: Array.isArray(contact.contact_tags)
        ? contact.contact_tags.map((ct: any) => ct.tags)
        : [],
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

export interface PopularTag extends Tag {
  user_count: number;
}

// lib/supabase/supabase.ts
import type { PopularTag } from '@/types/types';

export const getPopularTags = async (limit: number): Promise<PopularTag[]> => {
  const { data, error } = await supabase.from('tags').select(`
      id,
      name,
      color,
      contact_tags(
        contact_id
      )
    `);

  if (error) {
    console.error('Error fetching popular tags:', error.message);
    return [];
  }

  // Count how many contacts are using each tag
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

// supabase.ts or wherever your Supabase functions live

export interface PopularGroup {
  id: string;
  name: string;
  count: number;
}

/**
 * Fetch the top 5 most popular groups based on number of contacts assigned.
 * @returns Promise<PopularGroup[]>
 */
export const getPopularGroups = async (): Promise<PopularGroup[]> => {
  const { data, error } = await supabase
    .from('contact_groups')
    .select(
      `
      group_id,
      groups (
        id,
        name
      )
    `,
    )
    .limit(1000); // arbitrary large limit to avoid excessive querying

  if (error) {
    console.error('Error fetching group contact data:', error.message);
    return [];
  }

  // Count how many times each group_id appears
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

  // Convert to array and sort by count descending
  const sortedGroups: PopularGroup[] = Object.entries(groupCountMap)
    .map(([id, { name, count }]) => ({ id, name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // top 5

  return sortedGroups;
};

/**
 * Fetch a single contact by ID with all associated data.
 * Includes company, contact groups, and tags.
 *
 * @param {string} contactId - The ID of the contact to fetch.
 * @returns {Promise<Contact | null>} - Promise resolving to a single contact object, or null if not found.
 */
export const getContactById = async (
  contactId: string,
): Promise<Contact | null> => {
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
        contact_number,
        town,
        country,
        birthday,
        link_name,
        link_url,
        gender,
        company:companies!company_id(name, logo_url),
        contact_groups:contact_groups(groups(id, name)),
        contact_tags:contact_tags(tags(id, name, color))
      `,
      )
      .eq('id', contactId)
      .single();

    if (error) {
      console.error(
        `Error fetching contact with ID ${contactId}:`,
        error.message,
      );
      throw new Error(error.message);
    }

    if (!data) return null;

    const contact: Contact = {
      ...data,
      company: data.company ?? null,
      contact_groups: data.contact_groups?.map((g: any) => g.groups) ?? [],
      contact_tags: data.contact_tags?.map((t: any) => t.tags) ?? [],
    };

    return contact;
  } catch (err) {
    console.error('Unexpected error fetching contact:', (err as Error).message);
    return null;
  }
};

/**
 * Insert a new contact into the database.
 *
 * @param {object} contact - The full contact object to insert.
 * @returns {Promise<object | null>} - The inserted contact or null on failure.
 */
export const insertContact = async (
  contact: NewContact,
): Promise<object | null> => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .insert([contact])
      .select()
      .single();

    if (error) {
      console.error('Error inserting contact:', error.message);
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error(
      'Unexpected error inserting contact:',
      (err as Error).message,
    );
    return null;
  }
};
