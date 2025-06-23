import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const useAllCompanies = () => {
  const [companies, setCompanies] = useState<CompanyWithContacts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllCompanies = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.from('companies').select(`
            id,
            name,
            company_logo,
            created_at,
            contacts:contact_companies(
              contacts(id, name, avatar_url)
            )
          `);

        if (error) throw error;

        const companiesWithCount = data.map(company => ({
          ...company,
          contact_avatars: company.contacts
            .map(c => c.contacts)
            .filter(Boolean),
          contact_count: company.contacts.length,
        }));

        setCompanies(companiesWithCount);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching all companies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCompanies();
  }, []);

  return { companies, loading, error };
};
