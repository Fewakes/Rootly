//New

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts';
import type { Task } from '@/types/types';

const CHART_COLORS = ['#005df4', '#a1a1aa'];

type AtAGlanceProps = {
  rankLabel: string;
  rank?: number;
  total?: number;
  tasks: Task[];
};

export function AtAGlance({
  rankLabel,
  rank = 0,
  total = 1,
  tasks,
}: AtAGlanceProps) {
  const taskStatusData = useMemo(
    () => [
      { name: 'Completed', value: tasks.filter(t => t.completed).length },
      { name: 'Pending', value: tasks.filter(t => !t.completed).length },
    ],
    [tasks],
  );

  const rankPercentage = Math.ceil((rank / total) * 100);
  const progressValue = 100 - (rank / total) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>At a Glance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="text-muted-foreground">{rankLabel}</span>
            <span className="font-semibold">
              Top {rankPercentage}% ({rank} of {total})
            </span>
          </div>
          <Progress
            value={progressValue}
            className="h-2 [&>div]:bg-[#005df4]"
          />
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Task Status</h4>
          <div className="h-32 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={50}
                  paddingAngle={5}
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  contentStyle={{
                    background: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs mt-2">
            {taskStatusData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: CHART_COLORS[index] }}
                ></div>
                <span>
                  {entry.name} ({entry.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
