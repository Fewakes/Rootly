import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useActivities } from '@/logic/useActivity';
import { getActivityIcon, formatActivityDetails } from '@/logic/activityHelper';
import { ArrowRight, Loader2, ListTodo } from 'lucide-react';
import { format } from 'date-fns';

const ActivityFeed = ({ limit = 5 }: { limit?: number }) => {
  const { activities, loading, error, formatTimeAgo } = useActivities({
    limit,
  });

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex h-48 items-center justify-center p-4 text-center text-sm text-destructive">
          Failed to load activities.
        </div>
      );
    }
    if (activities.length === 0) {
      return (
        <div className="flex h-[320px] flex-col items-center justify-center text-center">
          <ListTodo className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="font-medium">No Recent Activity</p>
          <p className="text-sm text-muted-foreground">
            Actions you take will appear here.
          </p>
        </div>
      );
    }

    return (
      <Table>
        <TableBody>
          {activities.map(activity => (
            <TableRow key={activity.id}>
              {/* Cell 1: Icon and Action Name */}
              <TableCell className="w-[180px] font-medium py-2.5 pl-4">
                <div className="flex items-center gap-3">
                  {getActivityIcon(activity.action)}

                  <span className="capitalize text-sm">
                    {activity.action?.replace(/_/g, ' ').toLowerCase() ||
                      'Unknown'}
                  </span>
                </div>
              </TableCell>

              {/* Cell 2: Details */}
              <TableCell className="py-2.5 text-sm text-muted-foreground">
                {formatActivityDetails(activity)}
              </TableCell>

              {/* Cell 3: Timestamp */}
              <TableCell className="w-[110px] text-right text-muted-foreground py-2.5 pr-4">
                <TooltipProvider delayDuration={150}>
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
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card className="h-full flex flex-col">
      <CardTitle className="ml-5 mt-5 text-xl flex items-center gap-2">
        <ListTodo className="h-5 w-5 text-primary" /> Recent Activity
      </CardTitle>

      <CardContent className="p-0 flex-1 min-h-82 flex flex-col">
        {renderContent()}
      </CardContent>
      <CardFooter className="flex justify-end border-t px-6">
        <Button
          variant="link"
          size="sm"
          className="p-0 text-sm text-primary"
          asChild
        >
          <Link to="/activity-log">
            View All Activities
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ActivityFeed;
