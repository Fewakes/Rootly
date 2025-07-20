import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDialog } from '@/contexts/DialogContext';
import {
  UserPlus,
  Tag,
  Users2,
  Briefcase,
  Rocket,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { seedMockData } from '@/services/seed-mock-data';

const actions = [
  {
    icon: UserPlus,
    title: 'Add Contact',
    description: 'Build your network.',
    dialogName: 'addContact',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    icon: Tag,
    title: 'Create Tag',
    description: 'Categorize contacts.',
    dialogName: 'addTag',
    color: 'text-sky-600',
    bgColor: 'bg-sky-100',
  },
  {
    icon: Users2,
    title: 'Organize Group',
    description: 'Segment your audience.',
    dialogName: 'addGroup',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  {
    icon: Briefcase,
    title: 'Add Company',
    description: 'Track relationships.',
    dialogName: 'addCompany',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
];

export const CallToActionBanner = () => {
  const { openDialog } = useDialog();
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // This function is now updated to call the correct service function
  const handleLoadDemoData = async () => {
    setIsLoading(true);
    const promise = seedMockData(); // Call the new service function

    toast.promise(promise, {
      loading: 'Seeding your workspace with demo data...',
      success: result => {
        if (result.success) {
          window.location.reload(); // Refresh to see new data
          return 'Demo data loaded successfully!';
        } else {
          // This will show the error message from the catch block
          throw new Error(result.error);
        }
      },
      error: err => `Error: ${err.message}`,
      finally: () => setIsLoading(false),
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Card className="relative transition-all duration-300">
      <CardHeader>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={() => setIsVisible(false)}
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-3">
          <Rocket className="h-6 w-6 text-primaryBlue" />
          <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <CardDescription className="p-0">
              Click an action below, or load some demo data to explore.
            </CardDescription>
            <Button
              variant="link"
              className="p-0 text-sm text-primaryBlue whitespace-nowrap"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show Less' : 'Show More'}
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 ml-1" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-1" />
              )}
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadDemoData}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Load Demo Data
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {actions.map(action => (
              <button
                key={action.title}
                onClick={() => openDialog(action.dialogName as any)}
                className="group flex items-center p-4 border rounded-lg text-left hover:bg-muted/50 hover:shadow-sm transition-all hover:border-primaryBlue focus:outline-none focus:ring-2 focus:ring-primaryBlue focus:ring-offset-2"
              >
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${action.bgColor} mr-4 transition-transform group-hover:scale-110`}
                >
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {action.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
