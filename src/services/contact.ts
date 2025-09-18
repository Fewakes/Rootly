import { supabase } from '@/lib/supabaseClient';
import type { Contact } from '@/types/types';

export type UpdateContactInfoPayload = {
  email?: string;
  contactNumber?: string;
  location?: string;
  country?: string;
  birthday?: string;
  linkName?: string;
  socialLink?: string;
  companyId?: string;
};

export async function updateContactInfo(
  contactId: string,
  data: UpdateContactInfoPayload,
) {
  if (!contactId) {
    throw new Error('Contact ID is required to update.');
  }

  const contactDataToUpdate = {
    email: data.email,
    contact_number: data.contactNumber,
    town: data.location,
    country: data.country,
    birthday: data.birthday,
    link_name: data.linkName,
    link_url: data.socialLink,
  };

  const { error: contactUpdateError } = await supabase
    .from('contacts')
    .update(contactDataToUpdate)
    .eq('id', contactId);

  if (contactUpdateError) {
    console.error('Error updating contact info:', contactUpdateError);
    throw new Error(contactUpdateError.message);
  }

  const { error: deleteError } = await supabase
    .from('contact_companies')
    .delete()
    .eq('contact_id', contactId);

  if (deleteError) {
    console.error('Error clearing contact companies:', deleteError);
    throw new Error('Could not update company association.');
  }

  if (data.companyId) {
    const { error: insertError } = await supabase
      .from('contact_companies')
      .insert({ contact_id: contactId, company_id: data.companyId });

    if (insertError) {
      console.error('Error setting new contact company:', insertError);
      throw new Error('Could not associate contact with new company.');
    }
  }

  return { success: true };
}

export async function getAllCompanies() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User must be logged in to fetch companies.');
  }
  const { data, error } = await supabase
    .from('companies')
    .select('id, name, company_logo')
    .eq('user_id', user.id);
  if (error) {
    console.error('Error fetching companies:', error);
    throw new Error(error.message);
  }
  return data || [];
}

type UpdateContactProfilePayload = {
  firstName: string;
  surname?: string;
  groupId?: string;
  tagIds?: string[];
  avatarUrl?: string | File;
  companyId?: string;
};

export async function updateContactProfile(
  contactId: string,
  data: UpdateContactProfilePayload,
) {
  if (!contactId) {
    throw new Error('Contact ID is required to update.');
  }

  let avatarPublicUrl =
    typeof data.avatarUrl === 'string' ? data.avatarUrl : undefined;

  if (data.avatarUrl instanceof File) {
    const file = data.avatarUrl;
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${contactId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      throw new Error('Failed to upload new avatar.');
    }

    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    avatarPublicUrl = urlData.publicUrl;
  }

  const fullName = `${data.firstName} ${data.surname ?? ''}`.trim();
  const { error: contactUpdateError } = await supabase
    .from('contacts')
    .update({
      name: fullName,
      avatar_url: avatarPublicUrl,
    })
    .eq('id', contactId);

  if (contactUpdateError) {
    console.error('Error updating contact name/avatar:', contactUpdateError);
    throw new Error(contactUpdateError.message);
  }

  const { error: groupDeleteError } = await supabase
    .from('contact_groups')
    .delete()
    .eq('contact_id', contactId);

  if (groupDeleteError) {
    console.error('Error clearing contact groups:', groupDeleteError);
  }

  if (data.groupId) {
    const { error: groupInsertError } = await supabase
      .from('contact_groups')
      .insert({ contact_id: contactId, group_id: data.groupId });

    if (groupInsertError) {
      console.error('Error setting new contact group:', groupInsertError);
    }
  }

  const newTagIds = data.tagIds || [];
  const { data: existingLinks, error: fetchError } = await supabase
    .from('contact_tags')
    .select('tag_id')
    .eq('contact_id', contactId);

  if (fetchError) throw fetchError;
  const existingTagIds = existingLinks.map(link => link.tag_id);
  const tagsToAdd = newTagIds.filter(id => !existingTagIds.includes(id));
  const tagsToRemove = existingTagIds.filter(id => !newTagIds.includes(id));

  if (tagsToRemove.length > 0) {
    const { error } = await supabase
      .from('contact_tags')
      .delete()
      .eq('contact_id', contactId)
      .in('tag_id', tagsToRemove);
    if (error) throw new Error('Failed to update tag associations.');
  }
  if (tagsToAdd.length > 0) {
    const insertData = tagsToAdd.map(tagId => ({
      contact_id: contactId,
      tag_id: tagId,
    }));
    const { error } = await supabase.from('contact_tags').insert(insertData);
    if (error) throw new Error('Failed to update tag associations.');
  }

  const { error: deleteCompanyError } = await supabase
    .from('contact_companies')
    .delete()
    .eq('contact_id', contactId);

  if (deleteCompanyError) {
    console.error('Error clearing contact companies:', deleteCompanyError);
    throw new Error('Could not update company association.');
  }

  if (data.companyId) {
    const { error: insertCompanyError } = await supabase
      .from('contact_companies')
      .insert({ contact_id: contactId, company_id: data.companyId });

    if (insertCompanyError) {
      console.error('Error setting new contact company:', insertCompanyError);
      throw new Error('Could not associate contact with new company.');
    }
  }

  return { success: true };
}

export const updateContactDetails = async (
  contactId: string,
  updates: Partial<Contact>,
) => {
  if (!contactId) {
    throw new Error('A Contact ID is required to perform an update.');
  }
  const { data, error } = await supabase
    .from('contacts')
    .update(updates)
    .eq('id', contactId)
    .select()
    .single();

  if (error) {
    console.error('Supabase update error:', error);
    throw new Error(error.message);
  }
  return data;
};
