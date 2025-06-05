import { supabase } from '@/lib/supabaseClient';
import type { Company, NewCompanyData } from '@/types/types';

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
