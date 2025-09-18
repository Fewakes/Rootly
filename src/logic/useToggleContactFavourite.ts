import { useState } from 'react';
import { toggleContactFavouriteStatus } from '@/services/contacts';
import { useLogActivity } from './useLogActivity';
import type { ActivityAction } from '@/types/types';

export const useToggleContactFavourite = () => {
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const { logActivity } = useLogActivity();

  const toggleFavourite = async (
    contactId: string,
    currentStatus: boolean,
    contactName: string,
  ) => {
    setTogglingId(contactId);
    const { data, error } = await toggleContactFavouriteStatus(
      contactId,
      currentStatus,
    );
    setTogglingId(null);

    if (error) {
      console.error('Failed to toggle favourite status:', error);
      return { success: false };
    }

    const action: ActivityAction = currentStatus
      ? 'CONTACT_UNFAVORITED'
      : 'CONTACT_FAVORITED';

    logActivity(action, 'Contact', contactId, { name: contactName });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('favourites:updated'));
    }

    return { success: true, contact: data };
  };

  return { isToggling: (id: string) => togglingId === id, toggleFavourite };
};
