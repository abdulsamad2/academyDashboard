import * as React from 'react';
import { cn } from '@/lib/utils';

interface FormShellProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function FormShell({
  title,
  description,
  children,
  footer,
  className
}: FormShellProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-card shadow-elevated-sm',
        className
      )}
    >
      {(title || description) && (
        <div className="border-b border-border/80 px-6 py-4">
          {title ? (
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
          ) : null}
          {description ? (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      )}

      <div className="divide-y divide-border/80">{children}</div>

      {footer ? (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border/80 bg-muted/30 px-6 py-3">
          {footer}
        </div>
      ) : null}
    </div>
  );
}

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  /** Number of columns inside the fields area (default: 2) */
  columns?: 1 | 2;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  columns = 2,
  className
}: FormSectionProps) {
  return (
    <section
      className={cn(
        'grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]',
        className
      )}
    >
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      <div
        className={cn(
          'grid gap-4',
          columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-1'
        )}
      >
        {children}
      </div>
    </section>
  );
}

/** Use to span both columns inside a FormSection grid */
export function FormFieldFull({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('sm:col-span-2', className)}>{children}</div>;
}
