import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/db/db';
import { getInvoicesForParent } from '@/action/invoice';
import { getJobsByParentId } from '@/action/jobActions';
import { getParentSidetutorStudent } from '@/action/AssignTutor';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Users,
  CreditCard,
  GraduationCap,
  Clock,
  Plus,
  ArrowRight,
  MessageSquare,
  BookOpen
} from 'lucide-react';

const STATUS_BADGE: Record<
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

export default async function ParentHome() {
  const session = await auth();
  if (!session?.id) redirect('/auth/signin');
  const parentId = session.id;

  const [students, invoicesRaw, tutorRequests] = await Promise.all([
    db.student.findMany({ where: { parentId } }),
    getInvoicesForParent(parentId),
    getJobsByParentId(parentId)
  ]);

  const invoices = Array.isArray(invoicesRaw) ? invoicesRaw : [];
  const formattedStudents = students.map((s) => ({
    ...s,
    createdAt: new Date(s.createdAt).toLocaleDateString()
  }));

  const totalDue = invoices
    .filter((i: any) => (i.status ?? '').toString().toLowerCase() !== 'paid')
    .reduce((sum: number, i: any) => sum + (i.total ?? 0), 0);

  const openRequests = tutorRequests.filter(
    (r: any) => (r.status ?? 'open').toLowerCase() === 'open'
  ).length;

  // Get assigned tutors per student for the "Children" card
  const childrenWithTutors = await Promise.all(
    formattedStudents.map(async (child) => {
      const tutors = await getParentSidetutorStudent(child.id);
      return {
        ...child,
        tutorCount: Array.isArray(tutors) ? tutors.length : 0
      };
    })
  );

  const firstName = (session.user?.name ?? '').split(' ')[0] || 'there';
  const recentInvoices = invoices.slice(0, 3);

  return (
    <>
      <PageHeader
        title={`Welcome, ${firstName}`}
        description="Manage your children’s tutoring in one place"
        actions={
          <Button asChild>
            <Link href="/parent-dashboard/children/new">
              <Plus className="mr-2 h-4 w-4" />
              Add child
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Children"
          value={students.length}
          icon={GraduationCap}
          helper="Enrolled with us"
        />
        <StatCard
          label="Outstanding"
          value={`RM ${totalDue.toLocaleString()}`}
          icon={CreditCard}
          helper={totalDue > 0 ? 'Action required' : 'All caught up'}
        />
        <StatCard
          label="Tutor requests"
          value={openRequests}
          icon={Users}
          helper="Currently open"
        />
        <StatCard
          label="Invoices"
          value={invoices.length}
          icon={Clock}
          helper="All-time"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Children */}
        <Card className="shadow-elevated-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-base">Your children</CardTitle>
              <CardDescription>
                {students.length} child{students.length === 1 ? '' : 'ren'}{' '}
                enrolled
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/parent-dashboard/children">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {childrenWithTutors.length === 0 ? (
              <EmptyState
                icon={GraduationCap}
                title="No children yet"
                description="Add your first child to start matching them with a vetted tutor."
                action={
                  <Button asChild>
                    <Link href="/parent-dashboard/children/new">Add child</Link>
                  </Button>
                }
                className="border-0 bg-transparent py-6"
              />
            ) : (
              <ul className="space-y-2">
                {childrenWithTutors.map((child: any) => (
                  <li
                    key={child.id}
                    className="flex items-center gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/40"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs">
                        {(child.name?.[0] ?? 'C').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {child.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {child.class ?? child.level ?? 'Student'}
                      </p>
                    </div>
                    <Badge variant="outline" className="hidden sm:inline-flex">
                      {child.tutorCount > 0
                        ? `${child.tutorCount} tutor${
                            child.tutorCount === 1 ? '' : 's'
                          }`
                        : 'No tutor yet'}
                    </Badge>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/parent-dashboard/children/${child.id}`}>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Recent invoices */}
        <Card className="shadow-elevated-sm">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-base">Recent invoices</CardTitle>
              <CardDescription>
                {invoices.length === 0
                  ? 'No invoices yet'
                  : `${invoices.length} total`}
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/parent-dashboard/billing">All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentInvoices.length === 0 ? (
              <EmptyState
                title="Nothing to pay"
                description="When you receive invoices they'll show up here."
                className="border-0 bg-transparent py-6"
              />
            ) : (
              <ul className="space-y-2">
                {recentInvoices.map((inv: any, i: number) => {
                  const variant = inv.status
                    ? STATUS_BADGE[inv.status] ?? 'secondary'
                    : 'secondary';
                  return (
                    <li
                      key={inv.id ?? i}
                      className="flex items-center justify-between rounded-lg border border-border/60 p-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          RM {Number(inv.total ?? 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {inv.date
                            ? new Date(inv.date).toLocaleDateString()
                            : '—'}
                        </p>
                      </div>
                      <Badge variant={variant} className="text-2xs">
                        {inv.status ?? 'unknown'}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tutor requests */}
      <Card className="shadow-elevated-sm">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-base">Tutor requests</CardTitle>
            <CardDescription>
              {tutorRequests.length === 0
                ? 'No active requests'
                : `${tutorRequests.length} request${
                    tutorRequests.length === 1 ? '' : 's'
                  }`}
            </CardDescription>
          </div>
          <Button asChild size="sm">
            <Link href="/parent-dashboard/children">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              New request
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {tutorRequests.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No tutor requests yet"
              description="Tell us what your child needs and we'll match them with a vetted tutor in 24 hours."
              className="border-0 bg-transparent py-6"
            />
          ) : (
            <ul className="space-y-2">
              {tutorRequests.slice(0, 5).map((r: any) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between rounded-lg border border-border/60 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {r.subject ?? 'Tutor request'}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {r.studentLevel ?? r.studentName ?? '—'}
                    </p>
                  </div>
                  <Badge
                    variant={
                      r.status === 'assigned'
                        ? 'success'
                        : r.status === 'closed'
                        ? 'destructive'
                        : 'warning'
                    }
                    className="text-2xs"
                  >
                    {r.status ?? 'open'}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Resources teaser */}
      <Card className="border-primary/20 bg-primary/[0.03] shadow-elevated-sm">
        <CardContent className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Learning resources
              </p>
              <p className="text-xs text-muted-foreground">
                Practice papers, study guides and exam tips curated by our team.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/parent-dashboard/resources">
              Browse <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
