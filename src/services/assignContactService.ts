import { supabase } from '@/lib/supabaseClient';
import type { AssignEntity } from '@/types/types';

// Helper to resolve the correct join table
function getJoinTable(type: AssignEntity['type']) {
  if (type === 'group') return 'contact_groups';
  if (type === 'company') return 'contact_companies';
  if (type === 'tag') return 'contact_tags';
  throw new Error(`Invalid entity type: ${type}`);
}

// Get contacts already assigned to the entity
export async function getAssignedContacts(entity: AssignEntity) {
  const joinTable = getJoinTable(entity.type);

  const { data, error } = await supabase
    .from(joinTable)
    .select('contact_id, contacts (id, name, avatar_url)')
    .eq(`${entity.type}_id`, entity.id);

  if (error) throw error;

  return data.map((entry: any) => entry.contacts); // Supabase typing workaround
}

// Get contacts that are eligible to be assigned
export async function getEligibleContacts(entity: AssignEntity) {
  const { type } = entity;

  if (type === 'tag') {
    // Get all contact-tag assignments
    const { data: tagAssignments, error: tagError } = await supabase
      .from('contact_tags')
      .select('contact_id, tag_id');

    if (tagError) throw tagError;

    // Build tag count and detect already assigned
    const tagCounts: Record<string, number> = {};
    const alreadyTagged = new Set<string>();

    for (const { contact_id, tag_id } of tagAssignments) {
      tagCounts[contact_id] = (tagCounts[contact_id] || 0) + 1;
      if (tag_id === entity.id) {
        alreadyTagged.add(contact_id);
      }
    }

    // Get all contacts
    const { data: allContacts, error: contactError } = await supabase
      .from('contacts')
      .select('id, name, avatar_url');

    if (contactError) throw contactError;

    // Filter eligible: <5 tags and not already in this tag
    const eligibleContacts = allContacts.filter(
      contact =>
        (tagCounts[contact.id] ?? 0) < 5 && !alreadyTagged.has(contact.id),
    );

    return eligibleContacts;
  }

  // Groups and companies: allow only one assignment per contact
  const joinTable = getJoinTable(type);

  const { data: assigned, error: assignedError } = await supabase
    .from(joinTable)
    .select('contact_id');

  if (assignedError) throw assignedError;

  const assignedIds = assigned.map(entry => entry.contact_id);

  let query = supabase.from('contacts').select('id, name, avatar_url');

  if (assignedIds.length > 0) {
    query = query.not('id', 'in', `(${assignedIds.join(',')})`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Assign a contact to an entity (tag/group/company)
export async function addContactToEntity(
  entity: AssignEntity,
  contactId: string,
) {
  const joinTable = getJoinTable(entity.type);
  const insertData = {
    contact_id: contactId,
    [`${entity.type}_id`]: entity.id,
  };
  const { error } = await supabase.from(joinTable).insert(insertData);
  if (error) throw error;
}

// Remove a contact from an entity (tag/group/company)
export async function removeContactFromEntity(
  entity: AssignEntity,
  contactId: string,
) {
  const joinTable = getJoinTable(entity.type);
  const { error } = await supabase
    .from(joinTable)
    .delete()
    .eq('contact_id', contactId)
    .eq(`${entity.type}_id`, entity.id);
  if (error) throw error;
}
