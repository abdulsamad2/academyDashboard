import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface PageHeaderBreadcrumb {
  title: string;
  link?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: PageHeaderBreadcrumb[];
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  className
}: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <nav
          aria-label="Breadcrumb"
          className="flex items-center text-xs text-muted-foreground"
        >
          <ol className="flex flex-wrap items-center gap-1">
            {breadcrumbs.map((b, i) => {
              const isLast = i === breadcrumbs.length - 1;
              return (
                <React.Fragment key={`${b.title}-${i}`}>
                  <li>
                    {b.link && !isLast ? (
                      <Link
                        href={b.link}
                        className="transition-colors hover:text-foreground"
                      >
                        {b.title}
                      </Link>
                    ) : (
                      <span
                        className={
                          isLast ? 'font-medium text-foreground' : undefined
                        }
                      >
                        {b.title}
                      </span>
                    )}
                  </li>
                  {!isLast ? (
                    <ChevronRight
                      className="h-3 w-3 shrink-0 text-muted-foreground/60"
                      aria-hidden
                    />
                  ) : null}
                </React.Fragment>
              );
            })}
          </ol>
        </nav>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}
