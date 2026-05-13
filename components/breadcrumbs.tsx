import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';

type BreadcrumbItemProps = {
  title: string;
  link: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItemProps[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center text-xs text-muted-foreground"
    >
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <Fragment key={item.title}>
              <li>
                {isLast ? (
                  <span className="font-medium text-foreground">
                    {item.title}
                  </span>
                ) : (
                  <Link
                    href={item.link}
                    className="transition-colors hover:text-foreground"
                  >
                    {item.title}
                  </Link>
                )}
              </li>
              {!isLast ? (
                <ChevronRight
                  className="h-3 w-3 shrink-0 text-muted-foreground/60"
                  aria-hidden
                />
              ) : null}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
