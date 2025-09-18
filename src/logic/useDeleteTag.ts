import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { deleteTag } from '@/services/tags';
import { useLogActivity } from './useLogActivity';

export function useDeleteTag() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get userId and initialize the logger
  const { logActivity, userId } = useLogActivity();

  const removeTag = useCallback(
    async (tagId: string, details: { tagName: string }): Promise<boolean> => {
      if (!userId) {
        toast.error('User not authenticated. Cannot delete tag.');
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const success = await deleteTag(tagId);
        if (success) {
          toast.success('Tag deleted successfully');
          // Log the activity on successful deletion
          logActivity('TAG_REMOVED', 'Tag', tagId, details);
          return true;
        } else {
          // This case might not be reached if deleteTag throws on failure
          throw new Error('Deletion failed for an unknown reason.');
        }
      } catch (err) {
        const message = (err as Error).message;
        toast.error(`Failed to delete tag: ${message}`);
        setError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [userId, logActivity], // Add dependencies
  );

  return { removeTag, isLoading, error };
}
