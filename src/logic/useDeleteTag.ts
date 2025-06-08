// hooks/useDeleteTag.ts
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { deleteTag } from '@/services/tags';

export function useDeleteTag() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeTag = useCallback(async (tagId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await deleteTag(tagId);
      if (success) {
        toast.success('Tag deleted successfully');
        return true;
      } else {
        throw new Error('Unknown error');
      }
    } catch (err) {
      const message = (err as Error).message;
      toast.error(`Failed to delete tag: ${message}`);
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { removeTag, isLoading, error };
}
