// import { useState, useEffect } from 'react';
// import { toggleContactFavouriteStatus } from '@/services/contactsService';
// import type { Contact } from '@/types/types';

// /**
//  * A custom hook to manage the state and actions for a list of favourite contacts.
//  * @param initialContacts - The initial array of contacts to manage.
//  * @returns An object with state and handlers for the contact list.
//  */
// export const useAssignFavouriteContact = (initialContacts: Contact[]) => {
//   const [contacts, setContacts] = useState<Contact[]>(initialContacts);
//   const [currentPage, setCurrentPage] = useState(1);
//   const CONTACTS_PER_PAGE = 5;

//   // Effect to re-sync the local state if the initial prop changes.
//   // This is useful if the parent component re-fetches the data.
//   useEffect(() => {
//     setContacts(initialContacts);
//   }, [initialContacts]);

//   // --- PAGINATION LOGIC ---
//   const totalPages = Math.ceil(contacts.length / CONTACTS_PER_PAGE);
//   const indexOfLastContact = currentPage * CONTACTS_PER_PAGE;
//   const indexOfFirstContact = indexOfLastContact - CONTACTS_PER_PAGE;
//   const currentContacts = contacts.slice(
//     indexOfFirstContact,
//     indexOfLastContact,
//   );

//   const goToNextPage = () => {
//     setCurrentPage(prev => Math.min(prev + 1, totalPages));
//   };

//   const goToPreviousPage = () => {
//     setCurrentPage(prev => Math.max(prev - 1, 1));
//   };

//   // --- FAVOURITE TOGGLE LOGIC ---
//   const handleToggleFavourite = async (
//     contactId: string,
//     currentStatus: boolean,
//   ) => {
//     // Optimistic UI update for instant feedback
//     setContacts(prev =>
//       prev.map(c =>
//         c.id === contactId ? { ...c, favourite: !currentStatus } : c,
//       ),
//     );

//     // Call the abstracted service function
//     const { error } = await toggleContactFavouriteStatus(
//       contactId,
//       currentStatus,
//     );

//     // If the service function returned an error, revert the optimistic update
//     if (error) {
//       console.error('Failed to sync with the database. Reverting UI change.');
//       setContacts(prev =>
//         prev.map(c =>
//           c.id === contactId ? { ...c, favourite: currentStatus } : c,
//         ),
//       );
//     }
//   };

//   // Return all the state and handlers needed by the component
//   return {
//     contacts,
//     currentContacts,
//     currentPage,
//     totalPages,
//     goToNextPage,
//     goToPreviousPage,
//     handleToggleFavourite,
//   };
// };
