'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { useDialog } from '@/contexts/DialogContext';
import { useAllGroups } from '@/logic/useAllGroups';
import { useFavoriteGroups } from '@/logic/useFavoriteGroups';

import {
  Users2,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
  TrendingUp,
  Clock,
  Pin,
  X,
} from 'lucide-react';
import type { GroupWithContacts } from '@/types/types';
import { GroupListItem } from '@/features/groups/GroupListItem';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const numberFormatter = new Intl.NumberFormat('en-US');
const DEFAULT_ITEMS_PER_PAGE = 10;

const InsightStat = ({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) => (
  <div className="rounded-lg border border-border bg-background/70 p-4 shadow-sm">
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
    <div className="mt-3 flex items-baseline justify-between gap-2">
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      {helper ? (
        <span className="text-sm italic text-muted-foreground whitespace-nowrap">
          {helper}
        </span>
      ) : null}
    </div>
  </div>
);

const TrendingGroupItem = ({
  group,
  index,
  averageMembers,
}: {
  group: GroupWithContacts;
  index: number;
  averageMembers: number;
}) => {
  const delta = group.contact_count - averageMembers;
  let deltaLabel = '';
  let deltaClass = 'text-muted-foreground';
  if (delta > 0) {
    deltaLabel = `↑ ${delta} above avg`;
    deltaClass = 'text-emerald-600';
  } else if (delta < 0) {
    deltaLabel = `↓ ${Math.abs(delta)} below avg`;
    deltaClass = 'text-amber-600';
  } else {
    deltaLabel = 'Matches avg engagement';
  }

  return (
    <Link
      to={`/groups/${group.id}`}
      className="flex items-center justify-between rounded-lg border border-border bg-background/70 p-3 transition-colors hover:border-primary/60 hover:text-primary"
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg shadow-sm text-sm font-semibold',
            index === 0
              ? 'bg-primary text-white'
              : index === 1
                ? 'bg-blue-600 text-white'
                : index === 2
                  ? 'bg-slate-300 text-slate-800'
                  : 'bg-muted text-muted-foreground',
          )}
        >
          {index < 3 ? index + 1 : <Users className="h-4 w-4" />}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{group.name}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{numberFormatter.format(group.contact_count)} members</span>
          </div>
          <p className={cn('mt-1 text-xs font-medium', deltaClass)}>
            {deltaLabel}
          </p>
        </div>
      </div>
      <Badge
        variant="secondary"
        className="uppercase tracking-wide border-border/70"
      >
        Trending
      </Badge>
    </Link>
  );
};

