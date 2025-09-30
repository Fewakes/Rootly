import { useMemo } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ArrowRight,
  Building2,
  CalendarDays,
  ShieldCheck,
  Users2,
} from 'lucide-react';

import type { CompanyWithRank } from '@/types/types';

type CompanyProfileCardProps = {
  company: CompanyWithRank;
  assignedCount: number;
  eligibleCount: number;
  onEdit: () => void;
  onDelete: () => Promise<void> | void;
  isDeleting?: boolean;
  onScrollToContacts?: () => void;
};

export function CompanyProfileCard({
  company,
  assignedCount,
  eligibleCount,
  onEdit,
  onDelete,
  isDeleting = false,
  onScrollToContacts,
}: CompanyProfileCardProps) {
  const createdAt = useMemo(() => {
    const parsed = new Date(company.created_at);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, [company.created_at]);

  const createdLabel = createdAt
    ? format(createdAt, 'MMMM d, yyyy')
    : 'Not available';

  const description = company.description?.trim();

  const initials = useMemo(() => {
    if (!company.name) return 'C';
    const parts = company.name.split(' ');
    const letters = parts
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
    return letters || 'C';
  }, [company.name]);

  return (
    <Card className="h-full">
      <CardHeader className="pb-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-start gap-4">
            <Avatar className="h-14 w-14 border shadow-sm">
              {company.company_logo ? (
                <AvatarImage src={company.company_logo} alt={company.name} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-xl font-semibold text-foreground">
                  {company.name}
                </CardTitle>
                {company.rank ? (
                  <Badge variant="secondary" className="text-xs font-medium">
                    #{company.rank} Ranked
                  </Badge>
                ) : null}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 font-medium uppercase tracking-wide">
                  <ShieldCheck className="h-3.5 w-3.5" /> Company Profile
                </span>
                <span className="text-muted-foreground/80">Created {createdLabel}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {description ||
                  'Add a concise summary so teammates know how to partner with this company.'}
              </p>
            </div>
          </div>
          <div className="flex flex-none items-center gap-2">
            <Button size="sm" onClick={onEdit}>
              Edit Company
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={onDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Removing…' : 'Delete'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Users2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Assignments
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {assignedCount} assigned · {eligibleCount} available
                </p>
              </div>
            </div>
            {onScrollToContacts ? (
              <Button size="sm" onClick={onScrollToContacts}>
                Manage contacts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : null}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Everyone linked to this company appears just below. Use
            <strong className="mx-1 font-semibold">Add contacts</strong> to bring
            more teammates into the relationship.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-lg border px-3 py-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Created
              </p>
              <p className="text-sm font-medium text-foreground">{createdLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border px-3 py-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Active Contacts
              </p>
              <p className="text-sm font-medium text-foreground">{assignedCount}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
