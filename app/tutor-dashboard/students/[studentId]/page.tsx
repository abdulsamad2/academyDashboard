import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import {
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  Mail,
  Phone,
  Plus,
  User
} from 'lucide-react';

import { auth } from '@/auth';
import { db as prisma } from '@/db/db';
import { getLessonForThisTutorAndStudent } from '@/action/addLesson';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

function formatTime(d: Date | string) {
  return new Date(d).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}
function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}
function formatDuration(mins: number) {
  if (!mins) return '—';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export default async function Page({
  params
}: {
  params: { studentId: string };
}) {
  const session = await auth();
  if (!session?.id) redirect('/auth/signin');
  const tutorId = session.id;
  const studentId = params.studentId;

  // Admins bypass; tutors must be formally assigned to view this student
  if (session.role !== 'admin') {
    const assignment = await prisma.studentTutor.findFirst({
      where: { tutorId, studentId },
      select: { id: true }
    });
    if (!assignment) notFound();
  }

  const [student, lessons] = await Promise.all([
    prisma.student.findUnique({
      where: { id: studentId },
      include: { parent: { select: { name: true, email: true, phone: true } } }
    }),
    getLessonForThisTutorAndStudent(tutorId, studentId)
  ]);

  if (!student) notFound();

  const lessonList = Array.isArray(lessons) ? lessons : [];
  const totalMinutes = lessonList.reduce(
    (sum, l: any) => sum + (l.totalDuration ?? 0),
    0
  );
  const lastSession = lessonList[0];

  return (
    <>
      <Breadcrumbs
        items={[
          { title: 'Tutor', link: '/tutor-dashboard' },
          { title: 'Students', link: '/tutor-dashboard/students' },
          { title: student.name, link: '#' }
        ]}
      />
      <PageHeader
        title={student.name}
        description={`${student.class ?? 'Student'} · ${
          student.studymode ?? 'Mixed'
        }`}
        actions={
          <Button asChild>
            <Link href={`/tutor-dashboard/lesson/new?studentId=${student.id}`}>
              <Plus className="mr-1.5 h-4 w-4" />
              Log lesson
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Lessons delivered"
          value={lessonList.length}
          icon={BookOpen}
        />
        <StatCard
          label="Total hours"
          value={formatDuration(totalMinutes)}
          icon={Clock}
        />
        <StatCard
          label="Last session"
          value={lastSession ? formatDate(lastSession.date) : '—'}
          icon={Calendar}
        />
        <StatCard
          label="Sessions / week"
          value={student.sessionFrequency ?? '—'}
          icon={GraduationCap}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-elevated-sm">
          <CardHeader>
            <CardTitle className="text-base">Student details</CardTitle>
            <CardDescription>What you need to know</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="School" value={student.school} />
            <Row label="Level" value={student.level ?? student.class} />
            <Row
              label="Subjects"
              value={
                <div className="flex flex-wrap justify-end gap-1">
                  {(student.subject ?? []).map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                </div>
              }
            />
            <Row
              label="Session"
              value={`${student.sessionFrequency ?? '—'} × ${
                student.sessionDuration ?? '—'
              }h`}
            />
            <Row label="Age" value={student.age} />
          </CardContent>
        </Card>

        <Card className="shadow-elevated-sm">
          <CardHeader>
            <CardTitle className="text-base">Parent contact</CardTitle>
            <CardDescription>For coordination &amp; scheduling</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">
                {student.parent?.name ?? '—'}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <span className="truncate text-foreground">
                {student.parent?.email ?? '—'}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">
                {student.parent?.phone ?? '—'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elevated-sm">
          <CardHeader>
            <CardTitle className="text-base">Location</CardTitle>
            <CardDescription>For in-person sessions</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-foreground">{student.address ?? '—'}</p>
            <p className="text-muted-foreground">
              {[student.city, student.state].filter(Boolean).join(', ') || '—'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-elevated-sm">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-base">
              Lessons with this student
            </CardTitle>
            <CardDescription>
              {lessonList.length === 0
                ? 'No lessons logged yet'
                : `${lessonList.length} session${
                    lessonList.length === 1 ? '' : 's'
                  } delivered`}
            </CardDescription>
          </div>
          <Button asChild size="sm">
            <Link href={`/tutor-dashboard/lesson/new?studentId=${student.id}`}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Log lesson
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {lessonList.length === 0 ? (
            <div className="px-6 pb-6">
              <EmptyState
                icon={BookOpen}
                title="No lessons yet"
                description="Click ‘Log lesson’ to record your first session with this student."
                className="border-0 bg-transparent py-6"
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Date</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessonList.map((l: any) => (
                  <TableRow key={l.id}>
                    <TableCell className="whitespace-nowrap tabular-nums">
                      {formatDate(l.date)}
                    </TableCell>
                    <TableCell>{l.subject ?? '—'}</TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums text-muted-foreground">
                      {formatTime(l.startTime)} – {formatTime(l.endTime)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums">
                      {formatDuration(l.totalDuration ?? 0)}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {l.description ?? '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/tutor-dashboard/lesson/update/${l.id}`}>
                          Edit
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right text-foreground">{value || '—'}</span>
    </div>
  );
}
