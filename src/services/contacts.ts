import { supabase } from '@/lib/supabaseClient';
import type { Contact, NewContact } from '@/types/types';

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
      contact_groups(groups(id, name)),
      contact_tags(tags(id, name, color)),
      contact_companies(companies(id, name, company_logo))
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
    contact_groups: c.contact_groups?.map((g: any) => g.groups) ?? [],
    contact_tags: c.contact_tags?.map((t: any) => t.tags) ?? [],
    contact_companies: c.contact_companies?.map((c: any) => c.companies) ?? [],
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
        contact_groups(groups(id, name)),
        contact_tags(tags(id, name, color)),
        contact_companies(companies(id, name, company_logo))
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
      contact_groups: data.contact_groups?.map((g: any) => g.groups) ?? [],
      contact_tags: data.contact_tags?.map((t: any) => t.tags) ?? [],
      contact_companies:
        data.contact_companies?.map((c: any) => c.companies) ?? [],
    };
  } catch (err) {
    console.error('Unexpected error fetching contact:', (err as Error).message);
    return null;
  }
};

const linkContactToItems = async (
  contactId: string,
  itemIds: string[],
  // 👇 Added 'contact_companies' to the type
  joinTableName: 'contact_tags' | 'contact_groups' | 'contact_companies',
  // 👇 Added 'company_id' to the type
  linkingColumnName: 'tag_id' | 'group_id' | 'company_id',
) => {
  if (!itemIds || itemIds.length === 0) {
    return;
  }

  const links = itemIds.map(itemId => ({
    contact_id: contactId,
    [linkingColumnName]: itemId,
  }));

  const { error } = await supabase.from(joinTableName).insert(links);

  if (error) {
    console.error(`Error linking items in ${joinTableName}:`, error.message);
    throw error;
  }
};

export const insertContact = async (
  contact: NewContact,
  tagIds: string[] = [],
  groupIds: string[] = [],
  companyIds: string[] = [],
): Promise<Contact> => {
  const { data: contactData, error: contactError } = await supabase
    .from('contacts')
    .insert(contact)
    .select()
    .single();

  if (contactError || !contactData) {
    console.error('Error inserting contact:', contactError?.message);
    throw contactError || new Error('Failed to insert contact.');
  }

  const contactId = contactData.id;

  try {
    await Promise.all([
      linkContactToItems(contactId, tagIds, 'contact_tags', 'tag_id'),
      linkContactToItems(contactId, groupIds, 'contact_groups', 'group_id'),

      linkContactToItems(
        contactId,
        companyIds,
        'contact_companies',
        'company_id',
      ),
    ]);
  } catch (error) {
    console.error(
      `Failed to link associations for contact ${contactId}. The contact was created, but its links are incomplete.`,
      error,
    );
    throw error;
  }

  return contactData;
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

type EntityType = 'group' | 'tag' | 'company';

export async function getAssignableContactsForEntity(
  entityId: string,
  entityType: EntityType,
) {
  try {
    let assignedIds: string[] = [];

    if (entityType === 'group') {
      const { data, error } = await supabase
        .from('contact_groups')
        .select('contact_id');

      if (error) throw error;
      assignedIds = data.map(entry => entry.contact_id);
    }

    if (entityType === 'company') {
      const { data, error } = await supabase
        .from('contact_companies')
        .select('contact_id');

      if (error) throw error;
      assignedIds = data.map(entry => entry.contact_id);
    }

    if (entityType === 'tag') {
      const { data, error } = await supabase
        .from('contact_tags')
        .select('contact_id')
        .eq('tag_id', entityId); // Only exclude contacts that already have THIS tag

      if (error) throw error;
      assignedIds = data.map(entry => entry.contact_id);
    }

    // Now fetch all contacts not in assignedIds
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('*')
      .not('id', 'in', `(${assignedIds.join(',') || 'NULL'})`);

    if (contactsError) throw contactsError;

    return contacts;
  } catch (e) {
    console.error('Error fetching assignable contacts:', e);
    return [];
  }
}
