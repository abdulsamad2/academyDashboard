import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, FileText, Users } from 'lucide-react';
import { auth } from '@/auth';
import { getAssignedStudent } from '@/action/AssignTutor';
import { getReportCardsForTutor } from '@/action/reportCard';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { NewReportCardForm } from './components/new-report-card-form';

const breadcrumbItems = [
  { title: 'Tutor', link: '/tutor-dashboard' },
  { title: 'Report Cards', link: '/tutor-dashboard/report-card' }
];

const QUARTERS = ['diagnostic', 'q1', 'q2', 'q3', 'q4'] as const;

export default async function Page() {
  const session = await auth();
  if (!session?.id) redirect('/auth/signin');

  const [cards, students] = await Promise.all([
    getReportCardsForTutor(),
    getAssignedStudent(session.id)
  ]);

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Report cards"
        description="Maintain a report card per student and subject — fill in each quarter as you grade it."
      />

      <Card className="shadow-elevated-sm">
        <CardHeader>
          <CardTitle className="text-base">New report card</CardTitle>
          <CardDescription>
            Pick a student and subject. If a card already exists for that pair,
            you&apos;ll be taken straight to it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewReportCardForm
            students={students.map((s: any) => ({
              id: s.id,
              name: s.name,
              subject: s.subject
            }))}
          />
        </CardContent>
      </Card>

      <Card className="shadow-elevated-sm">
        <CardHeader>
          <CardTitle className="text-base">Your report cards</CardTitle>
          <CardDescription>
            {cards.length} card{cards.length === 1 ? '' : 's'}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {cards.length === 0 ? (
            <div className="px-6 pb-6">
              <EmptyState
                icon={FileText}
                title="No report cards yet"
                description="Create one above to start tracking a student's quarterly results."
                className="border-0 bg-transparent py-6"
              />
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {cards.map((c) => {
                const filled = QUARTERS.filter(
                  (q) => (c as any)[q] !== null && (c as any)[q] !== undefined
                ).length;
                return (
                  <li key={c.id} className="flex items-center gap-3 px-6 py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {c.student?.name ?? 'Student'}
                        <span className="ml-1.5 font-normal text-muted-foreground">
                          · {c.subject}
                        </span>
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        Updated{' '}
                        {new Date(c.updatedAt).toLocaleDateString([], {
                          timeZone: 'UTC'
                        })}
                      </p>
                    </div>
                    <Badge
                      variant={filled === 5 ? 'secondary' : 'outline'}
                      className="hidden sm:inline-flex"
                    >
                      {filled}/5 quarters
                    </Badge>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/tutor-dashboard/report-card/${c.id}`}>
                        Open
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {students.length === 0 ? (
        <Card className="shadow-elevated-sm">
          <CardContent className="p-4">
            <EmptyState
              icon={Users}
              title="No assigned students"
              description="Once an admin assigns you to a student, you can create their report card here."
              className="border-0 bg-transparent py-4"
            />
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}
