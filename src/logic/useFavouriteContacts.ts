import { useState, useEffect, useCallback } from 'react';
import { getFavouriteContacts } from '@/services/contacts';
import { supabase } from '@/lib/supabaseClient';
import type { ContactWithDetails } from '@/services/assignContactService';
import { toast } from 'sonner';
import { sortContacts } from './useAllContacts';

export function useFavouriteContacts() {
  const [contacts, setContacts] = useState<ContactWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavourites = useCallback(async () => {
    try {
      const favs = await getFavouriteContacts();

      setContacts(sortContacts(favs || []));
    } catch (error) {
      console.error('Failed to fetch favourite contacts:', error);
      toast.error('Could not load favourites.');
    } finally {
      if (loading) {
        setLoading(false);
      }
    }
  }, [loading]);

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
        payload => {
          console.log(
            'Favourites hook received a realtime event! Refetching...',
            payload,
          );

          fetchFavourites();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchFavourites]);

  return { contacts, loading };
}
