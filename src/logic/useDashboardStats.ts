import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { subDays } from 'date-fns';

/**
 * ✨ FIX: This helper function now accepts the exact action names, making it flexible.
 * It calculates the net trend for an entity since midnight today.
 * @param createAction - The exact string for the creation action (e.g., 'CONTACT_CREATED').
 * @param deleteAction - The exact string for the deletion action (e.g., 'CONTACT_DELETED' or 'COMPANY_REMOVED').
 */
const getDailyTrend = async (createAction: string, deleteAction: string) => {
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);
  const startOfTodayISO = startOfToday.toISOString();

  const [{ count: createdCount }, { count: deletedCount }] = await Promise.all([
    supabase
      .from('activity_log')
      .select('*', { count: 'exact', head: true })
      .eq('action', createAction)
      .gte('created_at', startOfTodayISO),
    supabase
      .from('activity_log')
      .select('*', { count: 'exact', head: true })
      .eq('action', deleteAction)
      .gte('created_at', startOfTodayISO),
  ]);

  return (createdCount || 0) - (deletedCount || 0);
};

// These other helper functions remain the same
const getUntaggedContactsCount = async () => {
  /* ... */
};
const getActivitiesTodayCount = async () => {
  /* ... */
};

export const useDashboardStats = () => {
  const [stats, setStats] = useState({
    contacts: { total: 0, trend: 0 },
    tags: { total: 0, trend: 0 },
    groups: { total: 0, trend: 0 },
    companies: { total: 0, trend: 0 },
    untaggedContacts: 0,
    activitiesToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        const [
          contactsRes,
          tagsRes,
          groupsRes,
          companiesRes,
          contactsTrend,
          tagsTrend,
          groupsTrend,
          companiesTrend,
          untaggedCount,
          activitiesTodayCount,
        ] = await Promise.all([
          // These fetch the total counts
          supabase.from('contacts').select('*', { count: 'exact', head: true }),
          supabase.from('tags').select('*', { count: 'exact', head: true }),
          supabase.from('groups').select('*', { count: 'exact', head: true }),
          supabase
            .from('companies')
            .select('*', { count: 'exact', head: true }),

          // ✨ FIX: We now pass the correct action names for each entity
          getDailyTrend('CONTACT_CREATED', 'CONTACT_DELETED'), // Uses _DELETED
          getDailyTrend('TAG_CREATED', 'TAG_REMOVED'), // Uses _REMOVED
          getDailyTrend('GROUP_CREATED', 'GROUP_REMOVED'), // Uses _REMOVED
          getDailyTrend('COMPANY_CREATED', 'COMPANY_REMOVED'), // Uses _REMOVED

          getUntaggedContactsCount(),
          getActivitiesTodayCount(),
        ]);

        setStats({
          contacts: { total: contactsRes.count || 0, trend: contactsTrend },
          tags: { total: tagsRes.count || 0, trend: tagsTrend },
          groups: { total: groupsRes.count || 0, trend: groupsTrend },
          companies: { total: companiesRes.count || 0, trend: companiesTrend },
          untaggedContacts: untaggedCount,
          activitiesToday: activitiesTodayCount,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllStats();
  }, []);

  return { stats, loading };
};
