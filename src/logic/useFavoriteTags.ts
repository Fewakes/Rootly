import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getCurrentUserId } from '@/services/users';
import { toast } from 'sonner';

type UseFavoriteTagsReturn = {
  userId: string | null;
  favoriteTagIds: string[];
  loading: boolean;
  mutating: boolean;
  addFavoriteTag: (tagId: string) => Promise<void>;
  removeFavoriteTag: (tagId: string) => Promise<void>;
};

export function useFavoriteTags(): UseFavoriteTagsReturn {
  const [userId, setUserId] = useState<string | null>(null);
  const [favoriteTagIds, setFavoriteTagIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getCurrentUserId();
      setUserId(id);
    };

    fetchUserId();
  }, []);

  const fetchFavourites = useCallback(
    async (currentUserId: string) => {
      setLoading(true);
      const { data, error } = await supabase
        .from('favorite_tags')
        .select('tag_id')
        .eq('user_id', currentUserId);

      if (error) {
        console.error('Failed to fetch favourite tags', error);
        toast.error('Could not load favourite tags.');
        setFavoriteTagIds([]);
      } else {
        setFavoriteTagIds((data ?? []).map(row => row.tag_id));
      }
      setLoading(false);
    },
    [],
  );

  useEffect(() => {
    if (!userId) {
      setFavoriteTagIds([]);
      setLoading(false);
      return;
    }

    fetchFavourites(userId);

    const channel = supabase
      .channel(`favorite-tags-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorite_tags',
          filter: `user_id=eq.${userId}`,
        },
        () => fetchFavourites(userId),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchFavourites]);

  const addFavoriteTag = useCallback(
    async (tagId: string) => {
      if (!userId) {
        toast.error('Sign in to pin favourite tags.');
        return;
      }
      if (favoriteTagIds.includes(tagId)) return;

      setMutating(true);
      const { error } = await supabase.from('favorite_tags').insert({
        user_id: userId,
        tag_id: tagId,
      });

      if (error) {
        if (error.code !== '23505') {
          console.error('Failed to add favourite tag', error);
          toast.error('Unable to pin tag.');
        }
      } else {
        setFavoriteTagIds(prev => (prev.includes(tagId) ? prev : [...prev, tagId]));
      }
      setMutating(false);
    },
    [userId, favoriteTagIds],
  );

  const removeFavoriteTag = useCallback(
    async (tagId: string) => {
      if (!userId) {
        toast.error('Sign in to manage favourite tags.');
        return;
      }

      setMutating(true);
      const { error } = await supabase
        .from('favorite_tags')
        .delete()
        .eq('user_id', userId)
        .eq('tag_id', tagId);

      if (error) {
        console.error('Failed to remove favourite tag', error);
        toast.error('Unable to remove tag.');
      } else {
        setFavoriteTagIds(prev => prev.filter(id => id !== tagId));
      }
      setMutating(false);
    },
    [userId],
  );

  return useMemo(
    () => ({
      userId,
      favoriteTagIds,
      loading,
      mutating,
      addFavoriteTag,
      removeFavoriteTag,
    }),
    [userId, favoriteTagIds, loading, mutating, addFavoriteTag, removeFavoriteTag],
  );
}
