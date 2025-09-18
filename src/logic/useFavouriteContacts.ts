import { useState, useEffect, useCallback } from 'react';
import { getFavouriteContacts } from '@/services/contacts';
import { supabase } from '@/lib/supabaseClient';
import type { ContactWithDetails } from '@/types/types';
import { toast } from 'sonner';
import { sortContacts } from './useAllContacts';

interface UseFavouriteContactsReturn {
  contacts: ContactWithDetails[];
  loading: boolean;
}

export function useFavouriteContacts(): UseFavouriteContactsReturn {
  const [contacts, setContacts] = useState<ContactWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavourites = useCallback(async () => {
    setLoading(true);
    try {
      const favs = await getFavouriteContacts();

      setContacts(sortContacts<ContactWithDetails>(favs || []));
    } catch (error) {
      console.error('Failed to fetch favourite contacts:', error);
      toast.error('Could not load favourites.');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchFavourites();

    const channel = supabase
      .channel('realtime-favourites-contacts-subscription')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contacts',
        },
        () => {
          fetchFavourites();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchFavourites]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => fetchFavourites();
    window.addEventListener('favourites:updated', handler);
    return () => window.removeEventListener('favourites:updated', handler);
  }, [fetchFavourites]);

  return { contacts, loading };
}
