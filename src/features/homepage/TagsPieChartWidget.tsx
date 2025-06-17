import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, BarChartHorizontal, ArrowRight, Tags } from 'lucide-react';
import {
  TAG_BG_CLASSES,
  TAG_SOLID_COLORS,
  TAG_TEXT_CLASSES,
} from '@/lib/utils';

type TagColor = keyof typeof TAG_BG_CLASSES;

type ChartData = {
  id: string;
  name: string;
  value: number;
  color: string;
  bgColorClass: string;
  textColorClass: string;
};

const getTagsDataForChart = async (): Promise<ChartData[]> => {
  const { data, error } = await supabase
    .from('tags')
    .select('id, name, color, contact_tags!inner(count)');

  if (error) {
    console.error('Error fetching tags for chart:', error.message);
    throw error;
  }

  const chartData = data
    .map((tag: any) => {
      const colorKey = (
        tag.color in TAG_SOLID_COLORS ? tag.color : 'gray'
      ) as TagColor;
      return {
        id: tag.id,
        name: tag.name,
        value: tag.contact_tags[0]?.count ?? 0,
        color: TAG_SOLID_COLORS[colorKey],
        bgColorClass: TAG_BG_CLASSES[colorKey],
        textColorClass: TAG_TEXT_CLASSES[colorKey],
      };
    })
    .filter(tag => tag.value > 0);

  return chartData;
};

export const TagsDistributionWidget = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTagsDataForChart();
        setChartData(data);
      } catch (err) {
        setError('Failed to load chart data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalContacts = chartData.reduce((sum, item) => sum + item.value, 0);

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
    if (chartData.length === 0) {
      return (
        <div className="flex h-48 flex-col items-center justify-center text-center">
          <Tags className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="font-medium">No Tag Data</p>
          <p className="text-sm text-muted-foreground">
            Assign tags to see distribution.
          </p>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        <TooltipProvider>
          <div className="flex h-3 w-full rounded-full overflow-hidden">
            {chartData.map(entry => (
              <Tooltip key={entry.name} delayDuration={100}>
                <TooltipTrigger asChild>
                  <div
                    className="h-full transition-transform hover:scale-105 ring-1 ring-inset ring-background"
                    style={{
                      width: `${totalContacts > 0 ? (entry.value / totalContacts) * 100 : 0}%`,
                      backgroundColor: entry.color,
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">{entry.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {entry.value} contacts (
                    {Math.round((entry.value / totalContacts) * 100)}%)
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>

        <div className="flex flex-wrap gap-2 pt-2">
          {chartData.map(entry => (
            <Badge
              key={entry.id}
              variant="outline"
              className={`${entry.bgColorClass} ${entry.textColorClass} border-none shadow-sm px-3 py-1`}
            >
              {entry.name} ({entry.value})
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChartHorizontal className="h-5 w-5 text-muted-foreground" />
          Tags Distribution
        </CardTitle>
        <CardDescription>
          How your contacts are distributed across all tags.
        </CardDescription>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
      <CardFooter className="flex justify-end border-t px-6">
        <Button variant="link" size="sm" className="p-0 text-sm" asChild>
          <Link to="/tags">
            View All Tags <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
