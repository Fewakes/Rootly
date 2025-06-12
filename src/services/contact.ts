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
/**
 * Updates a contact's core profile information, including name, avatar, group, and tag.
 * This function handles file uploads and junction table updates.
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
      .from('avatars') // Make sure you have a 'avatars' bucket in Supabase Storage
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      throw new Error('Failed to upload new avatar.');
    }

    // Get the public URL of the newly uploaded file
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    avatarPublicUrl = urlData.publicUrl;
  }

  // 2. Update the main `contacts` table with name and new avatar URL
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

  // 3. Update the Group relationship in the junction table
  // We'll perform a simple "delete then insert" operation.
  // First, remove any existing group associations for this contact.
  const { error: groupDeleteError } = await supabase
    .from('contact_groups')
    .delete()
    .eq('contact_id', contactId);

  if (groupDeleteError) {
    console.error('Error clearing contact groups:', groupDeleteError);
    // Not throwing here to allow other updates to proceed, but logging the error.
  }

  // If a new groupId is provided, insert the new association.
  if (data.groupId) {
    const { error: groupInsertError } = await supabase
      .from('contact_groups')
      .insert({ contact_id: contactId, group_id: data.groupId });

    if (groupInsertError) {
      console.error('Error setting new contact group:', groupInsertError);
      throw new Error('Failed to associate contact with group.');
    }
  }

  // 4. Update the Tag relationship in the junction table (same logic as groups)
  const { error: tagDeleteError } = await supabase
    .from('contact_tags')
    .delete()
    .eq('contact_id', contactId);

  if (tagDeleteError) {
    console.error('Error clearing contact tags:', tagDeleteError);
  }

  if (data.tagId) {
    const { error: tagInsertError } = await supabase
      .from('contact_tags')
      .insert({ contact_id: contactId, tag_id: data.tagId });

    if (tagInsertError) {
      console.error('Error setting new contact tag:', tagInsertError);
      throw new Error('Failed to associate contact with tag.');
    }
  }

  return { success: true };
}
