import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Tags,
} from 'lucide-react';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { getTagsDataForChart } from '@/services/tags';
import type { ChartData } from '@/types/types';

const WIDGET_PAGE_SIZE = 4;

export const TagsDistributionWidget = () => {
  const [allTags, setAllTags] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTagsDataForChart();
        const normalized = data.map(tag => ({
          ...tag,
          contacts: tag.contacts.map(
            (contact: ChartData['contacts'][number]) => ({
              id: contact.id,
              avatar_url: contact.avatar_url ?? null,
            }),
          ),
        }));
        setAllTags(normalized);
      } catch (err) {
        setError('Failed to load tag data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(allTags.length / WIDGET_PAGE_SIZE);
  const paginatedTags = allTags.slice(
    (currentPage - 1) * WIDGET_PAGE_SIZE,
    currentPage * WIDGET_PAGE_SIZE,
  );
  const maxCount = Math.max(...allTags.map(tag => tag.value), 0);

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
    if (allTags.length === 0) {
      return (
        <div className="flex h-[280px] flex-col items-center justify-center text-center">
          <Tags className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="font-medium">No Tags Found</p>
          <p className="text-sm text-muted-foreground">
            Assign contacts to tags to see them here.
          </p>
        </div>
      );
    }
    return (
      <ul className="space-y-5">
        {paginatedTags.map(tag => (
          <li key={tag.id}>
            <div className="flex justify-between items-center mb-2">
              {/* Tag Icon and Name */}
              <div className="flex items-center gap-3">
                <span
                  className="h-9 w-9 rounded-md border p-1 flex items-center justify-center"
                  style={{ backgroundColor: tag.color }}
                  title={tag.name}
                >
                  <Tags className="h-5 w-5 text-white" />
                </span>
                <span
                  className="text-sm font-bold text-foreground truncate"
                  title={tag.name}
                >
                  {tag.name}
                </span>
              </div>

              {/* Avatar Stack and Total Count Badge */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-3">
                  <TooltipProvider>
                    <div className="flex -space-x-3">
                      {tag.contacts.slice(0, 3).map(contact => (
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
                    </div>
                  </TooltipProvider>
                </div>
                <Badge variant="secondary" className="font-semibold">
                  {tag.value}
                </Badge>
              </div>
            </div>
            {/* Proportional Bar Chart */}
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary/80"
                style={{
                  width: `${maxCount > 0 ? (tag.value / maxCount) * 100 : 0}%`,
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
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Tags className="h-5 w-5 text-muted-foreground" />
            Tags Distribution
          </CardTitle>
        </div>
        <CardDescription>
          How your contacts are distributed across all tags.
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
        {/* View All Tags Button */}
        <Button variant="link" size="sm" className="p-0 text-sm" asChild>
          <Link to="/tags">
            View All Tags <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
