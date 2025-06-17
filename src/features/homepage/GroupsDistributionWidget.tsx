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
  BarChartHorizontal,
  ArrowRight,
  Users,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { getAllGroupsWithContactCounts } from '@/services/groups';

type ChartData = {
  id: string;
  name: string;
  value: number;
};

const WIDGET_PAGE_SIZE = 5;

export const GroupsDistributionWidget = () => {
  const [allGroups, setAllGroups] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllGroupsWithContactCounts();
        const sortedData = data.sort((a, b) => b.value - a.value);
        setAllGroups(sortedData);
      } catch (err) {
        setError('Failed to load chart data.');
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
  const maxCount = Math.max(...paginatedGroups.map(group => group.value), 0);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex h-48 items-center justify-center text-destructive">
          {error}
        </div>
      );
    }
    if (allGroups.length === 0) {
      return (
        <div className="flex h-48 flex-col items-center justify-center text-center">
          <Users className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="font-medium">No Groups Found</p>
          <p className="text-sm text-muted-foreground">
            Create a group to see it here.
          </p>
        </div>
      );
    }
    return (
      <ul className="space-y-4">
        {paginatedGroups.map(group => (
          <li key={group.id}>
            <div className="flex justify-between items-center mb-1">
              <span
                className="text-sm font-medium text-foreground truncate"
                title={group.name}
              >
                {group.name}
              </span>
              <span className="text-sm font-semibold text-foreground">
                {group.value}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
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
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChartHorizontal className="h-5 w-5 text-muted-foreground" />
          Groups Distribution
        </CardTitle>
        <CardDescription>
          How your contacts are distributed across all groups.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[240px]">{renderContent()}</CardContent>

      <CardFooter className="flex justify-between items-center border-t px-4">
        <div className="flex items-center gap-2">
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
        </div>
        <Button variant="link" size="sm" className="p-0 text-sm" asChild>
          <Link to="/groups">
            View All Groups <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
