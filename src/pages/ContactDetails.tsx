// src/pages/ContactPage.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// --- Logic & Data Hooks ---
import { useContactDetail } from '@/logic/useContactDetails';
import { useContactNotes } from '@/logic/useContactNotes';
import { useContactTasks } from '@/logic/useContactTasks';
import { useRecentActivity } from '@/logic/useRecentActivity';

// --- UI Components ---
import type { ContactWithDetails } from '@/types/types';
import { QuickActionsCard } from '@/features/contact/QuickActionsCard';
import { RecentActivityCard } from '@/features/contact/RecentActivityCard';
import { ContactProfileCard } from '@/features/contact/ContactProfileCard';

export default function ContactPage() {
  const navigate = useNavigate();

  const {
    contact: initialContact,
    loading: contactLoading,
    error: contactError,
    refetch: refetchContact,
  } = useContactDetail();

  const [contact, setContact] = useState<ContactWithDetails | null>(null);

  useEffect(() => {
    setContact(initialContact);
  }, [initialContact]);

  const { notes, addNote, updateNote, deleteNote } = useContactNotes(
    contact?.id,
  );
  const { tasks, addTask, updateTask, deleteTask, updateTaskStatus } =
    useContactTasks(contact?.id);
  const activity = useRecentActivity(notes, tasks);

  const handleFavouriteChange = (updatedContact: ContactWithDetails) => {
    setContact(updatedContact);
    // Also refetch to ensure any lists that sort by favourite are updated.
  };

  // --- Loading and Error Guards ---
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
  if (!contact) {
    return (
      <div className="w-full h-screen bg-white flex items-center justify-center">
        <p className="text-lg text-gray-500">Synchronizing...</p>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
        <ContactProfileCard
          contact={contact}
          onFavouriteChange={handleFavouriteChange}
          onActionSuccess={refetchContact}
        />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="space-y-6 xl:col-span-8">
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
          <div className="space-y-6 xl:col-span-4">
            <QuickActionsCard
              contactName={contact.name}
              addNote={addNote}
              addTask={addTask}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
