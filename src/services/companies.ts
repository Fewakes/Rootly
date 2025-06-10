import { supabase } from '@/lib/supabaseClient';
import type { Company, NewCompanyData, PopularCompany } from '@/types/types';

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

export async function deleteCompany(companyId: string): Promise<boolean> {
  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', companyId);

  if (error) {
    console.error('Error deleting company:', error.message);
    return false;
  }

  return true;
}

export async function getCompanyById(
  companyId: string,
): Promise<Company | null> {
  const { data, error } = await supabase
    .from('companies')
    .select('id, created_at, company_logo, name, user_count')
    .eq('id', companyId)
    .single();

  if (error) {
    console.error('Error fetching company by ID:', error.message);
    return null;
  }

  return data;
}

export async function updateCompany(
  companyId: string,
  updates: Partial<Omit<Company, 'id' | 'created_at' | 'user_count'>>,
): Promise<boolean> {
  const { error } = await supabase
    .from('companies')
    .update(updates)
    .eq('id', companyId);

  if (error) {
    console.error('Error updating company:', error.message);
    return false;
  }

  return true;
}

export const getPopularCompanies = async (
  limit: number,
): Promise<PopularCompany[]> => {
  // Fetch contact-company relationships with company details
  const { data, error } = await supabase.from('contact_companies').select(`
    company_id,
    companies (
      id,
      name,
      company_logo
    )
  `);

  if (error) {
    console.error('Error fetching contact companies:', error.message);
    return [];
  }

  // Count contacts per company and store logo
  const companyCountMap: Record<
    string,
    { name: string; count: number; company_logo?: string }
  > = {};

  data.forEach(entry => {
    const companyId = entry.company_id;
    const company = entry.companies;
    const companyName = company?.name || 'Unknown';
    const companyLogo = company?.company_logo;

    if (!companyCountMap[companyId]) {
      companyCountMap[companyId] = {
        name: companyName,
        count: 0,
        company_logo: companyLogo,
      };
    }
    companyCountMap[companyId].count += 1;
  });

  // Convert map to array and sort by contact count descending, then slice top limit
  const sortedCompanies: PopularCompany[] = Object.entries(companyCountMap)
    .map(([id, { name, count, company_logo }]) => ({
      id,
      name,
      count,
      company_logo,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return sortedCompanies;
};
