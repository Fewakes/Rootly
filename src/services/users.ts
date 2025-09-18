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

  // Use storage public URL if avatar_url exists
  let avatarUrl: string | null = null;
  if (user.user_metadata.avatar_url) {
    const { data } = supabase.storage
      .from('avatars') // 👈 name of your storage bucket
      .getPublicUrl(user.user_metadata.avatar_url);

    avatarUrl = data?.publicUrl || null;
  }

  return {
    email: user.email,
    fullName: user.user_metadata.full_name,
    avatarUrl,
  };
}
