import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import {
  Calendar,
  Edit,
  GraduationCap,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  Star,
  Users
} from 'lucide-react';
import { db as prisma } from '@/db/db';
import { auth } from '@/auth';
import { getAssignedStudent } from '@/action/AssignTutor';
import { getLessonForTutor } from '@/action/addLesson';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function TutorDashboardHome() {
  const session = await auth();
  if (!session?.id) redirect('/auth/signin');
  const id = session.id;

  const [data, students, lessonsResult] = await Promise.all([
    prisma.user.findUnique({ where: { id }, include: { tutor: true } }),
    getAssignedStudent(id),
    getLessonForTutor()
  ]);

  const lessons = Array.isArray(lessonsResult) ? lessonsResult : [];

  // Total hours taught this month
  const firstOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );
  const thisMonthLessons = lessons.filter(
    (l: any) => l.tutorId === id && new Date(l.createdAt) >= firstOfMonth
  );
  const minutesThisMonth = thisMonthLessons.reduce(
    (sum: number, l: any) => sum + (l.totalDuration ?? 0),
    0
  );
  const hoursThisMonth = Math.floor(minutesThisMonth / 60);
  const remainderMinutes = minutesThisMonth % 60;
  const earningsThisMonth = thisMonthLessons.reduce(
    (sum: number, l: any) => sum + (l.totalAmount ?? 0),
    0
  );

  const firstThree = students.slice(0, 5);
  const tutor = data?.tutor as any;
  const subjectsList: string[] = tutor?.subjects ?? [];

  return (
    <>
      <PageHeader
        title={`Welcome back, ${(data?.name ?? 'Tutor').split(' ')[0]}`}
        description="Here’s your teaching activity this month"
        actions={
          <Button asChild>
            <Link href="/tutor-dashboard/lesson/new">
              <Plus className="mr-2 h-4 w-4" />
              Log a lesson
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Hours this month"
          value={`${hoursThisMonth}h ${remainderMinutes}m`}
          icon={Calendar}
          helper={`${thisMonthLessons.length} session${
            thisMonthLessons.length === 1 ? '' : 's'
          }`}
        />
        <StatCard
          label="Earnings (gross)"
          value={`RM ${earningsThisMonth.toLocaleString()}`}
          icon={GraduationCap}
          helper="Before platform fee"
        />
        <StatCard
          label="Active students"
          value={students.length}
          icon={Users}
          helper="Assigned to you"
        />
        <StatCard
          label="Rating"
          value={(tutor?.rating ?? 0).toFixed(1)}
          icon={Star}
          helper="Out of 5.0"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <Card className="shadow-elevated-sm">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-base">My profile</CardTitle>
              <CardDescription>How parents see you</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/tutor-dashboard/profile">
                <Edit className="mr-1.5 h-3.5 w-3.5" />
                Edit
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={tutor?.profilepic ?? ''}
                  alt={data?.name ?? ''}
                />
                <AvatarFallback className="text-lg">
                  {(data?.name?.[0] ?? 'T').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-foreground">
                  {data?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {subjectsList[0] ?? 'Tutor'}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate text-foreground">{data?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span className="text-foreground">{data?.phone}</span>
              </div>
              {data?.city ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-foreground">{data.city}</span>
                </div>
              ) : null}
            </div>

            {subjectsList.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {subjectsList.slice(0, 6).map((s) => (
                  <Badge key={s} variant="secondary">
                    {s}
                  </Badge>
                ))}
                {subjectsList.length > 6 ? (
                  <Badge variant="outline">+{subjectsList.length - 6}</Badge>
                ) : null}
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Students card */}
        <Card className="shadow-elevated-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-base">Your students</CardTitle>
              <CardDescription>
                {students.length} assigned · showing {firstThree.length}
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/tutor-dashboard/students">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {firstThree.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No students yet"
                description="Once parents assign you to a child, they'll appear here."
                className="border-0 bg-transparent py-6"
              />
            ) : (
              <ul className="space-y-2">
                {firstThree.map((s: any, i: number) => (
                  <li
                    key={s.id ?? i}
                    className="flex items-center gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/40"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs">
                        {(s.name?.[0] ?? 'S').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {s.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {s.class ?? s.level ?? 'Student'}
                      </p>
                    </div>
                    <Badge variant="outline" className="hidden sm:inline-flex">
                      {s.studymode ?? 'Mixed'}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card className="shadow-elevated-sm">
        <CardHeader>
          <CardTitle className="text-base">Quick actions</CardTitle>
          <CardDescription>Common tutor tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <ActionTile
              href="/tutor-dashboard/lesson/new"
              icon={Plus}
              accent="bg-primary/10 text-primary"
              title="Log a lesson"
              description="Record a completed session"
            />
            <ActionTile
              href="/tutor-dashboard/tution-jobs"
              icon={MessageSquare}
              accent="bg-info-muted text-info"
              title="Browse jobs"
              description="Find new students to teach"
            />
            <ActionTile
              href="/tutor-dashboard/earnings"
              icon={GraduationCap}
              accent="bg-success-muted text-success"
              title="View earnings"
              description="Track payouts and tax"
            />
            <ActionTile
              href="/tutor-dashboard/resources"
              icon={Calendar}
              accent="bg-warning-muted text-warning"
              title="Resources"
              description="Lesson plans & materials"
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function ActionTile({
  href,
  icon: Icon,
  accent,
  title,
  description
}: {
  href: string;
  icon: any;
  accent: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevated-sm"
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${accent}`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {description}
        </p>
      </div>
    </Link>
  );
}
