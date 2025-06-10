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
export async function getUserAuthProfile() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error('Error fetching session: ' + error.message);
  }

  const user = session?.user;

  if (!user) {
    throw new Error('No user session found');
  }

  return {
    email: user.email,
    fullName: user.user_metadata.full_name,
    avatarUrl: user.user_metadata.avatar_url,
  };
}
