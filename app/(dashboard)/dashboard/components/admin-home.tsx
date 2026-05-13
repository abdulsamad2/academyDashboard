import Link from 'next/link';
import {
  DollarSign,
  GraduationCap,
  Clock,
  Users,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { RecentInvoicesCard } from '@/components/dashboard/recent-invoices-card';
import { QuickActions } from '@/components/dashboard/quick-actions';

interface AdminHomeProps {
  userName: string;
  students: any[];
  tutors: any[];
  hours: { hours: number } | null;
  recentInvoices: any[];
  sixMonthRevenue: { month: string; revenue: number }[];
  openJobs: number;
  pendingInvoices: number;
}

export default function AdminHome({
  userName,
  students,
  tutors,
  hours,
  recentInvoices,
  sixMonthRevenue,
  openJobs,
  pendingInvoices
}: AdminHomeProps) {
  const last = sixMonthRevenue[sixMonthRevenue.length - 1]?.revenue ?? 0;
  const prev = sixMonthRevenue[sixMonthRevenue.length - 2]?.revenue ?? 0;
  const revenueDelta = prev === 0 ? 0 : ((last - prev) / prev) * 100;
  const trendDir = revenueDelta > 0 ? 'up' : revenueDelta < 0 ? 'down' : 'flat';

  return (
    <>
      <PageHeader
        title={`Welcome back, ${userName.split(' ')[0]}`}
        description="Here’s what’s happening at your academy today"
      />

      {(openJobs > 0 || pendingInvoices > 0) && (
        <Card className="border-warning/30 bg-warning-muted/30 shadow-elevated-sm">
          <CardContent className="flex flex-col items-start justify-between gap-3 p-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Needs your attention
                </p>
                <p className="text-xs text-muted-foreground">
                  {openJobs > 0
                    ? `${openJobs} open tutor request${
                        openJobs === 1 ? '' : 's'
                      }`
                    : null}
                  {openJobs > 0 && pendingInvoices > 0 ? ' · ' : null}
                  {pendingInvoices > 0
                    ? `${pendingInvoices} unpaid invoice${
                        pendingInvoices === 1 ? '' : 's'
                      }`
                    : null}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {openJobs > 0 && (
                <Button asChild size="sm" variant="outline">
                  <Link href="/dashboard/inquiries">
                    Review requests
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              )}
              {pendingInvoices > 0 && (
                <Button asChild size="sm">
                  <Link href="/dashboard/invoices">
                    View invoices
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Revenue (this month)"
          value={`RM ${last.toLocaleString()}`}
          icon={DollarSign}
          trend={{
            direction: trendDir,
            value:
              prev === 0
                ? 'first month'
                : `${Math.abs(revenueDelta).toFixed(1)}% vs last month`
          }}
        />
        <StatCard
          label="Students"
          value={students?.length ?? 0}
          icon={GraduationCap}
          helper="Enrolled"
        />
        <StatCard
          label="Hours logged"
          value={hours?.hours ?? 0}
          icon={Clock}
          helper="All-time"
        />
        <StatCard
          label="Tutors"
          value={tutors?.length ?? 0}
          icon={Users}
          helper="Active on roster"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={sixMonthRevenue} />
        </div>
        <RecentInvoicesCard invoices={recentInvoices as any} />
      </div>

      <QuickActions />
    </>
  );
}
