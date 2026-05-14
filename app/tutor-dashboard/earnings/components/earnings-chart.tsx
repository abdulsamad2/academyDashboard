'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

interface EarningsPoint {
  month: string;
  earnings: number;
}

const chartConfig = {
  earnings: {
    label: 'Earnings (RM)',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig;

export function EarningsChart({ data }: { data: EarningsPoint[] }) {
  const total = data.reduce((s, p) => s + p.earnings, 0);
  const last = data[data.length - 1]?.earnings ?? 0;
  const prev = data[data.length - 2]?.earnings ?? 0;
  const delta = prev === 0 ? 0 : ((last - prev) / prev) * 100;
  const trendingUp = delta >= 0;
  const hasData = total > 0;

  return (
    <Card className="shadow-elevated-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base">Earnings overview</CardTitle>
          <CardDescription>
            Last 6 months · RM {total.toLocaleString()}
          </CardDescription>
        </div>
        {hasData ? (
          <div
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
              trendingUp
                ? 'bg-success-muted text-success'
                : 'bg-destructive-muted text-destructive'
            }`}
          >
            {trendingUp ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(delta).toFixed(1)}%
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[280px] w-full"
          >
            <AreaChart
              data={data}
              margin={{ left: 0, right: 12, top: 8, bottom: 0 }}
            >
              <defs>
                <linearGradient id="earningsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    formatter={(value) =>
                      `RM ${Number(value).toLocaleString()}`
                    }
                  />
                }
              />
              <Area
                dataKey="earnings"
                type="monotone"
                fill="url(#earningsFill)"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[280px] flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-foreground">
              No payouts yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Your monthly earnings will chart here once payouts are issued.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
