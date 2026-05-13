import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, Users } from 'lucide-react';
import { auth } from '@/auth';
import { getAssignedStudent } from '@/action/AssignTutor';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const breadcrumbItems = [
  { title: 'Tutor', link: '/tutor-dashboard' },
  { title: 'Lessons', link: '/tutor-dashboard/lesson' },
  { title: 'New', link: '#' }
];

export default async function Page(props: {
  searchParams: Promise<{ studentId?: string }>;
}) {
  const searchParams = await props.searchParams;
  const session = await auth();
  if (!session?.id) redirect('/auth/signin');

  // If a student was pre-selected (?studentId=…), jump straight to the form
  if (searchParams.studentId) {
    redirect(`/tutor-dashboard/lesson/${searchParams.studentId}`);
  }

  const students = await getAssignedStudent(session.id);

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Log a lesson"
        description="Pick the student this session was for. You can only log lessons for students assigned to you."
      />

      {students.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No assigned students yet"
          description="Once admin assigns you to a student, they'll appear here so you can log lessons."
        />
      ) : (
        <Card className="shadow-elevated-sm">
          <CardHeader>
            <CardTitle className="text-base">Your students</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <ul className="divide-y divide-border/60">
              {students.map((s: any) => (
                <li key={s.id} className="flex items-center gap-3 px-6 py-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-2xs font-semibold text-primary">
                      {(s.name?.[0] ?? 'S').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {s.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {s.school ?? '—'} · {s.class ?? s.level ?? 'Student'}
                    </p>
                  </div>
                  {s.subject && s.subject.length ? (
                    <Badge
                      variant="secondary"
                      className="hidden sm:inline-flex"
                    >
                      {s.subject[0]}
                      {s.subject.length > 1 ? ` +${s.subject.length - 1}` : ''}
                    </Badge>
                  ) : null}
                  <Button asChild size="sm">
                    <Link href={`/tutor-dashboard/lesson/${s.id}`}>
                      Log lesson
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </>
  );
}
