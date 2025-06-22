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
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg mb-6 flex flex-col md:flex-row items-center justify-between  md:space-y-0 md:space-x-4 mr-5 ml-5">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome Back !
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            Let's make today productive.
          </p>
        </div>
        <Button className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 dark:bg-gray-800 dark:text-blue-300 dark:hover:bg-gray-700 dark:hover:text-blue-200 transition-colors duration-200 px-6 py-3 text-lg font-semibold rounded-full shadow-md flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          Add New Contact
        </Button>
      </div>
      <main className="max-w-7xl mx-auto p-6 space-y-10">
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
        {/* CHANGED: Switched from 'grid' to 'flex' for equal height columns */}
        <section className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Left column: Favourite Contacts, Upcoming Tasks, Activity Feed */}
          {/* CHANGED: Replaced 'lg:col-span-3' with 'w-full lg:w-3/5' */}
          <div className="w-full lg:w-3/5 space-y-12 flex flex-col ">
            {/* Uncomment below to enable favourite contacts */}
            <FavouriteContacts favouriteContacts={favouriteContactsData} />
            <UpcomingTasks currentUserId={id} />
            <ActivityFeed limit={5} />
          </div>

          {/* Right column: Distribution Widgets */}
          {/* CHANGED: Replaced 'lg:col-span-2' with 'w-full lg:w-2/5' */}
          <div className="w-full lg:w-2/5 space-y-8 flex flex-col gap-8">
            <TagsDistributionWidget />
            <GroupsDistributionWidget />
            <CompaniesDistributionWidget />
          </div>
        </section>
      </main>
    </>
  );
}
