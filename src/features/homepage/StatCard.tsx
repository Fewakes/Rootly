import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react'; // Ensure LucideIcon is correctly imported

type StatCardProps = {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trendValue?: number;
  className?: string; // Allows for external styling like width
};

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trendValue,
  className,
}: StatCardProps) => {
  // Determine if trend value is a valid number for display
  const hasTrend = typeof trendValue === 'number';

  let TrendIcon: LucideIcon = Minus; // Default icon
  let trendColor = 'text-muted-foreground'; // Default color
  let trendDisplayValue = ''; // Default display value

  // Logic to determine trend icon, color, and display value
  if (hasTrend) {
    if (trendValue > 0) {
      TrendIcon = ArrowUpRight;
      trendColor = 'text-green-600';
      trendDisplayValue = `+${trendValue}`;
    } else if (trendValue < 0) {
      TrendIcon = ArrowDownRight;
      trendColor = 'text-red-600';
      trendDisplayValue = `${trendValue}`;
    } else {
      // trendValue is 0
      trendColor = 'text-muted-foreground';
      trendDisplayValue = `No changes today`; // Changed to "No changes today"
    }
  }

  return (
    // Card with flex column layout to manage internal sections
    <Card className={`flex flex-col flex-grow min-w-[160px] ${className}`}>
      <CardContent className=" px-3">
        {' '}
        {/* Further reduced vertical padding */}
        {/* Top row: Title and Icon */}
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground leading-tight">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </div>
        {/* Bottom row: Value and Inline Trend */}
        <div className="flex flex-row items-baseline justify-between mt-1">
          <div className="text-2xl font-semibold text-foreground leading-none">
            {value}
          </div>

          {hasTrend && (
            <div className={`text-sm ${trendColor} flex items-center`}>
              {/* Conditional rendering for trend text or number + icon */}
              {trendValue !== 0 ? (
                <>
                  <span className="font-semibold">{trendDisplayValue}</span>
                  <TrendIcon className="h-4 w-4 ml-0.5" />
                </>
              ) : (
                <span className="italic">{trendDisplayValue}</span> // Display "No changes today" as text only
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
