import {
  Users,
  Tag,
  Briefcase,
  Users2,
  Zap,
  CircleHelp,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { useDashboardStats } from '@/logic/useDashboardStats';
import { useFavouriteContacts } from '@/logic/useFavouriteContacts';

import ActivityFeed from '@/features/homepage/ActivityFeed';
import { GroupsDistributionWidget } from '@/features/homepage/GroupsDistributionWidget';
import { StatCard } from '@/features/homepage/StatCard';
import { TagsDistributionWidget } from '@/features/homepage/TagsDistributionWidget';
import { CompaniesDistributionWidget } from '@/features/homepage/CompaniesDistributionWidget';
import FavouriteContacts from '@/features/homepage/FavouriteContacts';
import UpcomingTasks from '@/features/homepage/UpcomingTasks';
import { useUserId } from '@/logic/useUserId';
import { CallToActionBanner } from '@/features/homepage/CallToActionBanner';

const StatCardSkeleton = () => (
  <div className="h-[108px] bg-muted rounded-xl animate-pulse" />
);

export default function Homepage() {
  const { userId: id } = useUserId();

  const { stats, loading: statsLoading } = useDashboardStats();
  const { contacts: favouriteContactsData = [], loading: contactsLoading } =
    useFavouriteContacts();

  const isLoading = statsLoading || contactsLoading;

  const handleShowHelp = () => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new Event('cta:show'));
  };

  return (
    <>
      <main className="max-w-7xl mx-auto p-6 space-y-10">
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="fixed bottom-6 right-6 z-50 shadow-md text-muted-foreground hover:text-primary"
                onClick={handleShowHelp}
                aria-label="Show getting started tips"
              >
                <CircleHelp className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Show getting started tips</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <CallToActionBanner />
        {/* Section 1: Dashboard Stats */}

        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Dashboard Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap justify-center gap-4">
            {isLoading ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)]"
                  >
                    <StatCardSkeleton />
                  </div>
                ))}
              </>
            ) : (
              <>
                <StatCard
                  title="Total Contacts"
                  value={stats.contacts.total}
                  icon={Users}
                  trendValue={stats.contacts.trend}
                  className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)]"
                />
                <StatCard
                  title="Total Tags"
                  value={stats.tags.total}
                  icon={Tag}
                  trendValue={stats.tags.trend}
                  className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)]"
                />
                <StatCard
                  title="Total Groups"
                  value={stats.groups.total}
                  icon={Users2}
                  trendValue={stats.groups.trend}
                  className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)]"
                />
                <StatCard
                  title="Total Companies"
                  value={stats.companies.total}
                  icon={Briefcase}
                  trendValue={stats.companies.trend}
                  className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)]"
                />
              </>
            )}
          </CardContent>
        </Card>

        <Separator />

        {/* Section 2: Main Grid */}

        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:grid-rows-3 gap-8 max-w-7xl mx-auto items-stretch">
          <div className="lg:col-start-1 lg:row-start-1 h-full">
            <FavouriteContacts favouriteContacts={favouriteContactsData} />
          </div>
          <div className="lg:col-start-2 lg:row-start-1 h-full">
            <TagsDistributionWidget />
          </div>

          <div className="lg:col-start-1 lg:row-start-2 h-full">
            <UpcomingTasks currentUserId={id} />
          </div>
          <div className="lg:col-start-2 lg:row-start-2 h-full">
            <GroupsDistributionWidget />
          </div>

          <div className="lg:col-start-1 lg:row-start-3 h-full">
            <ActivityFeed limit={5} />
          </div>
          <div className="lg:col-start-2 lg:row-start-3 h-full">
            <CompaniesDistributionWidget />
          </div>
        </section>
      </main>
    </>
  );
}
