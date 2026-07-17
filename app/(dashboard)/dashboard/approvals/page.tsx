import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/db/db';
import { approveTutor } from '@/action/approveTutor';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  GraduationCap,
  Users,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Approvals', link: '/dashboard/approvals' }
];

export default async function Page() {
  const session = await auth();
  if (!session?.id) redirect('/auth/signin');
  if (session.role !== 'admin') redirect('/');

  const [pendingTutors, openJobs, pendingUsers] = await Promise.all([
    db.tutor.findMany({
      where: { user: { status: 'pendingApproval' } },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    }),
    db.job.findMany({
      where: { status: 'open' },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    db.user.findMany({
      where: { status: 'pendingApproval' },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
  ]);

  const totalPending =
    pendingTutors.length + openJobs.length + pendingUsers.length;

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Approvals"
        description={
          totalPending === 0
            ? 'You’re all caught up'
            : `${totalPending} item${
                totalPending === 1 ? '' : 's'
              } need your attention`
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Tutor applications"
          value={pendingTutors.length}
          icon={GraduationCap}
          helper="Awaiting review"
        />
        <StatCard
          label="Open tutor requests"
          value={openJobs.length}
          icon={MessageSquare}
          helper="From parents"
        />
        <StatCard
          label="Pending user accounts"
          value={pendingUsers.length}
          icon={Users}
          helper="Need activation"
        />
      </div>

      {/* Tutor applications */}
      <Card className="shadow-elevated-sm">
        <CardHeader>
          <CardTitle className="text-base">Tutor applications</CardTitle>
          <CardDescription>
            Review and approve tutors who applied to join the roster
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingTutors.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="No applications waiting"
              description="When tutors apply, they'll show up here for your review."
              className="border-0 bg-transparent py-6"
            />
          ) : (
            <ul className="space-y-2">
              {pendingTutors.slice(0, 10).map((t: any) => (
                <li
                  key={t.id}
                  className="flex items-center gap-3 rounded-lg border border-border/60 p-3"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-xs">
                      {(t.user?.name?.[0] ?? 'T').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {t.user?.name ?? 'Unnamed tutor'}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {t.user?.email ?? '—'}
                    </p>
                  </div>
                  <Badge variant="outline" className="hidden sm:inline-flex">
                    {t.subjects?.[0] ?? 'Tutor'}
                  </Badge>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/tutor/${t.id}`}>
                      Review <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                  <form
                    action={async () => {
                      'use server';
                      await approveTutor(t.user.id);
                    }}
                  >
                    <Button type="submit" size="sm">
                      Approve <CheckCircle2 className="ml-1 h-3 w-3" />
                    </Button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Open tutor requests */}
      <Card className="shadow-elevated-sm">
        <CardHeader>
          <CardTitle className="text-base">Open tutor requests</CardTitle>
          <CardDescription>
            Parents looking for a tutor — match them quickly
          </CardDescription>
        </CardHeader>
        <CardContent>
          {openJobs.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No open requests"
              description="When parents request a tutor, they'll show up here."
              className="border-0 bg-transparent py-6"
            />
          ) : (
            <ul className="space-y-2">
              {openJobs.map((j: any) => (
                <li
                  key={j.id}
                  className="flex items-center gap-3 rounded-lg border border-border/60 p-3"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-info-muted text-info">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {j.subject ?? 'Tutor request'} · {j.studentLevel ?? '—'}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      From {j.user?.name ?? 'Unknown'} · {j.mode ?? 'any mode'}
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard/inquiries">
                      Open <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Pending users */}
      <Card className="shadow-elevated-sm">
        <CardHeader>
          <CardTitle className="text-base">Pending user accounts</CardTitle>
          <CardDescription>
            Accounts awaiting activation by an admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingUsers.length === 0 ? (
            <EmptyState
              icon={ShieldAlert}
              title="No pending accounts"
              description="Newly-registered users will appear here when they need manual approval."
              className="border-0 bg-transparent py-6"
            />
          ) : (
            <ul className="space-y-2">
              {pendingUsers.map((u: any) => (
                <li
                  key={u.id}
                  className="flex items-center gap-3 rounded-lg border border-border/60 p-3"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-xs">
                      {(u.name?.[0] ?? 'U').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {u.name ?? 'Unnamed user'}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {u.email} · {u.role}
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/user`}>
                      Manage <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  );
}
