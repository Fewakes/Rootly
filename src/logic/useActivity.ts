import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { formatDistanceToNow } from 'date-fns';
import type { ActivityLogEntry } from '@/types/types';

export const useActivities = ({
  page = 1,
  pageSize = 10,
  limit,
}: {
  page?: number;
  pageSize?: number;
  limit?: number;
}) => {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const formatTimeAgo = useCallback((dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      setError(null);
      try {
        let query = supabase
          .from('activity_log')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false });

        if (limit) {
          query = query.limit(limit);
        } else {
          const from = (page - 1) * pageSize;
          const to = from + pageSize - 1;
          query = query.range(from, to);
        }

        const { data, error, count } = await query;

        if (error) throw error;

        setActivities(data || []);
        setTotalCount(count || 0);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [page, pageSize, limit]);

  return { activities, loading, error, totalCount, formatTimeAgo };
};
