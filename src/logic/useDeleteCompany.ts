import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { deleteCompany as deleteCompanyService } from '@/services/companies';

export function useDeleteCompany() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCompany = useCallback(
    async (companyId: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const success = await deleteCompanyService(companyId);

        if (success) {
          toast.success('Company deleted successfully');
          setIsLoading(false);
          return true;
        } else {
          throw new Error('Unknown error');
        }
      } catch (err) {
        const message = (err as Error).message;
        toast.error(`Failed to delete company: ${message}`);
        setError(message);
        setIsLoading(false);
        return false;
      }
    },
    [],
  );

  return { deleteCompany, isLoading, error };
}
