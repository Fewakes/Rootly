import { Users, Tag, UserPlus, Briefcase, Users2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useDashboardStats } from '@/logic/useDashboardStats';
import { useRecentContacts } from '@/logic/useRecentContacts';
import { useDialog } from '@/contexts/DialogContext';
import { TAG_BG_CLASSES, TAG_TEXT_CLASSES } from '@/lib/utils';
import type { TagColor } from '@/types/types';
import ActivityFeed from '@/components/ActivityFeed';
import { GroupsDistributionWidget } from '@/components/GroupsDistributionWidget';
import { StatCard } from '@/components/StatCard';
import { TagsDistributionWidget } from '@/components/TagsPieChartWidget';
import { TopCompaniesWidget } from '@/components/TopCompaniesWidget';
import RecentContacts from '@/components/ui/recentContacts';

// --- Helper Functions ---
const getTagBgClass = (color: string) =>
  TAG_BG_CLASSES[color as TagColor] || 'bg-gray-100 dark:bg-gray-800';
const getTagTextClass = (color: string) =>
  TAG_TEXT_CLASSES[color as TagColor] || 'text-gray-800 dark:text-gray-200';

// --- Loading State Component ---
const StatCardSkeleton = () => (
  <div className="h-[108px] bg-muted rounded-xl animate-pulse" />
);

// --- Main Homepage Component ---
export default function Homepage() {
  // All data fetching and logic is now contained within this component.
  const { openDialog } = useDialog();
  const { stats, loading: statsLoading } = useDashboardStats();
  const { contacts: recentContacts = [], isLoading: contactsLoading } =
    useRecentContacts(3);

  // A single loading state for the entire page.
  const isLoading = statsLoading || contactsLoading;

  return (
    <main className="max-w-7xl mx-auto p-6 space-y-10">
      {/* Section 1: Call to action */}

      <section className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>

          <p className="text-lg opacity-90">
            Manage your connections effortlessly.
          </p>
        </div>

        <Button
          className="bg-white text-indigo-600 hover:bg-gray-100 px-6 py-3 text-base font-semibold"
          onClick={() => openDialog('addContact')}
        >
          <UserPlus className="w-5 h-5 mr-2" /> Add New Contact
        </Button>
      </section>

      {/* Section 2: Top-level key performance indicators (KPIs) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Contacts"
              value={stats.contacts.total}
              icon={Users}
              trendValue={stats.contacts.trend}
              trendText="today"
            />
            <StatCard
              title="Total Tags"
              value={stats.tags.total}
              icon={Tag}
              trendValue={stats.tags.trend}
              trendText="today"
            />
            <StatCard
              title="Total Groups"
              value={stats.groups.total}
              icon={Users2}
              trendValue={stats.groups.trend}
              trendText="today"
            />
            <StatCard
              title="Total Companies"
              value={stats.companies.total}
              icon={Briefcase}
              trendValue={stats.companies.trend}
              trendText="today"
            />
          </>
        )}
      </section>

      <Separator />

      {/* Section 3: Main content grid with detailed widgets */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Main column for lists and feeds */}
        <div className="lg:col-span-3 space-y-8">
          <RecentContacts
            recentContacts={recentContacts}
            getTagBgClass={getTagBgClass}
            getTagTextClass={getTagTextClass}
          />
          <ActivityFeed limit={5} />
        </div>

        {/* Sidebar column for charts and insights */}
        <div className="lg:col-span-2 space-y-8">
          <TagsDistributionWidget
            getTagBgClass={getTagBgClass}
            getTagTextClass={getTagTextClass}
          />
          <GroupsDistributionWidget />
          <TopCompaniesWidget />
        </div>
      </section>
    </main>
  );
}
