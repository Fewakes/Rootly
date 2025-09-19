import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getCurrentUserId } from '@/services/users';
import { toast } from 'sonner';

type UseFavoriteGroupsReturn = {
  userId: string | null;
  favoriteGroupIds: string[];
  loading: boolean;
  mutating: boolean;
  addFavoriteGroup: (groupId: string) => Promise<void>;
  removeFavoriteGroup: (groupId: string) => Promise<void>;
};

export function useFavoriteGroups(): UseFavoriteGroupsReturn {
  const [userId, setUserId] = useState<string | null>(null);
  const [favoriteGroupIds, setFavoriteGroupIds] = useState<string[]>([]);
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
        .from('favorite_groups')
        .select('group_id')
        .eq('user_id', currentUserId);

      if (error) {
        console.error('Failed to load favourite groups', error);
        toast.error('Could not load your pinned groups.');
        setFavoriteGroupIds([]);
      } else {
        setFavoriteGroupIds((data ?? []).map(row => row.group_id));
      }
      setLoading(false);
    },
    [],
  );

  useEffect(() => {
    if (!userId) {
      setFavoriteGroupIds([]);
      setLoading(false);
      return;
    }

    loadFavorites(userId);

    const channel = supabase
      .channel(`favorite-groups-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorite_groups',
          filter: `user_id=eq.${userId}`,
        },
        () => loadFavorites(userId),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, loadFavorites]);

  const addFavoriteGroup = useCallback(
    async (groupId: string) => {
      if (!userId) {
        toast.error('Sign in to pin favourite groups.');
        return;
      }
      if (favoriteGroupIds.includes(groupId)) return;

      setMutating(true);
      const { error } = await supabase.from('favorite_groups').insert({
        user_id: userId,
        group_id: groupId,
      });

      if (error) {
        if (error.code !== '23505') {
          console.error('Failed to pin group', error);
          toast.error('Unable to pin group.');
        }
      } else {
        setFavoriteGroupIds(prev => (prev.includes(groupId) ? prev : [...prev, groupId]));
      }
      setMutating(false);
    },
    [userId, favoriteGroupIds],
  );

  const removeFavoriteGroup = useCallback(
    async (groupId: string) => {
      if (!userId) {
        toast.error('Sign in to manage favourite groups.');
        return;
      }

      setMutating(true);
      const { error } = await supabase
        .from('favorite_groups')
        .delete()
        .eq('user_id', userId)
        .eq('group_id', groupId);

      if (error) {
        console.error('Failed to remove pinned group', error);
        toast.error('Unable to remove group.');
      } else {
        setFavoriteGroupIds(prev => prev.filter(id => id !== groupId));
      }
      setMutating(false);
    },
    [userId],
  );

  return useMemo(
    () => ({
      userId,
      favoriteGroupIds,
      loading,
      mutating,
      addFavoriteGroup,
      removeFavoriteGroup,
    }),
    [userId, favoriteGroupIds, loading, mutating, addFavoriteGroup, removeFavoriteGroup],
  );
}
