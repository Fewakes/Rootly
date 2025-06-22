import { toggleContactFavouriteStatus } from '@/services/contacts';
import { useState } from 'react';

export const useToggleContactFavourite = () => {
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const toggleFavourite = async (contactId: string, currentStatus: boolean) => {
    setTogglingId(contactId);
    const { error } = await toggleContactFavouriteStatus(
      contactId,
      currentStatus,
    );
    setTogglingId(null);

    if (error) {
      console.error('Failed to toggle favourite status:', error);
      return { success: false };
    }

    return { success: true };
  };

  return { isToggling: (id: string) => togglingId === id, toggleFavourite };
};
