import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

export function useDeleteGroup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteGroup = useCallback(async (id: string) => {
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
      setIsLoading(false);
      return data;
    } catch (err) {
      const message = (err as Error).message;
      toast.error(`Failed to delete group: ${message}`);
      setError(message);
      setIsLoading(false);
      return null;
    }
  }, []);

  return { deleteGroup, isLoading, error };
}
