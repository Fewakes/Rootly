import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  let TrendIcon = Minus;
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
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>

        {hasTrend && (
          <p className={`text-xs ${trendColor} flex items-center`}>
            {trendValue !== 0 && <TrendIcon className="h-3 w-3 mr-1" />}

            {trendValue !== 0 ? (
              <>
                <span className="font-semibold">{trendDisplayValue}</span>
                <span className="ml-1">today</span>
              </>
            ) : (
              <span className="text-muted-foreground">No changes today</span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
