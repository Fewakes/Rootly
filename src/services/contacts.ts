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
        contact_tags:contact_tags(tags(id, name, color))
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
 * Inserts a new contact into the database, and links it to selected tags and groups.
 *
 * @param contact - The contact data to be inserted.
 * @param tagIds - An array of tag IDs to assign to this contact.
 * @param groupIds - An array of group IDs to assign to this contact.
 * @returns The inserted contact object or null if an error occurred.
 */
export const insertContact = async (
  contact: NewContact,
  tagIds: string[] = [],
  groupIds: string[] = [],
): Promise<object | null> => {
  try {
    // 1. Insert the contact into the 'contacts' table
    const { data: contactData, error: contactError } = await supabase
      .from('contacts')
      .insert([contact]) // Insert as an array
      .select() // Return the inserted row(s)
      .single(); // Expect only one result

    if (contactError || !contactData) {
      console.error('Error inserting contact:', contactError?.message);
      throw new Error(contactError?.message);
    }

    const contactId = contactData.id;

    // 2. Insert assigned tags into 'contact_tags' table
    if (tagIds.length > 0) {
      // Create an array of { contact_id, tag_id } objects
      const tagInserts = tagIds.map(tagId => ({
        contact_id: contactId,
        tag_id: tagId,
      }));

      const { error: tagError } = await supabase
        .from('contact_tags')
        .insert(tagInserts);

      if (tagError) {
        console.error('Error linking tags to contact:', tagError.message);
        throw new Error(tagError.message);
      }
    }

    // 3. Insert assigned groups into 'contact_groups' table
    if (groupIds.length > 0) {
      // Create an array of { contact_id, group_id } objects
      const groupInserts = groupIds.map(groupId => ({
        contact_id: contactId,
        group_id: groupId,
      }));

      const { error: groupError } = await supabase
        .from('contact_groups')
        .insert(groupInserts);

      if (groupError) {
        console.error('Error linking groups to contact:', groupError.message);
        throw new Error(groupError.message);
      }
    }

    // 4. Return the newly created contact data
    return contactData;
  } catch (err) {
    console.error(
      'Unexpected error inserting contact with tags/groups:',
      (err as Error).message,
    );
    return null;
  }
};

export async function insertContactGroups(
  contactId: string,
  groupIds: string[],
) {
  if (!groupIds?.length) return;
  const entries = groupIds.map(groupId => ({
    contact_id: contactId,
    group_id: groupId,
  }));
  const { error } = await supabase.from('contact_groups').insert(entries);
  if (error) throw error;
}

export async function insertContactTags(contactId: string, tagIds: string[]) {
  if (!tagIds?.length) return;
  const entries = tagIds.map(tagId => ({
    contact_id: contactId,
    tag_id: tagId,
  }));
  const { error } = await supabase.from('contact_tags').insert(entries);
  if (error) throw error;
}

export async function uploadAvatar(
  file: File,
  contactId: string,
): Promise<string> {
  const filePath = `${contactId}.png`;

  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      upsert: true,
      cacheControl: '3600',
      contentType: file.type,
    });

  if (error) throw error;

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

  if (!data?.publicUrl) throw new Error('Failed to get public URL');

  return data.publicUrl;
}

export async function deleteContactById(contactId: string) {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', contactId);

  if (error) {
    console.error('Error deleting contact:', error.message);
    throw error;
  }

  return true;
}
