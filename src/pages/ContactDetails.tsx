// src/pages/ContactPage.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// --- Logic & Data Hooks ---
import { useContactDetail } from '@/logic/useContactDetails';
import { useContactNotes } from '@/logic/useContactNotes';
import { useContactTasks } from '@/logic/useContactTasks';
import {
  useRecentActivity,
  type ActivityItem,
} from '@/logic/useRecentActivity';

// --- UI Components ---
// We now import the Contact type from the card where it's defined
import {
  ContactHeaderCard,
  type Contact,
} from '@/features/contact/ContactHeaderCard';
import { ContactDetailsCard } from '@/features/contact/ContactDetailsCard';
import { QuickActionsCard } from '@/features/contact/QuickActionsCard';
import { RecentActivityCard } from '@/features/contact/RecentActivityCard';

// =================================================================
// MAIN PAGE COMPONENT
// =================================================================
export default function ContactPage() {
  const navigate = useNavigate();

  // --- State Management ---
  // 1. Fetch the initial data from your primary hook.
  const {
    contact: initialContact,
    loading: contactLoading,
    error: contactError,
  } = useContactDetail();

  // 2. Create a local state for the contact. This allows us to update it (e.g., when toggling favourite).
  const [contact, setContact] = useState<Contact | null>(null);

  // 3. This effect keeps our local state in sync with the data fetched from the hook.
  useEffect(() => {
    setContact(initialContact);
  }, [initialContact]);

  // 4. Fetch related data based on the contact's ID. These hooks are designed to handle a `null` ID gracefully.
  const { notes, addNote, updateNote, deleteNote } = useContactNotes(
    contact?.id,
  );
  const { tasks, addTask, updateTask, deleteTask, updateTaskStatus } =
    useContactTasks(contact?.id);

  // 5. This pure hook transforms notes and tasks into a single activity list.
  const activity = useRecentActivity(notes, tasks);

  // This handler allows child components (like ContactHeaderCard) to update the contact object on this page.
  const handleContactUpdate = (updatedContact: Contact) => {
    setContact(updatedContact);
  };

  // --- Loading and Error Guards ---
  // This is the crucial, robust loading logic.
  if (contactLoading) {
    return (
      <div className="w-full h-screen bg-white flex items-center justify-center">
        <p className="text-lg text-gray-500">Loading Contact...</p>
      </div>
    );
  }
  if (contactError) {
    toast.error(contactError.message || 'Failed to load contact.');
    navigate('/contacts');
    return null;
  }
  // This final check ensures we don't render anything until both the fetch is complete AND our local state is synced.
  if (!contact) {
    // This can briefly appear between the fetch completing and the useEffect syncing state.
    // Or it means the contact was not found.
    return (
      <div className="w-full h-screen bg-white flex items-center justify-center">
        <p className="text-lg text-gray-500">Synchronizing...</p>
      </div>
    );
  }

  // --- Main Render ---
  // We can now safely render the page, knowing the 'contact' object is valid.
  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ContactHeaderCard
              contact={contact}
              onFavouriteChange={handleContactUpdate}
            />
          </div>
          <div className="lg:col-span-2">
            <ContactDetailsCard contact={contact} />
          </div>
          <div className="lg:col-span-1">
            <QuickActionsCard
              contactName={contact.name}
              addNote={addNote}
              addTask={addTask}
            />
          </div>
          <div className="lg:col-span-2">
            <RecentActivityCard
              activity={activity}
              contactName={contact.name}
              updateNote={updateNote}
              deleteNote={deleteNote}
              updateTask={updateTask}
              deleteTask={deleteTask}
              updateTaskStatus={updateTaskStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
