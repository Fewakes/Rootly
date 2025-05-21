import { supabase } from '@/lib/supabaseClient';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

export async function syncUserToDB(user: User | null) {
  if (!user) return;

  const { error } = await supabase.from('users').upsert({
    id: user.id,
    full_name: user.user_metadata.full_name || '',
    email: user.email,
    avatar_url: user.user_metadata.avatar_url || '',
  });

  if (error) {
    console.error('Failed to sync user to DB:', error);
  } else {
    console.log('User synced to DB');
  }
}

supabase.auth.onAuthStateChange(
  (event: AuthChangeEvent, session: Session | null) => {
    if (event === 'SIGNED_IN') {
      syncUserToDB(session?.user ?? null);
    }
  },
);
