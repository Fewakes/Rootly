import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { formatDistanceToNowStrict } from 'date-fns';

export type ActivityAction =
  | 'CONTACT_CREATED'
  | 'CONTACT_UPDATED'
  | 'CONTACT_DELETED'
  | 'NOTE_CREATED'
  | 'NOTE_REMOVED'
  | 'NOTE_EDITED'
  | 'TASK_CREATED'
  | 'TASK_COMPLETED'
  | 'TASK_EDITED'
  | 'GROUP_ASSIGNED'
  | 'GROUP_CREATED'
  | 'GROUP_REMOVED'
  | 'GROUP_EDITED'
  | 'TAG_ASSIGNED'
  | 'TAG_CREATED'
  | 'TAG_REMOVED'
  | 'TAG_EDITED'
  | 'COMPANY_ASSIGNED'
  | 'COMPANY_CREATED'
  | 'COMPANY_REMOVED'
  | 'COMPANY_EDITED';

export type ActivityLogEntry = {
  id: string;
  user_id: string;
  action: ActivityAction;
  entity_type: string;
  entity_id?: string;
  description: string;
  created_at: string;
  details?: Record<string, any>;
};

export function useActivities(limit = 50) {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from<'activity_log', ActivityLogEntry>('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        setError(error.message);
        setActivities([]);
      } else {
        setActivities(data || []);
      }

      setLoading(false);
    };

    fetchActivities();
  }, [limit]);

  function formatTimeAgo(timestamp: string) {
    return formatDistanceToNowStrict(new Date(timestamp), { addSuffix: true });
  }

  return {
    activities,
    loading,
    error,
    formatTimeAgo,
  };
}
