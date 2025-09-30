import { useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts';
import {
  Users2,
  ListChecks,
  CheckCircle2,
  NotebookPen,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Task } from '@/types/types';

const CHART_COLORS = ['#005df4', '#a1a1aa'];

type AtAGlanceProps = {
  isLoading: boolean;
  assignedCount: number;
  eligibleCount: number;
  openTaskCount: number;
  dueSoonCount: number;
  completedTaskCount: number;
  notesCount: number;
  lastActivityDate: Date | null;
  tasks: Task[];
};

type SummaryMetric = {
  key: string;
  title: string;
  value: number;
  subtext: string;
  accentClass: string;
  Icon: LucideIcon;
};

export function AtAGlance({
  isLoading,
  assignedCount,
  eligibleCount,
  openTaskCount,
  dueSoonCount,
  completedTaskCount,
  notesCount,
  lastActivityDate,
  tasks,
}: AtAGlanceProps) {
  const taskStatusData = useMemo(() => {
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.length - completed;
    return [
      { name: 'Completed', value: completed },
      { name: 'Pending', value: pending },
    ];
  }, [tasks]);

  const totalTasks = taskStatusData.reduce((sum, item) => sum + item.value, 0);
  const completedTasks = taskStatusData[0]?.value ?? 0;
  const pendingTasks = taskStatusData[1]?.value ?? 0;
  const lastActivityText = lastActivityDate
    ? `Updated ${formatDistanceToNow(lastActivityDate, { addSuffix: true })}`
    : 'No notes or tasks yet';

  const metrics = useMemo<SummaryMetric[]>(() => {
    const total = openTaskCount + completedTaskCount;
    const completionRate = total
      ? Math.round((completedTaskCount / total) * 100)
      : 0;

    return [
      {
        key: 'assigned',
        title: 'Assigned Contacts',
        value: assignedCount,
        subtext:
          eligibleCount > 0
            ? `${eligibleCount} contacts available to assign`
            : assignedCount > 0
              ? 'All eligible contacts are already assigned'
              : 'No contacts assigned yet',
        accentClass: 'bg-sky-100 text-sky-700 border-sky-200',
        Icon: Users2,
      },
      {
        key: 'openTasks',
        title: 'Open Tasks',
        value: openTaskCount,
        subtext:
          openTaskCount > 0
            ? dueSoonCount > 0
              ? `${dueSoonCount} due within 7 days`
              : 'No upcoming deadlines'
            : 'No open tasks remaining',
        accentClass: 'bg-amber-100 text-amber-700 border-amber-200',
        Icon: ListChecks,
      },
      {
        key: 'completedTasks',
        title: 'Completed Tasks',
        value: completedTaskCount,
        subtext: total
          ? `${completionRate}% of tasks completed`
          : 'Track tasks to measure progress',
        accentClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        Icon: CheckCircle2,
      },
      {
        key: 'notes',
        title: 'Notes Logged',
        value: notesCount,
        subtext: lastActivityText,
        accentClass: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        Icon: NotebookPen,
      },
    ];
  }, [
    assignedCount,
    eligibleCount,
    openTaskCount,
    dueSoonCount,
    completedTaskCount,
    notesCount,
    lastActivityText,
  ]);

  return (
    <Card className="h-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg font-semibold">At a Glance</CardTitle>
        <p className="text-sm text-muted-foreground">
          Pulse-check engagement, workload, and notes for this entity.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {metrics.map(({ key, title, value, subtext, accentClass, Icon }) => (
            <div key={key} className="rounded-lg border border-border/70 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {title}
                  </p>
                  <div className="mt-2 text-3xl font-semibold text-foreground">
                    {isLoading ? <Skeleton className="h-8 w-16" /> : value}
                  </div>
                </div>
                <div
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-full border',
                    accentClass,
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                {isLoading ? <Skeleton className="h-3 w-32" /> : subtext}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h4 className="text-sm font-semibold text-foreground">Task status</h4>
            <span className="text-xs text-muted-foreground">
              {totalTasks > 0
                ? `${completedTasks} completed · ${pendingTasks} open`
                : 'No tasks logged yet'}
            </span>
          </div>
          {totalTasks > 0 ? (
            <>
              <div className="h-32 -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={32}
                      outerRadius={52}
                      paddingAngle={4}
                    >
                      {taskStatusData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      cursor={{ fill: 'hsl(var(--muted))' }}
                      contentStyle={{
                        background: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 text-xs">
                {taskStatusData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: CHART_COLORS[index] }}
                    />
                    <span>
                      {entry.name} ({entry.value})
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-muted/30 p-6 text-center text-sm text-muted-foreground">
              <span className="font-medium text-foreground">No activity yet</span>
              <span>
                Create a task to see distribution and track how this entity is
                progressing.
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