export default function Groups() {
  const { openDialog } = useDialog();
  const { groups, loading, error } = useAllGroups();
  const {
    favoriteGroupIds,
    loading: favouriteGroupsLoading,
    mutating: favouriteGroupsMutating,
    addFavoriteGroup,
    removeFavoriteGroup,
  } = useFavoriteGroups();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

  const groupStats = useMemo(() => {
    if (!Array.isArray(groups) || groups.length === 0) {
      return {
        totalGroups: 0,
        totalMembers: 0,
        averageSize: 0,
        activeGroups: 0,
        dormantGroups: 0,
        newThisMonth: 0,
        newestGroup: null as GroupWithContacts | null,
        standout: [] as GroupWithContacts[],
      };
    }

    const totalGroups = groups.length;
    const totalMembers = groups.reduce(
      (acc, group) => acc + (group.contact_count ?? 0),
      0,
    );
    const averageSize = Math.round(totalMembers / Math.max(totalGroups, 1));
    const activeGroups = groups.filter(group => group.contact_count > 0).length;
    const dormantGroups = totalGroups - activeGroups;
    const coverage =
      totalGroups === 0 ? 0 : Math.round((activeGroups / totalGroups) * 100);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newThisMonth = groups.filter(
      group => new Date(group.created_at) >= thirtyDaysAgo,
    ).length;

    const newestGroup =
      groups
        .slice()
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )[0] || null;

    const standout = groups
      .slice()
      .sort((a, b) => b.contact_count - a.contact_count)
      .slice(0, 3);

    return {
      totalGroups,
      totalMembers,
      averageSize,
      activeGroups,
      dormantGroups,
      coverage,
      newThisMonth,
      newestGroup,
      standout,
    };
  }, [groups]);

  const favoriteGroupDetails = useMemo(() => {
    if (!Array.isArray(groups) || favoriteGroupIds.length === 0)
      return [] as GroupWithContacts[];
    return favoriteGroupIds
      .map(id => groups.find(group => group.id === id))
      .filter((group): group is GroupWithContacts => Boolean(group));
  }, [groups, favoriteGroupIds]);

  const availableGroupsToPin = useMemo(() => {
    if (!Array.isArray(groups)) return [] as GroupWithContacts[];
    return groups.filter(group => !favoriteGroupIds.includes(group.id));
  }, [groups, favoriteGroupIds]);

  const filteredAndSortedGroups = useMemo(() => {
    if (!Array.isArray(groups)) return [] as GroupWithContacts[];

    let result = groups.filter(group =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const [key, direction] = sortBy.split('-');
    result.sort((a, b) => {
      let valA = a[key as keyof typeof a];
      let valB = b[key as keyof typeof b];

      if (valA === undefined || valA === null) {
        return valB === undefined || valB === null
          ? 0
          : direction === 'asc'
            ? 1
            : -1;
      }
      if (valB === undefined || valB === null) {
        return direction === 'asc' ? -1 : 1;
      }

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [groups, searchTerm, sortBy]);

  const paginatedGroups = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedGroups.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage, filteredAndSortedGroups]);

  const totalPages = Math.ceil(filteredAndSortedGroups.length / itemsPerPage);
  const shouldScrollGroupList = itemsPerPage > DEFAULT_ITEMS_PER_PAGE;

  const momentumGroups = useMemo(() => {
    if (!Array.isArray(groups)) return [] as GroupWithContacts[];
    return groupStats.standout;
  }, [groups, groupStats.standout]);

  const recentGroups = useMemo(() => {
    if (!Array.isArray(groups)) return [] as GroupWithContacts[];
    return [...groups]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 4);
  }, [groups]);

  const renderContent = () => {
    if (loading)
      return (
        <p className="col-span-full py-10 text-center text-muted-foreground">
          Loading groups...
        </p>
      );
    if (error)
      return (
        <p className="col-span-full py-10 text-center text-destructive">
          Error: {error}
        </p>
      );

    if (paginatedGroups.length === 0)
      return (
        <p className="col-span-full py-10 text-center text-muted-foreground">
          No groups found. Adjust the filters to explore more cohorts.
        </p>
      );

    return paginatedGroups.map(group => (
      <GroupListItem key={group.id} group={group} />
    ));
  };

  const handlePinGroup = (id: string) => {
    if (!id || favouriteGroupsLoading || favouriteGroupsMutating) return;
    addFavoriteGroup(id);
  };

  const handleUnpinGroup = (id: string) => {
    if (favouriteGroupsMutating) return;
    removeFavoriteGroup(id);
  };

  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      <Card className="overflow-hidden border-border/80 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" /> Group Intelligence
            </div>
            <CardTitle className="text-3xl font-bold text-foreground">
              Coordinate your communities with confidence
            </CardTitle>
            <CardDescription className="max-w-2xl text-base">
              Track coverage, surface standout cohorts, and keep the right teams
              pinned.
            </CardDescription>
          </div>
          <Button
            size="lg"
            onClick={() => openDialog('addGroup')}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <Users2 className="mr-2 h-5 w-5" /> Create Group
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InsightStat
            label="Total Groups"
            value={numberFormatter.format(groupStats.totalGroups)}
            helper={`${numberFormatter.format(groupStats.activeGroups)} active`}
          />
          <InsightStat
            label="Contacts Linked"
            value={numberFormatter.format(groupStats.totalMembers)}
            helper={`Avg ${numberFormatter.format(groupStats.averageSize)} per group`}
          />
          <InsightStat
            label="Active Coverage"
            value={`${groupStats.coverage}%`}
            helper={`${numberFormatter.format(groupStats.activeGroups)} active · ${numberFormatter.format(groupStats.dormantGroups)} idle`}
          />
          <InsightStat
            label="New This Month"
            value={numberFormatter.format(groupStats.newThisMonth)}
            helper={
              groupStats.newThisMonth > 0 && groupStats.newestGroup
                ? `Latest: ${groupStats.newestGroup.name}`
                : 'No groups created in the last 30 days'
            }
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] xl:items-stretch">
        <Card
          className="flex h-full flex-col"
          style={shouldScrollGroupList ? { maxHeight: '960px' } : undefined}
        >
          <CardHeader className="border-b">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Group Directory</CardTitle>
                  <CardDescription>
                    Browse and manage cohorts with search and tailored ordering.
                  </CardDescription>
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="relative w-full lg:max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search groups by name..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={e => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>

                <div className="flex w-full flex-wrap gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <Select
                    value={sortBy}
                    onValueChange={value => {
                      setSortBy(value);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                      <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                      <SelectItem value="created_at-desc">
                        Newest First
                      </SelectItem>
                      <SelectItem value="created_at-asc">
                        Oldest First
                      </SelectItem>
                      <SelectItem value="contact_count-desc">
                        Most Members
                      </SelectItem>
                      <SelectItem value="contact_count-asc">
                        Fewest Members
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0 min-h-0">
            <div
              className={cn(
                'h-full min-h-0 pr-1',
                shouldScrollGroupList && 'overflow-y-auto',
              )}
            >
              <div className="divide-y divide-border">{renderContent()}</div>
            </div>
          </CardContent>

          {totalPages > 1 && (
            <CardFooter className="mt-auto flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Rows per page
                </span>
                <Select
                  value={`${itemsPerPage}`}
                  onValueChange={value => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder={itemsPerPage} />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 15, 20].map(size => (
                      <SelectItem key={size} value={`${size}`}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCurrentPage(prev => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCurrentPage(prev => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardFooter>
          )}
        </Card>

        <div
          className="flex h-full flex-col gap-6"
          style={shouldScrollGroupList ? { maxHeight: '960px' } : undefined}
        >
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pinned Groups</CardTitle>
                <CardDescription>
                  Keep your go-to groups handy for quick collaboration.
                </CardDescription>
              </div>
              <Pin className="hidden h-5 w-5 text-muted-foreground sm:block" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="space-y-3">
                {favouriteGroupsLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div
                        key={`favorite-group-skeleton-${idx}`}
                        className="flex items-center justify-between rounded-lg border border-border bg-background/70 p-3"
                      >
                        <div className="flex flex-1 items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-lg" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    ))}
                  </div>
                ) : favoriteGroupDetails.length > 0 ? (
                  favoriteGroupDetails.map(group => (
                    <div
                      key={group.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-background/70 p-3"
                    >
                      <Link
                        to={`/groups/${group.id}`}
                        className="flex flex-1 items-center gap-3 text-foreground no-underline transition-colors hover:text-primary"
                      >
                        <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-sm font-semibold">
                          {group.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{group.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {numberFormatter.format(group.contact_count)}{' '}
                            members
                          </p>
                        </div>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleUnpinGroup(group.id)}
                        aria-label={`Unpin ${group.name}`}
                        disabled={favouriteGroupsMutating}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    You haven't pinned any groups yet. Pin the teams you return
                    to most often.
                  </p>
                )}
              </div>

              {availableGroupsToPin.length > 0 ? (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Select
                    key={favoriteGroupIds.join('-') || 'empty'}
                    onValueChange={handlePinGroup}
                  >
                    <SelectTrigger
                      className="w-full sm:w-[220px]"
                      disabled={
                        favouriteGroupsLoading || favouriteGroupsMutating
                      }
                    >
                      <SelectValue placeholder="Pin another group" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableGroupsToPin.map(group => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground sm:ml-2">
                    Pinned groups stay synced to your account.
                  </p>
                </div>
              ) : favoriteGroupDetails.length > 0 ? (
                <p className="text-xs text-muted-foreground">
                  All available groups are currently pinned.
                </p>
              ) : null}
            </CardContent>
          </Card>

          <Card className="flex flex-1 flex-col min-h-[320px]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Trending Groups</CardTitle>
                <CardDescription>
                  Groups gaining the most engagement alongside recent additions.
                </CardDescription>
              </div>
              <TrendingUp className="hidden h-5 w-5 text-muted-foreground sm:block" />
            </CardHeader>
            <CardContent className="flex-1 space-y-4 pr-1">
              {momentumGroups.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <Users className="h-3.5 w-3.5" /> Top Cohorts
                  </div>
                  {momentumGroups.map((group, index) => (
                    <TrendingGroupItem
                      key={group.id}
                      group={group}
                      index={index}
                      averageMembers={Math.max(groupStats.averageSize, 1)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Add members to your groups to surface engagement trends.
                </p>
              )}

              <div className="space-y-2 border-t border-dashed border-border pt-3">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> Recently Added
                </div>
                {recentGroups.length > 0 ? (
                  recentGroups.map(group => (
                    <Link
                      key={group.id}
                      to={`/groups/${group.id}`}
                      className="flex items-center justify-between rounded-lg border border-border/60 bg-background/70 p-3 text-sm transition-colors hover:border-primary/50 hover:text-primary"
                    >
                      <span className="font-medium">{group.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(group.created_at).toLocaleDateString()}
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Newly created groups will appear here.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
