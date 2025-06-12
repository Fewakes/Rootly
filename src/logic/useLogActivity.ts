import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  type ActivityAction,
  logActivity as logToSupabase,
} from '@/services/activityLogger';

export function useLogActivity() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        setUserId(session?.user?.id || null);
      } catch (err) {
        console.error('Failed to fetch user ID:', (err as Error).message);
        setUserId(null);
      }
    };

    fetchUserId();
  }, []);

  const logActivity = async (
    action: ActivityAction,
    entityType: string,
    entityId?: string,
    details?: Record<string, any>,
  ) => {
    if (!userId) return;
    await logToSupabase({ userId, action, entityType, entityId, details });
  };

  return { logActivity, userId };
}
