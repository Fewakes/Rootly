import { useEffect, useState } from 'react';
import { getCompanyById } from 'src/services/companies.ts';

export function useCompanyById(companyId: string) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) return;

    const fetchCompany = async () => {
      setLoading(true);
      setError(null);

      const result = await getCompanyById(companyId);

      if (result) {
        setCompany(result);
      } else {
        setError('Failed to fetch company');
      }

      setLoading(false);
    };

    fetchCompany();
  }, [companyId]);

  return { company, loading, error };
}
