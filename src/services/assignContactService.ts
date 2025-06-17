import { supabase } from '@/lib/supabaseClient';
import type { AssignEntity, ContactWithAvatar } from '@/types/types';

export type ContactWithDetails = ContactWithAvatar & {
  email: string | null;
  company: { id: string; name: string } | null;
  group: { id: string; name: string } | null; // ✨ Changed from `groups` array to single object
  tags: { id: string; name: string; color: string | null }[];
};

function getJoinTable(type: AssignEntity['type']) {
  if (type === 'group') return 'contact_groups';
  if (type === 'company') return 'contact_companies';
  if (type === 'tag') return 'contact_tags';
  throw new Error(`Invalid entity type: ${type}`);
}

const CONTACT_DETAILS_QUERY = `
  id,
  name,
  email,
  avatar_url,
  contact_companies ( companies ( id, name, company_logo) ),
  contact_groups ( groups ( id, name ) ),
  contact_tags ( tags ( id, name, color ) )
`;

function reshapeContactData(supabaseContact: any): ContactWithDetails {
  return {
    ...supabaseContact,
    company: supabaseContact.contact_companies[0]?.companies || null,
    // Since a contact can only be in one group, we take the first element.
    group: supabaseContact.contact_groups[0]?.groups || null,
    // Tags can be multiple, so we keep this as an array.
    tags: supabaseContact.contact_tags.map((t: any) => t.tags),
  };
}

/**
 * Get contacts already assigned to a specific entity, now with their full details.
 */
export async function getAssignedContacts(
  entity: AssignEntity,
): Promise<ContactWithDetails[]> {
  const joinTable = getJoinTable(entity.type);

  const { data, error } = await supabase
    .from(joinTable)
    .select(`contacts (${CONTACT_DETAILS_QUERY})`)
    .eq(`${entity.type}_id`, entity.id);

  if (error) throw error;

  const detailedContacts = data
    .map((entry: any) =>
      entry.contacts ? reshapeContactData(entry.contacts) : null,
    )
    .filter(Boolean) as ContactWithDetails[];

  return detailedContacts;
}

/**
 * Get contacts that are eligible to be assigned to the entity, now with their full details.
 */
export async function getEligibleContacts(
  entity: AssignEntity,
): Promise<ContactWithDetails[]> {
  const { type, id: entityId } = entity;

  const { data: assignedData, error: assignedError } = await supabase
    .from(getJoinTable(type))
    .select('contact_id')
    .eq(`${type}_id`, entityId);

  if (assignedError) throw assignedError;
  const assignedContactIds = new Set(assignedData.map(a => a.contact_id));

  const { data: allContacts, error: allContactsError } = await supabase
    .from('contacts')
    .select(CONTACT_DETAILS_QUERY);

  if (allContactsError) throw allContactsError;

  const allDetailedContacts = allContacts.map(reshapeContactData);

  const eligibleContacts = allDetailedContacts.filter(contact => {
    if (assignedContactIds.has(contact.id)) {
      return false;
    }
    if (type === 'tag') {
      return contact.tags.length < 3;
    }
    if (type === 'group') {
      // A contact is eligible if they don't have a group yet.
      return !contact.group;
    }
    if (type === 'company') {
      return !contact.company;
    }
    return true;
  });

  return eligibleContacts;
}

/**
 * Assign a contact to an entity (tag/group/company).
 */
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

/**
 * Remove a contact from an entity (tag/group/company).
 */
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
