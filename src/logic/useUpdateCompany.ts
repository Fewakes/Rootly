import { updateCompany } from '@/services/companies';
import type { Company } from '@/types/types';
import { useState } from 'react';
import { toast } from 'sonner';

type UpdateCompanyArgs = Partial<
  Omit<Company, 'id' | 'created_at' | 'user_count'>
>;

export function useUpdateCompany() {
  const [loading, setLoading] = useState(false);

  const handleUpdateCompany = async (
    companyId: string,
    updates: UpdateCompanyArgs,
  ) => {
    setLoading(true);
    const success = await updateCompany(companyId, updates);

    if (success) {
      toast.success('Company updated successfully');
    } else {
      toast.error('Failed to update company');
    }

    setLoading(false);
    return success;
  };

  return {
    updateCompany: handleUpdateCompany,
    loading,
  };
}
