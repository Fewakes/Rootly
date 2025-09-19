import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getCurrentUserId } from '@/services/users';
import { toast } from 'sonner';

type UseFavoriteCompaniesReturn = {
  userId: string | null;
  favoriteCompanyIds: string[];
  loading: boolean;
  mutating: boolean;
  addFavoriteCompany: (companyId: string) => Promise<void>;
  removeFavoriteCompany: (companyId: string) => Promise<void>;
};

export function useFavoriteCompanies(): UseFavoriteCompaniesReturn {
  const [userId, setUserId] = useState<string | null>(null);
  const [favoriteCompanyIds, setFavoriteCompanyIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mutating, setMutating] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      const id = await getCurrentUserId();
      setUserId(id);
    };

    fetchUser();
  }, []);

  const loadFavorites = useCallback(
    async (currentUserId: string) => {
      setLoading(true);
      const { data, error } = await supabase
        .from('favorite_companies')
        .select('company_id')
        .eq('user_id', currentUserId);

      if (error) {
        console.error('Failed to load favourite companies', error);
        toast.error('Could not load your pinned companies.');
        setFavoriteCompanyIds([]);
      } else {
        setFavoriteCompanyIds((data ?? []).map(row => row.company_id));
      }
      setLoading(false);
    },
    [],
  );

  useEffect(() => {
    if (!userId) {
      setFavoriteCompanyIds([]);
      setLoading(false);
      return;
    }

    loadFavorites(userId);

    const channel = supabase
      .channel(`favorite-companies-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorite_companies',
          filter: `user_id=eq.${userId}`,
        },
        () => loadFavorites(userId),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, loadFavorites]);

  const addFavoriteCompany = useCallback(
    async (companyId: string) => {
      if (!userId) {
        toast.error('Sign in to pin favourite companies.');
        return;
      }
      if (favoriteCompanyIds.includes(companyId)) return;

      setMutating(true);
      const { error } = await supabase.from('favorite_companies').insert({
        user_id: userId,
        company_id: companyId,
      });

      if (error) {
        if (error.code !== '23505') {
          console.error('Failed to pin company', error);
          toast.error('Unable to pin company.');
        }
      } else {
        setFavoriteCompanyIds(prev =>
          prev.includes(companyId) ? prev : [...prev, companyId],
        );
      }
      setMutating(false);
    },
    [userId, favoriteCompanyIds],
  );

  const removeFavoriteCompany = useCallback(
    async (companyId: string) => {
      if (!userId) {
        toast.error('Sign in to manage favourite companies.');
        return;
      }

      setMutating(true);
      const { error } = await supabase
        .from('favorite_companies')
        .delete()
        .eq('user_id', userId)
        .eq('company_id', companyId);

      if (error) {
        console.error('Failed to remove pinned company', error);
        toast.error('Unable to remove company.');
      } else {
        setFavoriteCompanyIds(prev => prev.filter(id => id !== companyId));
      }
      setMutating(false);
    },
    [userId],
  );

  return useMemo(
    () => ({
      userId,
      favoriteCompanyIds,
      loading,
      mutating,
      addFavoriteCompany,
      removeFavoriteCompany,
    }),
    [
      userId,
      favoriteCompanyIds,
      loading,
      mutating,
      addFavoriteCompany,
      removeFavoriteCompany,
    ],
  );
}
