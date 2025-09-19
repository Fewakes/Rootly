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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useDialog } from '@/contexts/DialogContext';
import { useAllCompanies } from '@/logic/useAllCompanies';
import { useFavoriteCompanies } from '@/logic/useFavoriteCompanies';

import {
  Briefcase,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
  TrendingUp,
  Pin,
  X,
  Clock,
} from 'lucide-react';
import type { CompanyWithContacts } from '@/types/types';
import { CompanyListItem } from '@/features/companies/CompanyListItem';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const numberFormatter = new Intl.NumberFormat('en-US');
const DEFAULT_ITEMS_PER_PAGE = 10;

type InsightStatProps = {
  label: string;
  value: string;
  helper?: string;
};

const InsightStat = ({ label, value, helper }: InsightStatProps) => (
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

const TrendingCompanyItem = ({
  company,
  index,
  averageRoster,
}: {
  company: CompanyWithContacts;
  index: number;
  averageRoster: number;
}) => {
  const delta = company.contact_count - averageRoster;
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
      to={`/companies/${company.id}`}
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
          {index < 3 ? index + 1 : <Briefcase className="h-4 w-4" />}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {company.name}
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>
              {numberFormatter.format(company.contact_count)} linked contacts
            </span>
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

const RecentCompanyRow = ({ company }: { company: CompanyWithContacts }) => (
  <Link
    to={`/companies/${company.id}`}
    className="flex items-center justify-between rounded-lg border border-border/60 bg-background/70 p-3 text-sm transition-colors hover:border-primary/50 hover:text-primary"
  >
    <span className="font-medium">{company.name}</span>
    <span className="text-xs text-muted-foreground">
      {new Date(company.created_at).toLocaleDateString()}
    </span>
  </Link>
);

export default function Companies() {
  const { openDialog } = useDialog();
  const { companies, loading, error } = useAllCompanies();
  const {
    favoriteCompanyIds,
    loading: favouriteCompaniesLoading,
    mutating: favouriteCompaniesMutating,
    addFavoriteCompany,
    removeFavoriteCompany,
  } = useFavoriteCompanies();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

  const companyStats = useMemo(() => {
    if (!Array.isArray(companies) || companies.length === 0) {
      return {
        totalCompanies: 0,
        totalContacts: 0,
        averageRoster: 0,
        activeCompanies: 0,
        dormantCompanies: 0,
        newThisMonth: 0,
        topAccounts: [] as CompanyWithContacts[],
        recentCompanies: [] as CompanyWithContacts[],
      };
    }

    const totalCompanies = companies.length;
    const totalContacts = companies.reduce(
      (acc, company) => acc + (company.contact_count ?? 0),
      0,
    );
    const averageRoster = Math.round(
      totalContacts / Math.max(totalCompanies, 1),
    );
    const activeCompanies = companies.filter(c => c.contact_count > 0).length;
    const dormantCompanies = totalCompanies - activeCompanies;
    const coverage =
      totalCompanies === 0
        ? 0
        : Math.round((activeCompanies / totalCompanies) * 100);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newThisMonth = companies.filter(
      company => new Date(company.created_at) >= thirtyDaysAgo,
    ).length;

    const sortedByContacts = [...companies].sort(
      (a, b) => b.contact_count - a.contact_count,
    );
    const topAccounts = sortedByContacts.slice(0, 3);

    const recentCompanies = [...companies]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 4);

    return {
      totalCompanies,
      totalContacts,
      averageRoster,
      activeCompanies,
      dormantCompanies,
      coverage,
      newThisMonth,
      topAccounts,
      recentCompanies,
    };
  }, [companies]);

  const favoriteCompanyDetails = useMemo(() => {
    if (!Array.isArray(companies) || favoriteCompanyIds.length === 0)
      return [] as CompanyWithContacts[];
    return favoriteCompanyIds
      .map(id => companies.find(company => company.id === id))
      .filter((company): company is CompanyWithContacts => Boolean(company));
  }, [companies, favoriteCompanyIds]);

  const availableCompaniesToPin = useMemo(() => {
    if (!Array.isArray(companies)) return [] as CompanyWithContacts[];
    return companies.filter(
      company => !favoriteCompanyIds.includes(company.id),
    );
  }, [companies, favoriteCompanyIds]);

  const filteredAndSortedCompanies = useMemo(() => {
    if (!Array.isArray(companies)) return [] as CompanyWithContacts[];

    let result = companies.filter(company =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
  }, [companies, searchTerm, sortBy]);

  const paginatedCompanies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedCompanies.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage, filteredAndSortedCompanies]);

  const totalPages = Math.ceil(
    filteredAndSortedCompanies.length / itemsPerPage,
  );
  const shouldScrollCompanyList = itemsPerPage > DEFAULT_ITEMS_PER_PAGE;

  const renderContent = () => {
    if (loading)
      return (
        <p className="col-span-full py-10 text-center text-muted-foreground">
          Loading companies...
        </p>
      );
    if (error)
      return (
        <p className="col-span-full py-10 text-center text-destructive">
          Error: {error}
        </p>
      );

    if (paginatedCompanies.length === 0)
      return (
        <p className="col-span-full py-10 text-center text-muted-foreground">
          No companies found. Adjust filters to explore more accounts.
        </p>
      );

    return paginatedCompanies.map(company => (
      <CompanyListItem key={company.id} company={company} />
    ));
  };

  const handlePinCompany = (id: string) => {
    if (!id || favouriteCompaniesLoading || favouriteCompaniesMutating) return;
    addFavoriteCompany(id);
  };

  const handleUnpinCompany = (id: string) => {
    if (favouriteCompaniesMutating) return;
    removeFavoriteCompany(id);
  };

  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      <Card className="overflow-hidden border-border/80 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" /> Company Intelligence
            </div>
            <CardTitle className="text-3xl font-bold text-foreground">
              Understand and prioritise your company relationships
            </CardTitle>
            <CardDescription className="max-w-2xl text-base">
              Measure portfolio health, track key accounts, and surface the next
              conversations worth having.
            </CardDescription>
          </div>
          <Button
            size="lg"
            onClick={() => openDialog('addCompany')}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <Briefcase className="mr-2 h-5 w-5" /> Add Company
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InsightStat
            label="Total Companies"
            value={numberFormatter.format(companyStats.totalCompanies)}
            helper={`${numberFormatter.format(companyStats.activeCompanies)} active`}
          />
          <InsightStat
            label="Contacts Linked"
            value={numberFormatter.format(companyStats.totalContacts)}
            helper={`Avg ${numberFormatter.format(companyStats.averageRoster)} per company`}
          />
          <InsightStat
            label="Active Coverage"
            value={`${companyStats.coverage}%`}
            helper={`${numberFormatter.format(companyStats.activeCompanies)} active · ${numberFormatter.format(companyStats.dormantCompanies)} idle`}
          />
          <InsightStat
            label="New This Month"
            value={numberFormatter.format(companyStats.newThisMonth)}
            helper={
              companyStats.newThisMonth > 0 && companyStats.recentCompanies[0]
                ? `Latest: ${companyStats.recentCompanies[0].name}`
                : 'No companies created in the last 30 days'
            }
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] xl:items-stretch">
        <Card
          className="flex h-full flex-col"
          style={shouldScrollCompanyList ? { maxHeight: '960px' } : undefined}
        >
          <CardHeader className="border-b">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Company Directory</CardTitle>
                  <CardDescription>
                    Search and organise accounts with tailored ordering options.
                  </CardDescription>
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="relative w-full lg:max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search companies by name..."
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
                shouldScrollCompanyList && 'overflow-y-auto',
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
          style={shouldScrollCompanyList ? { maxHeight: '960px' } : undefined}
        >
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pinned Companies</CardTitle>
                <CardDescription>
                  Keep your go-to companies handy for quick follow-up.
                </CardDescription>
              </div>
              <Pin className="hidden h-5 w-5 text-muted-foreground sm:block" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="space-y-3">
                {favouriteCompaniesLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div
                        key={`favorite-company-skeleton-${idx}`}
                        className="flex items-center justify-between rounded-lg border border-border bg-background/70 p-3"
                      >
                        <div className="flex flex-1 items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-lg" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    ))}
                  </div>
                ) : favoriteCompanyDetails.length > 0 ? (
                  favoriteCompanyDetails.map(company => (
                    <div
                      key={company.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-background/70 p-3"
                    >
                      <Link
                        to={`/companies/${company.id}`}
                        className="flex flex-1 items-center gap-3 text-foreground no-underline transition-colors hover:text-primary"
                      >
                        <Avatar className="h-10 w-10 border rounded-lg">
                          <AvatarImage
                            className="rounded-lg"
                            src={company.company_logo || undefined}
                            alt={company.name}
                          />
                          <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold">
                            {company.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold">
                            {company.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {numberFormatter.format(company.contact_count)}{' '}
                            linked contacts
                          </p>
                        </div>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleUnpinCompany(company.id)}
                        aria-label={`Unpin ${company.name}`}
                        disabled={favouriteCompaniesMutating}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    You haven't pinned any companies yet. Pin the accounts you
                    revisit most often.
                  </p>
                )}
              </div>

              {availableCompaniesToPin.length > 0 ? (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Select
                    key={favoriteCompanyIds.join('-') || 'empty'}
                    onValueChange={handlePinCompany}
                  >
                    <SelectTrigger
                      className="w-full sm:w-[220px]"
                      disabled={
                        favouriteCompaniesLoading || favouriteCompaniesMutating
                      }
                    >
                      <SelectValue placeholder="Pin another company" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCompaniesToPin.map(company => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground sm:ml-2">
                    Pinned companies stay synced to your account.
                  </p>
                </div>
              ) : favoriteCompanyDetails.length > 0 ? (
                <p className="text-xs text-muted-foreground">
                  All available companies are currently pinned.
                </p>
              ) : null}
            </CardContent>
          </Card>

          <Card className="flex flex-1 flex-col min-h-[320px]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Trending Companies</CardTitle>
                <CardDescription>
                  Companies gaining the most engagement alongside recent
                  additions.
                </CardDescription>
              </div>
              <TrendingUp className="hidden h-5 w-5 text-muted-foreground sm:block" />
            </CardHeader>
            <CardContent className="flex-1 space-y-4 pr-1">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Users className="h-3.5 w-3.5" /> Top Accounts
                </div>
                {companyStats.topAccounts.length > 0 ? (
                  companyStats.topAccounts.map((company, index) => (
                    <TrendingCompanyItem
                      key={company.id}
                      company={company}
                      index={index}
                      averageRoster={Math.max(companyStats.averageRoster, 1)}
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Link contacts to companies to surface top accounts.
                  </p>
                )}
              </div>

              <div className="space-y-2 border-dashed border-border border-t pt-3">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> Recently Added
                </div>
                {companyStats.recentCompanies.length > 0 ? (
                  companyStats.recentCompanies.map(company => (
                    <RecentCompanyRow key={company.id} company={company} />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Newly added companies will appear here.
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
