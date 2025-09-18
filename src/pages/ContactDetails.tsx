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
import { ContactHeaderCard } from '@/features/contact/ContactHeaderCard';
import { ContactDetailsCard } from '@/features/contact/ContactDetailsCard';

export default function ContactPage() {
  const navigate = useNavigate();

  const { contact: initialContact, loading: contactLoading, error: contactError } =
    useContactDetail();

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
    <div className="bg-white min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* This is your original layout structure, fully restored. */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ContactHeaderCard
              contact={contact}
              onFavouriteChange={handleFavouriteChange}
            />
          </div>
          <div className="lg:col-span-2">
            <ContactDetailsCard
              contact={contact}
            />
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
