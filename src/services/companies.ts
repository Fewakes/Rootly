import { supabase } from '@/lib/supabaseClient';
import type { Company } from '@/types/types';

export async function getAllCompanies(): Promise<Company[]> {
  const { data, error } = await supabase
    .from('companies')
    .select(
      'id, created_at, company_logo, description, name, description, contact_companies(count)',
    );

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
  company: Company, //Changed from NewCompanyData
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
    .rpc('get_company_details_with_rank', {
      p_company_id: companyId,
    })
    .single();

  if (error) {
    console.error('Error fetching company by ID with rank:', error.message);
    throw error;
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

/**
 * Fetches ALL companies, including a list of associated contacts (for avatars)
 * and a total count for each.
 */
export const getAllCompaniesWithContacts = async () => {
  const { data, error } = await supabase
    .from('companies')
    .select('id, name, company_logo, description, contacts(id, avatar_url)');

  if (error) {
    console.error('Error fetching all companies:', error);
    throw error;
  }

  const companiesWithCount = data
    .map(company => ({
      ...company,
      count: company.contacts.length,
    }))
    .sort((a, b) => b.count - a.count); // Sort by count descending

  return companiesWithCount;
};

export async function uploadLogo(file: File): Promise<string> {
  const fileName = `${crypto.randomUUID()}-${file.name}`;

  const { error } = await supabase.storage
    .from('logos') // Make sure 'logos' is your correct bucket name
    .upload(fileName, file);

  if (error) {
    console.error('Logo upload failed:', error);
    throw new Error('Logo upload failed: ' + error.message);
  }

  const { data } = supabase.storage.from('logos').getPublicUrl(fileName);
  return data.publicUrl;
}
