import { useState } from 'react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Loader2 } from 'lucide-react';
import { useActivities } from '@/logic/useActivity'; // ✨ Import hook
import { getActivityIcon, formatActivityDetails } from '@/logic/activityHelper'; // ✨ Import helpers
import type { ActivityLogEntry } from '@/types/types';

const PAGE_SIZE = 10;

const ActivityLogPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  // The hook is now imported and used cleanly here.
  const { activities, loading, error, totalCount, formatTimeAgo } =
    useActivities({ page: currentPage, pageSize: PAGE_SIZE });

  const totalPages = totalCount ? Math.ceil(totalCount / PAGE_SIZE) : 1;
  const firstItem = totalCount > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const lastItem = Math.min(currentPage * PAGE_SIZE, totalCount);

  const renderTableBody = () => {
    if (loading)
      return (
        <TableRow>
          <TableCell colSpan={3} className="h-24 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          </TableCell>
        </TableRow>
      );
    if (error)
      return (
        <TableRow>
          <TableCell colSpan={3} className="h-24 text-center text-destructive">
            Error: {error}
          </TableCell>
        </TableRow>
      );
    if (activities.length === 0)
      return (
        <TableRow>
          <TableCell
            colSpan={3}
            className="h-24 text-center text-muted-foreground"
          >
            No activity has been logged yet.
          </TableCell>
        </TableRow>
      );

    return activities.map((activity: ActivityLogEntry) => (
      <TableRow key={activity.id}>
        <TableCell className="font-medium">
          <div className="flex items-center gap-3">
            {/* The helper functions are now imported and used cleanly here. */}
            {getActivityIcon(activity.action)}
            <span className="capitalize">
              {activity.action?.replace(/_/g, ' ').toLowerCase() || 'Unknown'}
            </span>
          </div>
        </TableCell>
        <TableCell className="text-muted-foreground">
          {formatActivityDetails(activity)}
        </TableCell>
        <TableCell className="text-right text-muted-foreground">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="cursor-help text-xs">
                {formatTimeAgo(activity.created_at)}
              </TooltipTrigger>
              <TooltipContent>
                <p>{format(new Date(activity.created_at), 'PPP p')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Activity Log
        </h1>
        <p className="text-muted-foreground">
          A detailed log of all recent activities in your account.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
          <CardDescription>
            {totalCount > 0
              ? `Showing activities ${firstItem} - ${lastItem} of ${totalCount}.`
              : 'No activities to display.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Action</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right w-[120px]">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderTableBody()}</TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <Pagination className="mx-0 w-fit">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    setCurrentPage(p => p - 1);
                  }}
                  className={
                    currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                  }
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    setCurrentPage(p => p + 1);
                  }}
                  className={
                    currentPage >= totalPages
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ActivityLogPage;
