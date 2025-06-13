// import { addContactToEntity } from '@/services/assignContactService';
// import { useState, useCallback } from 'react';
// import { toast } from 'sonner';

// type EntityType = 'group' | 'tag' | 'company';

// export function useAddContactToEntity() {
//   const [isLoading, setIsLoading] = useState(false);

//   const addContact = useCallback(
//     async (contactId: string, entityId: string, entityType: EntityType) => {
//       setIsLoading(true);

//       const success = await addContactToEntity(entityId, contactId,);

//       if (success) {
//         toast.success(`Contact added to ${entityType} successfully!`);
//       } else {
//         toast.error(`Failed to add contact to ${entityType}.`);
//       }

//       setIsLoading(false);
//       return success;
//     },
//     [],
//   );

//   return { addContact, isLoading };
// }
