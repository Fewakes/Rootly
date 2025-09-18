import { supabase } from '@/lib/supabaseClient';

const service = (table: string) => ({
  async getAll(userId: string, entityIdKey: string, entityId: string) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', userId)
      .eq(entityIdKey, entityId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(entry: Record<string, any>) {
    const { data, error } = await supabase
      .from(table)
      .insert(entry)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Record<string, any>) {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteById(id: string): Promise<void> {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
  },
});

export const companyNotesService = service('company_notes');
export const companyTasksService = service('company_tasks');
export const groupNotesService = service('group_notes');
export const groupTasksService = service('group_tasks');
export const tagNotesService = service('tag_notes');
export const tagTasksService = service('tag_tasks');
