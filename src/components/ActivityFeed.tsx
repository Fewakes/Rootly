import { Button } from '@/components/ui/button'; // Assuming shadcn/ui
import { useActivities } from '@/logic/useActivity';
import type { ActivityLogEntry } from '@/services/activityLogger';
import { ArrowRight, Loader2 } from 'lucide-react'; // Assuming lucide-react for icons

/**
 * ActivityFeed Component
 *
 * Displays a list of the most recent user activities.
 * It fetches data using the `useActivities` hook and handles its own loading and error states.
 *
 * @param {object} props - The component props.
 * @param {number} [props.limit=5] - The number of recent activities to display.
 */
const ActivityFeed = ({ limit = 5 }: { limit?: number }) => {
  // Use the custom hook to fetch activities
  const { activities, loading, error, formatTimeAgo } = useActivities(limit);

  // Display a loading spinner while data is being fetched
  if (loading) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">
          Latest Activity Log
        </h3>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  // Display an error message if fetching fails
  if (error) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">
          Latest Activity Log
        </h3>
        <div className="text-destructive-foreground bg-destructive/80 p-3 rounded-md">
          <p className="font-semibold">Error</p>
          <p className="text-sm">
            Failed to load activity log. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // Main component render
  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-3">
        Latest Activity Log
      </h3>
      {activities.length > 0 ? (
        <div className="space-y-4 text-sm text-muted-foreground">
          {/* Map over the fetched activities */}
          {activities.map((activity: ActivityLogEntry) => (
            <div
              key={activity.id}
              className="flex justify-between items-start border-l-2 border-primary/30 hover:border-primary transition-colors pl-4 py-1"
            >
              <div>
                <span>{activity.description}</span>
                {/* The original code had a 'contactName'. The ActivityLogEntry type has 'details'.
                  This checks if details.contactName exists and displays it.
                  You can adapt this to fit your exact data structure in the 'details' object.
                */}
                {activity.details?.contactName && (
                  <span className="font-medium text-foreground ml-1">
                    {activity.details.contactName}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap ml-4 flex-shrink-0">
                {formatTimeAgo(activity.created_at)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        // Display a message if there is no activity
        <div className="text-muted-foreground italic border border-dashed rounded-md p-6 text-center">
          No recent activity to display.
        </div>
      )}
      <Button variant="link" className="px-0 mt-4 text-primary">
        View Full Activity Log
        <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};

export default ActivityFeed;

// --- Example Usage ---
// To use this component on your homepage, simply import it and place it where needed.
// You can leave out the original JSX.

/*
import ActivityFeed from './path/to/ActivityFeed';
import { Card, CardContent } from '@/components/ui/card'; // Assuming shadcn/ui

const HomePage = () => {
  return (
    // ... your other page structure
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-8">
                // Other content...
                
                // Just add the new component here
                <ActivityFeed />

              </div>
            </CardContent>
          </Card>
    // ...
  );
}
*/
