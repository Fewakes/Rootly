import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Loader2,
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { getAllGroupsWithContactCounts } from '@/services/groups';
import { getInitials } from '@/lib/utils';

// Type definition for group data
type ChartData = {
  id: string;
  name: string;
  value: number;
  contacts: {
    id: string;
    avatar_url: string | null;
  }[];
};

const WIDGET_PAGE_SIZE = 4;

export const GroupsDistributionWidget = () => {
  const [allGroups, setAllGroups] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllGroupsWithContactCounts();
        setAllGroups(data);
      } catch (err) {
        setError('Failed to load group data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(allGroups.length / WIDGET_PAGE_SIZE);
  const paginatedGroups = allGroups.slice(
    (currentPage - 1) * WIDGET_PAGE_SIZE,
    currentPage * WIDGET_PAGE_SIZE,
  );
  const maxCount = Math.max(...allGroups.map(group => group.value), 0);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex h-[280px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex h-[280px] items-center justify-center text-destructive">
          {error}
        </div>
      );
    }
    if (allGroups.length === 0) {
      return (
        <div className="flex h-[280px] flex-col items-center justify-center text-center">
          <Users className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="font-medium">No Groups Found</p>
          <p className="text-sm text-muted-foreground">
            Create a group to see it here.
          </p>
        </div>
      );
    }
    return (
      <ul className="space-y-5">
        {paginatedGroups.map(group => (
          <li key={group.id}>
            <div className="flex justify-between items-center mb-2">
              {/* Group Logo and Name */}
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-md border p-1 flex items-center justify-center bg-gray-200 text-gray-800 font-bold text-xs flex-shrink-0">
                  {getInitials(group.name)}
                </div>
                <span
                  className="text-sm font-bold text-foreground truncate"
                  title={group.name}
                >
                  {group.name}
                </span>
              </div>
              {/* Avatar Stack and Total Count Badge */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-3">
                  <TooltipProvider>
                    {group.contacts &&
                      group.contacts.slice(0, 3).map(contact => (
                        <Tooltip key={contact.id} delayDuration={100}>
                          <TooltipTrigger asChild>
                            <img
                              src={
                                contact.avatar_url ||
                                'https://placehold.co/100x100/F0F0F0/000000?text=NA'
                              }
                              onError={e => {
                                e.currentTarget.src =
                                  'https://placehold.co/100x100/F0F0F0/000000?text=NA';
                              }}
                              alt="contact avatar"
                              className="h-7 w-7 rounded-full object-cover ring-2 ring-background"
                            />
                          </TooltipTrigger>
                        </Tooltip>
                      ))}
                  </TooltipProvider>
                </div>
                <Badge variant="secondary" className="font-semibold">
                  {group.value}
                </Badge>
              </div>
            </div>
            {/* Proportional Bar Chart */}
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary/80"
                style={{
                  width: `${maxCount > 0 ? (group.value / maxCount) * 100 : 0}%`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card>
      {/* Card Header Section */}
      <CardHeader className="">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          Groups Distribution
        </CardTitle>
        <CardDescription>
          How your contacts are distributed across all groups.
        </CardDescription>
      </CardHeader>

      {/* Card Content Section */}
      <CardContent className="min-h-[300px]">{renderContent()}</CardContent>

      {/* Card Footer Section */}
      <CardFooter className="flex justify-end border-t px-6">
        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          {totalPages > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
        {/* View All Groups Button */}
        <Button
          variant="link"
          size="sm"
          className="p-0 text-sm text-primary"
          asChild
        >
          <Link to="/groups">
            View All Groups <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
