import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { deleteCompany as deleteCompanyService } from '@/services/companies';
import { useLogActivity } from './useLogActivity';
import { getCurrentUserId } from '@/services/users';

export function useDeleteCompany() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const { logActivity } = useLogActivity(userId);

  useEffect(() => {
    const fetchUser = async () => {
      const id = await getCurrentUserId();
      setUserId(id);
    };
    fetchUser();
  }, []);

  const deleteCompany = useCallback(
    async (
      companyId: string,
      details: { companyName: string },
    ): Promise<boolean> => {
      if (!userId) {
        toast.error('User not authenticated. Cannot delete company.');
        return false;
      }
      setIsLoading(true);
      setError(null);

      try {
        const success = await deleteCompanyService(companyId);

        if (success) {
          toast.success('Company deleted successfully');

          logActivity('COMPANY_REMOVED', 'Company', companyId, details);
          setIsLoading(false);
          return true;
        } else {
          throw new Error('Deletion failed for an unknown reason.');
        }
      } catch (err) {
        const message = (err as Error).message;
        toast.error(`Failed to delete company: ${message}`);
        setError(message);
        setIsLoading(false);
        return false;
      }
    },
    [userId, logActivity],
  );

  return { deleteCompany, isLoading, error };
}
