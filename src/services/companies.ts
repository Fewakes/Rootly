import { supabase } from '@/lib/supabaseClient';
import type { Company, NewCompanyData } from '@/types/types';

/**
 * Fetches all companies from the database with a count of how many contacts are assigned to each.
 *
 * @returns {Promise<Company[]>} An array of companies with contact counts.
 */
export async function getAllCompanies(): Promise<Company[]> {
  const { data, error } = await supabase
    .from('companies')
    .select('id, created_at, company_logo, name, contact_companies(count)');

  if (error) {
    console.error('Error fetching companies:', error.message);
    return [];
  }

  const companiesWithCount = data.map((company: any) => ({
    ...company,
    contact_count: company.contact_companies[0]?.count ?? 0,
  }));

  return companiesWithCount;
}

export const insertCompany = async (
  company: NewCompanyData,
): Promise<object | null> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .insert([company])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.error('Error inserting company:', (err as Error).message);
    return null;
  }
};
