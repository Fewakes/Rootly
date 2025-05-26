import { supabase } from '@/lib/supabaseClient';

/**
 * Retrieves the currently authenticated user's ID.
 *
 * @returns {Promise<string | null>} The user's ID, or null if not found or an error occurs.
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    // Get the current session from Supabase Auth
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;

    // Return the user ID from the session if available
    const userId = session?.user?.id || null;
    return userId;
  } catch (err) {
    // Log and return null if an error occurs
    console.error('Failed to get current user ID:', (err as Error).message);
    return null;
  }
};
