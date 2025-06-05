import { supabase } from '@/lib/supabaseClient';

export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;

    const userId = session?.user?.id || null;
    return userId;
  } catch (err) {
    console.error('Failed to get current user ID:', (err as Error).message);
    return null;
  }
};
