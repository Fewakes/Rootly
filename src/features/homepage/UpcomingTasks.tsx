import { useState, useEffect } from 'react';
import { parseISO, differenceInDays } from 'date-fns';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CalendarDays,
  ListFilter,
  Users,
  Briefcase,
  Tags,
  CircleCheck,
  Contact as ContactIcon,
  NotebookPen,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getAllUpcomingTasks, type UnifiedTask } from '@/services/getAllUpcomingTasks';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

type UpcomingTasksProps = {
  currentUserId: string | null;
};

type EntityType = 'contact' | 'group' | 'company' | 'tag';

export default function UpcomingTasks({ currentUserId }: UpcomingTasksProps) {
  const [allFetchedTasks, setAllFetchedTasks] = useState<UnifiedTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<UnifiedTask[]>([]);
  const [loading, setLoading] = useState(true);

  // Simplified filtering state
  const [dateFilter, setDateFilter] = useState('all');
  const [entityFilterType, setEntityFilterType] = useState<EntityType | 'none'>(
    'none',
  );

  const [currentPage, setCurrentPage] = useState(1);
  const TASKS_PER_PAGE = 2;

  // Effect to fetch and sort tasks
  useEffect(() => {
    const fetchAndSortTasks = async () => {
      if (!currentUserId) {
        setAllFetchedTasks([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const fetchedTasks = await getAllUpcomingTasks(currentUserId);
        const tasksWithDueDate = fetchedTasks.filter(
          task => task.due_date !== null,
        ) as (UnifiedTask & { due_date: string })[];
        const sortedTasks = tasksWithDueDate.sort(
          (a, b) =>
            parseISO(a.due_date).getTime() - parseISO(b.due_date).getTime(),
        );
        setAllFetchedTasks(sortedTasks);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        setAllFetchedTasks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAndSortTasks();
  }, [currentUserId]);

  // SIMPLIFIED Effect to apply all filters
  useEffect(() => {
    let tasksToProcess = allFetchedTasks.filter(task => !task.completed);

    // Apply date range filtering (from tabs)
    if (dateFilter !== 'all') {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      tasksToProcess = tasksToProcess.filter(task => {
        const dueDate = parseISO(task.due_date!);
        const daysDifference = differenceInDays(dueDate, now);
        if (daysDifference < 0) return false;
        if (dateFilter === '0') {
          return daysDifference === 0;
        }
        const daysLimit = parseInt(dateFilter, 10);
        return daysDifference <= daysLimit;
      });
    }

    // Apply entity type filtering
    if (entityFilterType !== 'none') {
      tasksToProcess = tasksToProcess.filter(
        task => task.origin === entityFilterType,
      );
    }

    setFilteredTasks(tasksToProcess);
    setCurrentPage(1);
  }, [allFetchedTasks, dateFilter, entityFilterType]); // Dependency array updated

  // Pagination Logic
  const indexOfLastTask = currentPage * TASKS_PER_PAGE;
  const indexOfFirstTask = indexOfLastTask - TASKS_PER_PAGE;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getDueDateBadge = (
    dueDate: string | null,
  ): { text: string; className: string } | null => {
    if (!dueDate) return null;
    const due = parseISO(dueDate);
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const daysDifference = differenceInDays(due, startOfToday);

    if (daysDifference < 0) {
      const daysOverdue = Math.abs(daysDifference);
      return {
        text: `Overdue by ${daysOverdue} day${daysOverdue > 1 ? 's' : ''}`,
        className: 'bg-red-100 text-red-700 border border-red-200',
      };
    }
    if (daysDifference <= 3) {
      const text =
        daysDifference === 0
          ? 'Due Today'
          : `Due in ${daysDifference} day${daysDifference > 1 ? 's' : ''}`;
      return {
        text: text,
        className: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      };
    }
    return {
      text: `Due in ${daysDifference} days`,
      className: 'bg-green-100 text-green-700 border border-green-200',
    };
  };

  const getAssociatedEntityDisplay = (task: UnifiedTask) => {
    let icon = null;
    let link = '#';
    const typeDisplay =
      task.origin.charAt(0).toUpperCase() + task.origin.slice(1);
    switch (task.origin) {
      case 'contact':
        icon = <ContactIcon className="h-4 w-4" />;
        link = `/contacts/${task.entity.id}`;
        break;
      case 'group':
        icon = <Users className="h-4 w-4" />;
        link = `/groups/${task.entity.id}`;
        break;
      case 'company':
        icon = <Briefcase className="h-4 w-4" />;
        link = `/companies/${task.entity.id}`;
        break;
      case 'tag':
        icon = <Tags className="h-4 w-4" />;
        link = `/tags/${task.entity.id}`;
        break;
      default:
        break;
    }
    return { icon, name: task.entity.name, type: typeDisplay, link };
  };

  const handleCompleteTask = async (taskId: string) => {
    setAllFetchedTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
    // Here you would integrate with your Supabase update logic
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <NotebookPen className="h-5 w-5 text-primary" /> Upcoming Tasks
          </CardTitle>
          {/* SIMPLIFIED Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                <ListFilter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={entityFilterType}
                onValueChange={value =>
                  setEntityFilterType(value as EntityType | 'none')
                }
              >
                <DropdownMenuRadioItem value="none">
                  All Types
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="contact">
                  Contacts
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="group">
                  Groups
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="company">
                  Companies
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="tag">Tags</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Tabs
          defaultValue="all"
          value={dateFilter}
          onValueChange={setDateFilter}
          className="w-full pt-3"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="0">Today</TabsTrigger>
            <TabsTrigger value="3">3 Days</TabsTrigger>
            <TabsTrigger value="6">6 Days</TabsTrigger>
            <TabsTrigger value="9">9 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="flex-grow p-4 space-y-2 min-h-65">
        {loading ? (
          <div className="flex h-[280px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex h-[320px] flex-col items-center justify-center text-center">
            <NotebookPen className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="font-medium">No Upcoming Tasks</p>
            <p className="text-sm text-muted-foreground">
              Tasks matching your filters will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {currentTasks.map(task => {
              const entityDisplay = getAssociatedEntityDisplay(task);
              const dueDateBadge = getDueDateBadge(task.due_date);

              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-3 p-3 border rounded-lg bg-background"
                >
                  <div className="flex items-center flex-grow min-w-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCompleteTask(task.id)}
                      className="flex-shrink-0 text-gray-400 hover:text-green-500 mr-2"
                      aria-label={`Mark "${task.title}" as complete`}
                    >
                      <CircleCheck className="h-5 w-5" />
                    </Button>
                    <div className="flex flex-col flex-grow min-w-0">
                      <span className="font-semibold text-card-foreground truncate block">
                        {task.title}
                      </span>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs mt-1">
                        {dueDateBadge && (
                          <Badge
                            className={cn(
                              'whitespace-nowrap',
                              dueDateBadge.className,
                            )}
                          >
                            <CalendarDays className="h-3 w-3 mr-1.5" />
                            {dueDateBadge.text}
                          </Badge>
                        )}
                        {entityDisplay.name !== 'General' && (
                          <Link
                            to={entityDisplay.link}
                            className="text-muted-foreground hover:text-primary hover:underline truncate flex items-center gap-1.5"
                          >
                            {entityDisplay.icon} {entityDisplay.name}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {totalPages > 1 && (
        <div className="flex justify-between items-center p-4 border-t">
          <Button
            variant="outline"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </Card>
  );
}
