// src/logic/useCompany.ts

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { getCompanyById } from '@/services/companies';
import type { Company } from '@/types/types';

type CompanyWithRank = Company & { rank?: number; totalCompanies?: number };

export function useCompany(companyId: string | undefined) {
  const [company, setCompany] = useState<CompanyWithRank | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCompany = useCallback(async () => {
    if (!companyId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getCompanyById(companyId);
      setCompany(data);
    } catch (error) {
      toast.error('Failed to load company details.');
      setCompany(null);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  return { company, loading, refetch: fetchCompany };
}
