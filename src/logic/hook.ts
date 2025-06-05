import { useEffect, useState } from 'react';

type Contact = {
  id: string;
  name: string;
  avatar_url?: string | null;
  group_id?: string | null;
  company_id?: string | null;
};

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your API call
    async function fetchContacts() {
      setLoading(true);
      // MOCK
      const data: Contact[] = [
        {
          id: '1',
          name: 'Alice',
          avatar_url: null,
          group_id: null,
          company_id: null,
        },
        {
          id: '2',
          name: 'Bob',
          avatar_url: null,
          group_id: 'g1',
          company_id: null,
        },
        {
          id: '3',
          name: 'Charlie',
          avatar_url: null,
          group_id: null,
          company_id: 'c1',
        },
        {
          id: '4',
          name: 'Diana',
          avatar_url: null,
          group_id: null,
          company_id: null,
        },
      ];
      setContacts(data);
      setLoading(false);
    }
    fetchContacts();
  }, []);

  return { contacts, isLoading };
}

// Fetch contacts assigned to entity (group/tag/company)
export function useEntityAssignments(
  entityType: 'group' | 'tag' | 'company',
  entityId: string,
) {
  const [assignedContacts, setAssignedContacts] = useState<Contact[]>([]);
  const [isLoading, setLoading] = useState(true);

  const fetchAssigned = async () => {
    setLoading(true);
    // Replace with your API call to fetch contacts assigned to entityId
    // MOCK:
    let data: Contact[] = [];
    if (entityType === 'group' && entityId === 'g1') {
      data = [
        {
          id: '2',
          name: 'Bob',
          avatar_url: null,
          group_id: 'g1',
          company_id: null,
        },
      ];
    } else if (entityType === 'company' && entityId === 'c1') {
      data = [
        {
          id: '3',
          name: 'Charlie',
          avatar_url: null,
          group_id: null,
          company_id: 'c1',
        },
      ];
    }
    setAssignedContacts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAssigned();
  }, [entityType, entityId]);

  return { assignedContacts, isLoading, refresh: fetchAssigned };
}

export function useAssignContactToEntity(entityType: string, entityId: string) {
  // Replace with your API call to assign contact to group/tag/company
  async function assignContact(contactId: string) {
    console.log(`Assign contact ${contactId} to ${entityType} ${entityId}`);
    // Your API logic here
  }
  return { assignContact };
}

export function useRemoveContactFromEntity(
  entityType: string,
  entityId: string,
) {
  // Replace with your API call to remove contact from group/tag/company
  async function removeContact(contactId: string) {
    console.log(`Remove contact ${contactId} from ${entityType} ${entityId}`);
    // Your API logic here
  }
  return { removeContact };
}
