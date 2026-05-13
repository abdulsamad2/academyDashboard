import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/empty-state';

interface Invoice {
  id?: string;
  total: number;
  status?: string;
  invoiceNumber?: string;
  parent?: { name?: string | null; email?: string | null };
}

const STATUS_VARIANT: Record<
  string,
  'success' | 'warning' | 'destructive' | 'secondary'
> = {
  paid: 'success',
  PAID: 'success',
  pending: 'warning',
  PENDING: 'warning',
  unpaid: 'destructive',
  UNPAID: 'destructive'
};

function initials(name?: string | null) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function RecentInvoicesCard({ invoices }: { invoices: Invoice[] }) {
  return (
    <Card className="shadow-elevated-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base">Recent invoices</CardTitle>
          <CardDescription>Latest 3 billings</CardDescription>
        </div>
        <Link
          href="/dashboard/invoices"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <EmptyState
            title="No invoices yet"
            description="When you generate invoices they'll appear here."
            className="border-0 bg-transparent py-6"
          />
        ) : (
          <ul className="space-y-3">
            {invoices.map((inv, i) => {
              const name = inv.parent?.name ?? 'Unknown';
              const variant = inv.status
                ? STATUS_VARIANT[inv.status] ?? 'secondary'
                : 'secondary';
              return (
                <li
                  key={inv.id ?? i}
                  className="flex items-center gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/40"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-xs">
                      {initials(name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {inv.parent?.email ?? '—'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-semibold text-foreground">
                      RM {Number(inv.total ?? 0).toLocaleString()}
                    </span>
                    {inv.status ? (
                      <Badge variant={variant} className="px-1.5 py-0 text-2xs">
                        {inv.status}
                      </Badge>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
