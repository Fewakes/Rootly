// Define a type for the data used in the update function

import { supabase } from '@/lib/supabaseClient';

export type UpdateContactInfoPayload = {
  email?: string;
  contactNumber?: string;
  location?: string;
  country?: string; // Added country
  birthday?: string;
  linkName?: string;
  socialLink?: string;
  companyId?: string;
};

// --- CORRECTED UPDATE FUNCTION ---
export async function updateContactInfo(
  contactId: string,
  data: UpdateContactInfoPayload,
) {
  if (!contactId) {
    throw new Error('Contact ID is required to update.');
  }

  // 1. Update the fields on the main `contacts` table
  const contactDataToUpdate = {
    email: data.email,
    contact_number: data.contactNumber,
    town: data.location,
    country: data.country, // Added country
    birthday: data.birthday,
    link_name: data.linkName,
    link_url: data.socialLink,
    // NOTE: company_id is removed from here as it's managed by the junction table
  };

  const { error: contactUpdateError } = await supabase
    .from('contacts')
    .update(contactDataToUpdate)
    .eq('id', contactId);

  if (contactUpdateError) {
    console.error('Error updating contact info:', contactUpdateError);
    throw new Error(contactUpdateError.message);
  }

  // 2. Update the company relationship in the `contact_companies` junction table
  // First, delete all existing company associations for this contact
  const { error: deleteError } = await supabase
    .from('contact_companies')
    .delete()
    .eq('contact_id', contactId);

  if (deleteError) {
    console.error('Error clearing contact companies:', deleteError);
    throw new Error('Could not update company association.');
  }

  // If a new companyId was provided, insert the new association
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

// ... (getAllCompanies function remains the same) ...

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
import { SupabaseClient } from '@supabase/supabase-js';

// Define the expected shape of the data from the form
// Note that `tagId` is now `tagIds` and is an array of strings.
type UpdateContactProfilePayload = {
  firstName: string;
  surname: string;
  groupId?: string;
  tagIds?: string[];
  avatarUrl?: string | File;
};

// Assume 'supabase' is an initialized SupabaseClient passed into this file
// For example: import { supabase } from '@/lib/supabaseClient';

/**
 * Updates a contact's core profile information, including name, avatar, group, and tags.
 * This function handles file uploads and performs efficient updates on junction tables.
 * @param {string} contactId - The ID of the contact to update.
 * @param {UpdateContactProfilePayload} data - The new profile data from the form.
 */
export async function updateContactProfile(
  contactId: string,
  data: UpdateContactProfilePayload,
) {
  if (!contactId) {
    throw new Error('Contact ID is required to update.');
  }

  let avatarPublicUrl =
    typeof data.avatarUrl === 'string' ? data.avatarUrl : undefined;

  // 1. Handle Avatar Upload if a new file is provided
  if (data.avatarUrl instanceof File) {
    const file = data.avatarUrl;
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${contactId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars') // Ensure this bucket exists and has the correct policies
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

  // 2. Update the main `contacts` table
  const fullName = `${data.firstName} ${data.surname}`.trim();
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

  // 3. Update the Group relationship (simple delete then insert is acceptable for a single relationship)
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
      throw new Error('Failed to associate contact with group.');
    }
  }

  // 4. ✨ FIX: Efficiently update the Tag relationships
  const newTagIds = data.tagIds || [];

  // Fetch the contact's current tag associations
  const { data: existingLinks, error: fetchError } = await supabase
    .from('contact_tags')
    .select('tag_id')
    .eq('contact_id', contactId);

  if (fetchError) {
    console.error('Error fetching existing contact tags:', fetchError);
    throw fetchError;
  }

  const existingTagIds = existingLinks.map(link => link.tag_id);

  // Calculate which tags to add and which to remove
  const tagsToAdd = newTagIds.filter(id => !existingTagIds.includes(id));
  const tagsToRemove = existingTagIds.filter(id => !newTagIds.includes(id));

  // Perform delete operation for tags that were unselected
  if (tagsToRemove.length > 0) {
    const { error: deleteError } = await supabase
      .from('contact_tags')
      .delete()
      .eq('contact_id', contactId)
      .in('tag_id', tagsToRemove);

    if (deleteError) {
      console.error('Error removing old tags:', deleteError);
      throw new Error('Failed to update tag associations.');
    }
  }

  // Perform insert operation for newly selected tags
  if (tagsToAdd.length > 0) {
    const insertData = tagsToAdd.map(tagId => ({
      contact_id: contactId,
      tag_id: tagId,
    }));
    const { error: insertError } = await supabase
      .from('contact_tags')
      .insert(insertData);

    if (insertError) {
      console.error('Error adding new tags:', insertError);
      throw new Error('Failed to update tag associations.');
    }
  }

  return { success: true };
}
