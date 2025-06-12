import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { useLogActivity } from './useLogActivity';
import { getCurrentUserId } from '@/services/users';

export function useDeleteGroup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get userId and initialize the logger
  const [userId, setUserId] = useState<string | null>(null);
  const { logActivity } = useLogActivity(userId);

  // Fetch userId when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      const id = await getCurrentUserId();
      setUserId(id);
    };
    fetchUser();
  }, []);

  const deleteGroup = useCallback(
    async (id: string, details: { groupName: string }): Promise<any | null> => {
      if (!userId) {
        toast.error('User not authenticated. Cannot delete group.');
        return null;
      }
      setIsLoading(true);
      setError(null);

      try {
        // Delete related entries in contact_groups first
        const { error: contactGroupsError } = await supabase
          .from('contact_groups')
          .delete()
          .eq('group_id', id);

        if (contactGroupsError) throw new Error(contactGroupsError.message);

        // Delete the group itself
        const { data, error: groupError } = await supabase
          .from('groups')
          .delete()
          .eq('id', id)
          .select()
          .single();

        if (groupError) throw new Error(groupError.message);

        toast.success('Group deleted successfully');
        // Log the activity on successful deletion
        logActivity('GROUP_REMOVED', 'Group', id, details);

        setIsLoading(false);
        return data;
      } catch (err) {
        const message = (err as Error).message;
        toast.error(`Failed to delete group: ${message}`);
        setError(message);
        setIsLoading(false);
        return null;
      }
    },
    [userId, logActivity],
  );

  return { deleteGroup, isLoading, error };
}
