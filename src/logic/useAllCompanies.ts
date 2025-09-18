import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { CompanyWithContacts } from '@/types/types';

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
            description,
            created_at,
            contacts:contact_companies(
              contacts(id, name, avatar_url)
            )
          `);

        if (error) throw error;

        const companiesWithCount: CompanyWithContacts[] = (data ?? []).map(
          company => {
            const contacts = company.contacts ?? [];
            const contactAvatars = contacts
              .map((c: any) => c.contacts)
              .filter(Boolean)
              .map((contact: any) => ({
                id: contact.id,
                name: contact.name,
                avatar_url: contact.avatar_url ?? null,
              }));

            return {
              id: company.id,
              name: company.name,
              company_logo: company.company_logo ?? null,
              description: company.description ?? null,
              created_at: company.created_at,
              contact_count: contacts.length,
              contact_avatars: contactAvatars,
            } as CompanyWithContacts;
          },
        );

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
