import * as React from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'flat';
  };
  helper?: string;
  className?: string;
}

const trendStyles = {
  up: 'text-success',
  down: 'text-destructive',
  flat: 'text-muted-foreground'
};

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  helper,
  className
}: StatCardProps) {
  return (
    <Card className={cn('shadow-elevated-sm', className)}>
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="truncate text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          {trend ? (
            <p
              className={cn(
                'text-xs font-medium',
                trendStyles[trend.direction]
              )}
            >
              {trend.direction === 'up'
                ? '▲'
                : trend.direction === 'down'
                ? '▼'
                : '–'}{' '}
              {trend.value}
            </p>
          ) : null}
          {helper ? (
            <p className="text-xs text-muted-foreground">{helper}</p>
          ) : null}
        </div>
        {Icon ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" aria-hidden />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
