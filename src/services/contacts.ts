import { supabase } from '@/lib/supabaseClient';
import type { Contact, NewContact } from '@/types/types';

/**
 * Fetch all contacts that belong to a specific user.
 * @param userId - The ID of the user.
 * @returns A list of Contact objects.
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
    .eq('user_id', userId)
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

/**
 * Fetch the most recent contacts, limited by a given number.
 * @param limit - The maximum number of contacts to return.
 * @returns A list of recent Contact objects.
 */
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
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent contacts:', error.message);
      throw new Error(error.message);
    }

    return (data ?? []).map((contact: any) => ({
      ...contact,
      contact_tags: Array.isArray(contact.contact_tags)
        ? contact.contact_tags.map((ct: any) => ct.tags)
        : [],
    }));
  } catch (err) {
    console.error(
      'Unexpected error fetching recent contacts:',
      (err as Error).message,
    );
    return [];
  }
};

/**
 * Fetch a single contact by ID.
 * @param contactId - The ID of the contact.
 * @returns The Contact object or null if not found.
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

    return {
      ...data,
      company: data.company ?? null,
      contact_groups: data.contact_groups?.map((g: any) => g.groups) ?? [],
      contact_tags: data.contact_tags?.map((t: any) => t.tags) ?? [],
    };
  } catch (err) {
    console.error('Unexpected error fetching contact:', (err as Error).message);
    return null;
  }
};

/**
 * Insert a new contact into the database.
 * @param contact - The new contact data to insert.
 * @returns The inserted contact object or null on error.
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
