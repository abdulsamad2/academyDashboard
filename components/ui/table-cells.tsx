import * as React from 'react';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/* ---------- EntityCell: avatar + primary + secondary line ---------- */

interface EntityCellProps {
  name: string;
  subtitle?: string | null;
  imageSrc?: string | null;
  className?: string;
}

function initials(name?: string) {
  if (!name) return '–';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('');
}

export function EntityCell({
  name,
  subtitle,
  imageSrc,
  className
}: EntityCellProps) {
  return (
    <div className={cn('flex min-w-0 items-center gap-2.5', className)}>
      <Avatar className="h-8 w-8 shrink-0">
        {imageSrc ? <AvatarImage src={imageSrc} alt={name} /> : null}
        <AvatarFallback className="bg-primary/10 text-2xs font-semibold text-primary">
          {initials(name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="break-words text-sm font-medium text-foreground">
          {name}
        </p>
        {subtitle ? (
          <p className="break-words text-xs text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* ---------- StackedCell: primary + muted secondary, no avatar ---------- */

export function StackedCell({
  primary,
  secondary,
  className
}: {
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('min-w-0', className)}>
      <p className="break-words text-sm text-foreground">{primary}</p>
      {secondary ? (
        <p className="break-words text-xs text-muted-foreground">{secondary}</p>
      ) : null}
    </div>
  );
}

/* ---------- StatusBadge: dot + label ---------- */

const dotColor: Record<string, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  destructive: 'bg-destructive',
  info: 'bg-info',
  muted: 'bg-muted-foreground/50'
};

export function StatusBadge({
  variant = 'muted',
  label
}: {
  variant?: keyof typeof dotColor;
  label: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-2 py-0.5 text-2xs font-medium text-foreground">
      <span
        className={cn('h-1.5 w-1.5 rounded-full', dotColor[variant])}
        aria-hidden
      />
      {label}
    </span>
  );
}

/* ---------- RatingCell: compact number + star ---------- */

export function RatingCell({ rating }: { rating: number }) {
  const value = Number.isFinite(rating) ? rating : 0;
  if (value === 0) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      {value.toFixed(1)}
    </span>
  );
}

/* ---------- TagsCell: chip list with overflow indicator ---------- */

export function TagsCell({ tags, max = 2 }: { tags: string[]; max?: number }) {
  if (!tags || tags.length === 0) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  const visible = tags.slice(0, max);
  const overflow = tags.length - visible.length;
  return (
    <div className="flex flex-wrap items-center gap-1">
      {visible.map((t) => (
        <Badge key={t} variant="secondary" className="text-2xs font-normal">
          {t}
        </Badge>
      ))}
      {overflow > 0 ? (
        <Badge variant="outline" className="text-2xs font-normal">
          +{overflow}
        </Badge>
      ) : null}
    </div>
  );
}

/* ---------- IdChip: small inline ID for reference ---------- */

export function IdChip({ id }: { id?: string | null }) {
  if (!id) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <code className="rounded-md border border-border/60 bg-muted/40 px-1.5 py-0.5 font-mono text-2xs text-muted-foreground">
      {id}
    </code>
  );
}
