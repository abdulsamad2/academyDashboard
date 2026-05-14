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
  AlertTriangle,
  ArrowRight,
  BookOpen,
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

  const [data, students, lessonsResult, recentLessons] = await Promise.all([
    prisma.user.findUnique({ where: { id }, include: { tutor: true } }),
    getAssignedStudent(id),
    getLessonForTutor(),
    prisma.lesson.findMany({
      where: { tutorId: id },
      orderBy: { date: 'desc' },
      take: 5,
      include: { student: { select: { name: true } } }
    })
  ]);

  const lessons = Array.isArray(lessonsResult) ? lessonsResult : [];

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
  // Tutor's earnings = totalHours × tutorAllowance (NOT the tuition fee).
  // Falls back to the legacy 73% rule for items predating the dual-rate change.
  const earningsThisMonth = thisMonthLessons.reduce((sum: number, l: any) => {
    // DB fields can come back as strings — coerce before doing math.
    const allowance =
      l.tutorAllowance !== undefined && l.tutorAllowance !== null
        ? Number(l.tutorAllowance) || 0
        : (Number(l.tutorHourly) || 0) * 0.73;
    return sum + (Number(l.totalHours) || 0) * allowance;
  }, 0);

  const firstThree = students.slice(0, 5);
  const tutor = data?.tutor as any;
  const subjectsList: string[] = tutor?.subjects ?? [];

  // Profile gap detection — surface what's blocking payouts or visibility.
  const profileGaps: { label: string; reason: string }[] = [];
  if (!tutor) {
    profileGaps.push({
      label: 'Create your profile',
      reason: 'You haven’t completed onboarding yet.'
    });
  } else {
    if (!tutor.bank || !tutor.bankaccount)
      profileGaps.push({
        label: 'Add bank details',
        reason: 'Payouts can’t be sent without them.'
      });
    if (!tutor.profilepic)
      profileGaps.push({
        label: 'Add a profile photo',
        reason: 'Profiles with photos get 3× more bookings.'
      });
    if (!tutor.bio || tutor.bio.length < 50)
      profileGaps.push({
        label: 'Write a bio',
        reason: 'Helps parents decide if you’re a fit.'
      });
    if (!subjectsList || subjectsList.length === 0)
      profileGaps.push({
        label: 'Add subjects you teach',
        reason: 'Without subjects, parents can’t find you.'
      });
  }

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

      {profileGaps.length > 0 ? (
        <Card className="border-warning/40 bg-warning-muted/40 shadow-elevated-sm">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  Finish setting up your profile
                </p>
                <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                  {profileGaps.slice(0, 3).map((g) => (
                    <li key={g.label}>
                      <span className="font-medium text-foreground">
                        {g.label}
                      </span>{' '}
                      — {g.reason}
                    </li>
                  ))}
                  {profileGaps.length > 3 ? (
                    <li className="text-muted-foreground">
                      +{profileGaps.length - 3} more
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>
            <Button asChild size="sm">
              <Link href="/tutor-dashboard/profile">
                Complete profile
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

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
          label="Earnings this month"
          value={`RM ${earningsThisMonth.toFixed(2)}`}
          icon={GraduationCap}
          helper="Your allowance"
        />
        <StatCard
          label="Active students"
          value={students.length}
          icon={Users}
          helper="Assigned to you"
        />
        <StatCard
          label="Rating"
          value={(Number(tutor?.rating) || 0).toFixed(1)}
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
                description="Once parents assign you to a child, they’ll appear here."
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
                        {s.subject?.[0] ? ` · ${s.subject[0]}` : ''}
                      </p>
                    </div>
                    <Badge variant="outline" className="hidden sm:inline-flex">
                      {s.studymode ?? 'Mixed'}
                    </Badge>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/tutor-dashboard/lesson/${s.id}`}>
                        Log
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent lessons */}
      <Card className="shadow-elevated-sm">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-base">Recent lessons</CardTitle>
            <CardDescription>Your last 5 logged sessions</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/tutor-dashboard/lesson">View all</Link>
          </Button>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {recentLessons.length === 0 ? (
            <div className="px-6 pb-6">
              <EmptyState
                icon={BookOpen}
                title="No lessons logged yet"
                description="Once you log a lesson, it'll appear here."
                className="border-0 bg-transparent py-6"
              />
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {recentLessons.map((l) => {
                const start = new Date(l.startTime);
                const end = new Date(l.endTime);
                const fmtTime = (d: Date) =>
                  d.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'UTC'
                  });
                return (
                  <li key={l.id} className="flex items-center gap-3 px-6 py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {l.student?.name ?? 'Student'}
                        <span className="ml-1.5 font-normal text-muted-foreground">
                          · {l.subject}
                        </span>
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {new Date(l.date).toLocaleDateString([], {
                          timeZone: 'UTC'
                        })}{' '}
                        · {fmtTime(start)}–{fmtTime(end)}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="hidden sm:inline-flex"
                    >
                      {l.totalDuration ?? 0} min
                    </Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

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
