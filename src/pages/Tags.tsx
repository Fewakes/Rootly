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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

import { useDialog } from '@/contexts/DialogContext';
import { useAllTags } from '@/logic/useAllTags';

import {
  UserPlus,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Users,
  Tag as TagIcon,
  Gauge,
  PieChart,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { TagColor, TagWithContacts } from '@/types/types';
import { TAG_BG, TAG_BG_CLASSES, cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

import { TagListItem } from '@/features/tags/TagListItem';
import { useFavoriteTags } from '@/logic/useFavoriteTags';

type ColorFilter = 'all' | TagColor;
type PerformanceFilter = 'all' | 'high-impact' | 'growth' | 'untagged';

type InsightStatProps = {
  label: string;
  value: string;
  helper?: string;
  loading?: boolean;
  icon?: LucideIcon;
};

type TrendingTagItemProps = {
  tag: TagWithContacts;
  index: number;
  averageContacts: number;
};

const numberFormatter = Intl.NumberFormat('en-US');
const DEFAULT_ITEMS_PER_PAGE = 10;

const InsightStat = ({ label, value, helper, loading, icon: Icon }: InsightStatProps) => (
  <div className="rounded-lg border border-border bg-background/70 p-4 shadow-sm">
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
    </div>
    {loading ? (
      <Skeleton className="mt-3 h-7 w-20" />
    ) : (
      <div className="mt-3 flex items-baseline justify-end gap-2">
        <p className="text-2xl font-semibold text-foreground">{value}</p>
        {helper ? (
          <span className="text-sm italic text-muted-foreground whitespace-nowrap">
            {helper}
          </span>
        ) : null}
      </div>
    )}
  </div>
);

const TrendingTagSkeleton = () => (
  <div className="flex items-center justify-between rounded-lg border border-dashed border-border/80 p-3">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="flex-1 px-3">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-2 h-3 w-20" />
    </div>
    <Skeleton className="h-6 w-12 rounded-full" />
  </div>
);

const TrendingTagItem = ({
  tag,
  index,
  averageContacts,
}: TrendingTagItemProps) => {
  const hasColour = !!(tag.color && TAG_BG[tag.color as TagColor]);
  const iconClasses = cn(
    'flex h-10 w-10 items-center justify-center rounded-full shadow-sm',
    hasColour ? `${TAG_BG[tag.color as TagColor]} text-white` : 'bg-muted text-muted-foreground',
  );

  let deltaLabel = '';
  let deltaClass = 'text-muted-foreground';
  if (averageContacts > 0) {
    const delta = tag.contact_count - averageContacts;
    if (delta > 0) {
      deltaLabel = `↑ ${delta} above avg`;
      deltaClass = 'text-emerald-600';
    } else if (delta < 0) {
      deltaLabel = `↓ ${Math.abs(delta)} below avg`;
      deltaClass = 'text-amber-600';
    } else {
      deltaLabel = 'Matches avg engagement';
    }
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-background/70 p-3">
      <div className="flex items-center gap-3">
        <div className={iconClasses}>
          <TagIcon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{tag.name}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{numberFormatter.format(tag.contact_count)} contacts</span>
          </div>
          {deltaLabel ? (
            <p className={cn('mt-1 text-xs font-medium', deltaClass)}>{deltaLabel}</p>
          ) : null}
        </div>
      </div>
      <Badge variant="secondary">#{index + 1}</Badge>
    </div>
  );
};

export default function Tags() {
  const { openDialog } = useDialog();
  const { tags, loading, error } = useAllTags();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [performanceFilter, setPerformanceFilter] =
    useState<PerformanceFilter>('all');
  const [colorFilter, setColorFilter] = useState<ColorFilter>('all');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

  const {
    favoriteTagIds,
    loading: favouriteTagsLoading,
    mutating: favouriteTagsMutating,
    addFavoriteTag,
    removeFavoriteTag,
  } = useFavoriteTags();

  const tagStats = useMemo(() => {
    if (!Array.isArray(tags) || tags.length === 0) {
      return {
        totalTags: 0,
        totalContacts: 0,
        averageContacts: 0,
        activeTags: 0,
        inactiveTags: 0,
        coverage: 0,
        topTag: null as TagWithContacts | null,
      };
    }

    const totalTags = tags.length;
    const totalContacts = tags.reduce(
      (acc, tag) => acc + (tag.contact_count ?? 0),
      0,
    );
    const activeTags = tags.filter(tag => tag.contact_count > 0).length;
    const inactiveTags = totalTags - activeTags;
    const averageContacts = Math.round(totalContacts / totalTags);
    const coverage = Math.round((activeTags / totalTags) * 100);
    const topTag = tags.reduce<TagWithContacts | null>((prev, current) => {
      if (!prev) return current;
      if (current.contact_count > prev.contact_count) return current;
      if (
        current.contact_count === prev.contact_count &&
        new Date(current.created_at).getTime() > new Date(prev.created_at).getTime()
      ) {
        return current;
      }
      return prev;
    }, null);

    return {
      totalTags,
      totalContacts,
      averageContacts,
      activeTags,
      inactiveTags,
      coverage,
      topTag,
    };
  }, [tags]);

  const colorOptions = useMemo(() => {
    if (!Array.isArray(tags)) return [] as TagColor[];
    const unique = new Set<TagColor>();
    tags.forEach(tag => {
      if (tag.color && TAG_BG[tag.color as TagColor]) {
        unique.add(tag.color as TagColor);
      }
    });
    return Array.from(unique);
  }, [tags]);

  const trendingTags = useMemo(() => {
    if (!Array.isArray(tags)) return [] as TagWithContacts[];
    return [...tags]
      .filter(tag => tag.contact_count > 0)
      .sort((a, b) => {
        if (b.contact_count !== a.contact_count) {
          return b.contact_count - a.contact_count;
        }
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      })
      .slice(0, 5);
  }, [tags]);

  const filteredAndSortedTags = useMemo(() => {
    if (!Array.isArray(tags)) {
      return [] as TagWithContacts[];
    }

    let result = [...tags];

    if (searchTerm) {
      result = result.filter(tag =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (colorFilter !== 'all') {
      result = result.filter(tag => tag.color === colorFilter);
    }

    if (performanceFilter !== 'all') {
      const average = Math.max(tagStats.averageContacts, 1);
      if (performanceFilter === 'high-impact') {
        result = result.filter(tag => tag.contact_count >= average);
      } else if (performanceFilter === 'growth') {
        result = result.filter(
          tag => tag.contact_count > 0 && tag.contact_count < average,
        );
      } else if (performanceFilter === 'untagged') {
        result = result.filter(tag => tag.contact_count === 0);
      }
    }

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
  }, [
    tags,
    searchTerm,
    sortBy,
    performanceFilter,
    colorFilter,
    tagStats.averageContacts,
  ]);

  const paginatedTags = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedTags.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage, filteredAndSortedTags]);

  const totalPages = Math.ceil(filteredAndSortedTags.length / itemsPerPage);
  const shouldScrollTagList = itemsPerPage > DEFAULT_ITEMS_PER_PAGE;

  const favoriteTagDetails = useMemo(() => {
    if (!Array.isArray(tags) || favoriteTagIds.length === 0)
      return [] as TagWithContacts[];
    return favoriteTagIds
      .map(id => tags.find(tag => tag.id === id))
      .filter((tag): tag is TagWithContacts => Boolean(tag));
  }, [favoriteTagIds, tags]);

  const availableTagsToPin = useMemo(() => {
    if (!Array.isArray(tags)) return [] as TagWithContacts[];
    return tags.filter(tag => !favoriteTagIds.includes(tag.id));
  }, [tags, favoriteTagIds]);

  const renderContent = () => {
    if (loading)
      return (
        <p className="col-span-full py-10 text-center text-muted-foreground">
          Loading tags...
        </p>
      );
    if (error)
      return (
        <p className="col-span-full py-10 text-center text-destructive">
          Error: {error}
        </p>
      );

    if (paginatedTags.length === 0)
      return (
        <p className="col-span-full py-10 text-center text-muted-foreground">
          No tags found. Adjust your filters to discover more opportunities.
        </p>
      );

    return paginatedTags.map(tag => <TagListItem key={tag.id} tag={tag} />);
  };

  const handlePinTag = (id: string) => {
    addFavoriteTag(id);
  };

  const handleUnpinTag = (id: string) => {
    removeFavoriteTag(id);
  };

  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      <Card className="overflow-hidden border-border/80 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Tag Intelligence
            </div>
            <CardTitle className="text-3xl font-bold text-foreground">
              Visualise how your contacts are organised
            </CardTitle>
            <CardDescription className="max-w-2xl text-base">
              Discover high-impact tags and fine-tune your taxonomy with intelligent
              filtering.
            </CardDescription>
          </div>
          <Button
            size="lg"
            onClick={() => openDialog('addTag')}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <UserPlus className="mr-2 h-5 w-5" /> Add New Tag
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InsightStat
            label="Total Tags"
            value={numberFormatter.format(tagStats.totalTags)}
            helper="Active taxonomy entries"
            loading={loading}
            icon={TagIcon}
          />
          <InsightStat
            label="Tagged Contacts"
            value={numberFormatter.format(tagStats.totalContacts)}
            helper="Contacts linked to at least one tag"
            loading={loading}
            icon={Users}
          />
          <InsightStat
            label="Avg Contacts per Tag"
            value={numberFormatter.format(tagStats.averageContacts)}
            helper="Balanced distribution target"
            loading={loading}
            icon={Gauge}
          />
          <InsightStat
            label="Active Coverage"
            value={`${tagStats.coverage}%`}
            helper={`${tagStats.activeTags} active · ${tagStats.inactiveTags} idle`}
            loading={loading}
            icon={PieChart}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] xl:items-stretch">
        <Card
          className={cn(
            'flex h-full flex-col',
            shouldScrollTagList && 'xl:max-h-[820px]'
          )}
        >
          <CardHeader className="border-b">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Tag Library</CardTitle>
                  <CardDescription>
                    Refine your taxonomy with search, performance views, and color filters.
                  </CardDescription>
                </div>
              </div>

              <Tabs
                value={performanceFilter}
                onValueChange={value => {
                  setPerformanceFilter(value as PerformanceFilter);
                  setCurrentPage(1);
                }}
              >
                <TabsList>
                  <TabsTrigger value="all">All Tags</TabsTrigger>
                  <TabsTrigger value="high-impact">High Impact</TabsTrigger>
                  <TabsTrigger value="growth">Growth Opportunity</TabsTrigger>
                  <TabsTrigger value="untagged">Unassigned</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search tags by name..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={e => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>

                <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <Select
                    value={colorFilter}
                    onValueChange={value => {
                      setColorFilter(value as ColorFilter);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="All colors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All colors</SelectItem>
                      {colorOptions.map(color => (
                        <SelectItem key={color} value={color}>
                          <span className="flex items-center gap-2">
                            <span
                              className={cn(
                                'h-2.5 w-2.5 rounded-full',
                                TAG_BG_CLASSES[color] ?? 'bg-muted',
                              )}
                            />
                            {color.charAt(0).toUpperCase() + color.slice(1)}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={sortBy}
                    onValueChange={value => {
                      setSortBy(value);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                      <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                      <SelectItem value="created_at-desc">Newest First</SelectItem>
                      <SelectItem value="created_at-asc">Oldest First</SelectItem>
                      <SelectItem value="contact_count-desc">
                        Most Contacts
                      </SelectItem>
                      <SelectItem value="contact_count-asc">
                        Fewest Contacts
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
                shouldScrollTagList && 'overflow-y-auto',
              )}
            >
              <div className="divide-y divide-border">{renderContent()}</div>
            </div>
          </CardContent>

          {totalPages > 1 && (
            <CardFooter className="mt-auto flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page</span>
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
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
          className={cn(
            'flex h-full flex-col gap-6',
            shouldScrollTagList && 'xl:max-h-[820px]'
          )}
        >
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Favourite Tags</CardTitle>
              <CardDescription>
                Pin the categories you reach for most to keep them front of mind.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="space-y-3">
                {favouriteTagsLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div
                        key={`favorite-tag-skeleton-${idx}`}
                        className="flex items-center justify-between rounded-lg border border-border bg-background/70 p-3"
                      >
                        <div className="flex flex-1 items-center gap-3">
                          <Skeleton className="h-2.5 w-2.5 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    ))}
                  </div>
                ) : favoriteTagDetails.length > 0 ? (
                  favoriteTagDetails.map(tag => (
                    <div
                      key={tag.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-background/70 p-3"
                    >
                      <Link
                        to={`/tags/${tag.id}`}
                        className="flex flex-1 items-center gap-3 text-foreground no-underline transition-colors hover:text-primary"
                      >
                        <span
                          className={cn(
                            'h-2.5 w-2.5 rounded-full',
                            tag.color && TAG_BG_CLASSES[tag.color as TagColor]
                              ? TAG_BG_CLASSES[tag.color as TagColor]
                              : 'bg-muted'
                          )}
                        />
                        <div>
                          <p className="text-sm font-semibold">{tag.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {numberFormatter.format(tag.contact_count)} linked contacts
                          </p>
                        </div>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleUnpinTag(tag.id)}
                        aria-label={`Unpin ${tag.name}`}
                        disabled={favouriteTagsMutating}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    You haven't pinned any favourites yet. Save the tags you rely on most to
                    access them quickly.
                  </p>
                )}
              </div>

              {availableTagsToPin.length > 0 ? (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Select
                    key={favoriteTagIds.join('-') || 'empty'}
                    onValueChange={handlePinTag}
                  >
                    <SelectTrigger
                      className="w-full sm:w-[220px]"
                      disabled={favouriteTagsLoading || favouriteTagsMutating}
                    >
                      <SelectValue placeholder="Pin another tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTagsToPin.map(tag => (
                        <SelectItem key={tag.id} value={tag.id}>
                          {tag.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground sm:ml-2">
                    Favourite tags stay synced to your account.
                  </p>
                </div>
              ) : favoriteTagDetails.length > 0 ? (
                <p className="text-xs text-muted-foreground">
                  All available tags are currently pinned.
                </p>
              ) : null}
            </CardContent>
          </Card>

          <Card className="flex flex-1 flex-col min-h-[320px]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Top Trending Tags</CardTitle>
                <CardDescription>
                  Tags with the strongest contact engagement this period.
                </CardDescription>
              </div>
              <TrendingUp className="hidden h-5 w-5 text-muted-foreground sm:block" />
            </CardHeader>
            <CardContent className="flex-1 space-y-3 pr-1">
              {loading ? (
                <>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TrendingTagSkeleton key={`trending-skeleton-${index}`} />
                  ))}
                </>
              ) : trendingTags.length > 0 ? (
                trendingTags.map((tag, index) => (
                  <TrendingTagItem
                    key={tag.id}
                    tag={tag}
                    index={index}
                    averageContacts={tagStats.averageContacts}
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Assign tags to contacts to surface trending insights.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
