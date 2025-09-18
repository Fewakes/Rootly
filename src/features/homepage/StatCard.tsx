import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trendValue?: number;
  className?: string;
};

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trendValue,
  className,
}: StatCardProps) => {
  const hasTrend = typeof trendValue === 'number';

  let TrendIcon: LucideIcon = Minus;
  let trendColor = 'text-muted-foreground';
  let trendDisplayValue = '';

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
      trendColor = 'text-muted-foreground';
      trendDisplayValue = `No changes today`;
    }
  }

  return (
    <Card className={`flex flex-col flex-grow min-w-[160px] ${className}`}>
      <CardContent className=" px-3">
        {' '}
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
                <span className="italic">{trendDisplayValue}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
