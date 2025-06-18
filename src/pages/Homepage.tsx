import { useState, useEffect } from 'react';
import { Users, Tag, UserPlus, Briefcase, Users2, Zap } from 'lucide-react';
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
import FavouriteContacts from '@/features/homepage/FavouriteContacts'; // This is your component

const StatCardSkeleton = () => (
  <div className="h-[108px] bg-muted rounded-xl animate-pulse" />
);

export default function Homepage() {
  const { openDialog } = useDialog();

  const { stats, loading: statsLoading } = useDashboardStats();
  // Renamed the local variable from 'FavouriteContacts' to 'favouriteContactsData'
  const { contacts: favouriteContactsData = [], isLoading: contactsLoading } =
    useFavouriteContacts();

  const isLoading = statsLoading || contactsLoading;

  return (
    <main className="max-w-7xl mx-auto p-6 space-y-10">
      {/* Section 1: Statistics (KPIs) - Wrapped in a Card */}
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
              <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)]">
                {' '}
                <StatCardSkeleton />{' '}
              </div>
              <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)]">
                {' '}
                <StatCardSkeleton />{' '}
              </div>
              <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)]">
                {' '}
                <StatCardSkeleton />{' '}
              </div>
              <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)]">
                {' '}
                <StatCardSkeleton />{' '}
              </div>
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

      {/* Section 2: Main Content Grid (Favourite Contacts + Activity Feed | Distribution Widgets) */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-7xl mx-auto ">
        {/* Left Column: Favourite Contacts and Activity Feed */}
        <div className="lg:col-span-3 space-y-8">
          {/* Favourite Contacts - Now wrapped in a Card */}

          {/* Pass the renamed data to the component's 'recentContacts' prop */}
          <FavouriteContacts favouriteContacts={favouriteContactsData} />

          <ActivityFeed limit={5} />
        </div>

        {/* Right Column: Distribution Widgets */}
        <div className="lg:col-span-2 space-y-8">
          <TagsDistributionWidget />
          <GroupsDistributionWidget />
          <CompaniesDistributionWidget />
        </div>
      </section>
    </main>
  );
}
