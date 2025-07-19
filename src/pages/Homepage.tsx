import { useState, useEffect } from 'react';
import {
  Users,
  Tag,
  UserPlus,
  Briefcase,
  Users2,
  Zap,
  PlusCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useDashboardStats } from '@/logic/useDashboardStats';
import { useFavouriteContacts } from '@/logic/useFavouriteContacts';
import { useDialog } from '@/contexts/DialogContext';

import ActivityFeed from '@/features/homepage/ActivityFeed';
import { GroupsDistributionWidget } from '@/features/homepage/GroupsDistributionWidget';
import { StatCard } from '@/features/homepage/StatCard';
import { TagsDistributionWidget } from '@/features/homepage/TagsDistributionWidget';
import { CompaniesDistributionWidget } from '@/features/homepage/CompaniesDistributionWidget';
import FavouriteContacts from '@/features/homepage/FavouriteContacts';
import UpcomingTasks from '@/features/homepage/UpcomingTasks';
import { useUserAuthProfile } from '@/logic/useUserAuthProfile';
import { useUserId } from '@/logic/useUserId';
import { getUserAuthProfile } from '@/services/users';
import { CallToActionBanner } from '@/features/homepage/CallToActionBanner';

const StatCardSkeleton = () => (
  <div className="h-[108px] bg-muted rounded-xl animate-pulse" />
);

export default function Homepage() {
  const { userId: id } = useUserId();
  const { fullName } = getUserAuthProfile();
  const { openDialog } = useDialog();

  const { stats, loading: statsLoading } = useDashboardStats();
  const { contacts: favouriteContactsData = [], isLoading: contactsLoading } =
    useFavouriteContacts();

  const isLoading = statsLoading || contactsLoading;

  return (
    <>
      <main className="max-w-7xl mx-auto p-6 space-y-10">
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

        <section className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Left column: Favourite Contacts, Upcoming Tasks, Activity Feed */}

          <div className="w-full lg:w-3/5 space-y-8 ">
            <FavouriteContacts favouriteContacts={favouriteContactsData} />
            <UpcomingTasks currentUserId={id} />
            <ActivityFeed limit={5} />
          </div>

          {/* Right column: Distribution Widgets */}

          <div className="w-full lg:w-2/5">
            {/* 1. Add this wrapper div with sticky positioning */}
            <div className=" top-8 space-y-8 flex flex-col">
              <TagsDistributionWidget />
              <GroupsDistributionWidget />
              <CompaniesDistributionWidget />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
