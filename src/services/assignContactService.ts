import { supabase } from '@/lib/supabaseClient';

export async function getAssignedContacts(entity) {
  const joinTable = getJoinTable(entity.type);
  const { data, error } = await supabase
    .from(joinTable)
    .select('contact_id, contacts (id, name, avatar_url)')
    .eq(`${entity.type}_id`, entity.id);

  if (error) throw error;
  return data.map(entry => entry.contacts);
}

export async function getEligibleContacts(entity) {
  if (entity.type !== 'group') {
    throw new Error('This function only supports group entities');
  }

  // Step 1: Get all contact IDs assigned to ANY group
  const { data: assignedGroups, error: assignedError } = await supabase
    .from('contact_groups')
    .select('contact_id');

  if (assignedError) throw assignedError;

  const assignedIds = assignedGroups.map(entry => entry.contact_id);

  // Step 2: Fetch contacts NOT in any group
  let query = supabase.from('contacts').select('id, name, avatar_url');

  if (assignedIds.length > 0) {
    query = query.not('id', 'in', `(${assignedIds.join(',')})`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function addContactToEntity(entity, contactId) {
  const joinTable = getJoinTable(entity.type);
  const insertData = {
    contact_id: contactId,
    [`${entity.type}_id`]: entity.id,
  };
  const { error } = await supabase.from(joinTable).insert(insertData);
  if (error) throw error;
}

export async function removeContactFromEntity(entity, contactId) {
  const joinTable = getJoinTable(entity.type);
  const { error } = await supabase
    .from(joinTable)
    .delete()
    .eq('contact_id', contactId)
    .eq(`${entity.type}_id`, entity.id);
  if (error) throw error;
}

function getJoinTable(type) {
  if (type === 'group') return 'contact_groups';
  if (type === 'company') return 'contact_companies';
  if (type === 'tag') return 'contact_tags';
  throw new Error('Invalid entity type');
}
