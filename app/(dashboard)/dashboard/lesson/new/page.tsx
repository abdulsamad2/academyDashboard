import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, Users, Search } from 'lucide-react';
import { db as prisma } from '@/db/db';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Lessons', link: '/dashboard/lesson' },
  { title: 'New', link: '#' }
];

export default async function Page({
  searchParams
}: {
  searchParams: { studentId?: string; q?: string };
}) {
  // If a student was pre-selected (?studentId=…), jump straight to the form
  if (searchParams.studentId) {
    redirect(`/dashboard/lesson/${searchParams.studentId}`);
  }

  const q = searchParams.q?.trim();
  const students = await prisma.student.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { school: { contains: q, mode: 'insensitive' } }
          ]
        }
      : undefined,
    include: { parent: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Log a lesson"
        description="Pick the student this session was for."
      />

      <Card className="shadow-elevated-sm">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">All students</CardTitle>
          <form
            action="/dashboard/lesson/new"
            method="get"
            className="w-full sm:max-w-xs"
          >
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={q ?? ''}
                placeholder="Search by name or school…"
                className="h-9 pl-9 text-sm"
              />
            </div>
          </form>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {students.length === 0 ? (
            <div className="px-6 pb-6">
              <EmptyState
                icon={Users}
                title={q ? 'No matching students' : 'No students yet'}
                description={
                  q
                    ? 'Try a different search.'
                    : 'Once students are enrolled, you can log lessons for them.'
                }
                className="border-0 bg-transparent py-6"
              />
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {students.map((s) => (
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
                      {s.school ?? '—'} · Parent: {s.parent?.name ?? '—'}
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
                    <Link href={`/dashboard/lesson/${s.id}`}>
                      Log lesson
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
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
