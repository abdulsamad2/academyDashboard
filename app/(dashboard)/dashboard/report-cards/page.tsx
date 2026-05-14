import { FileText } from 'lucide-react';
import { getAllReportCards } from '@/action/reportCard';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { DownloadReportCardButton } from './components/download-report-card-button';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Report Cards', link: '/dashboard/report-cards' }
];

const QUARTERS = ['diagnostic', 'q1', 'q2', 'q3', 'q4'] as const;

export default async function Page() {
  const cards = await getAllReportCards();

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Report cards"
        description="Every report card maintained by tutors. Download any as a PDF."
      />

      <Card className="shadow-elevated-sm">
        <CardHeader>
          <CardTitle className="text-base">All report cards</CardTitle>
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
                description="Once tutors create report cards for their students, they'll appear here."
                className="border-0 bg-transparent py-6"
              />
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {cards.map((c) => {
                const filled = QUARTERS.filter(
                  (q) => (c as any)[q] !== null && (c as any)[q] !== undefined
                ).length;
                const safeName = (c.student?.name ?? 'student')
                  .trim()
                  .replace(/[^a-z0-9]+/gi, '-');
                const safeSubject = c.subject.replace(/[^a-z0-9]+/gi, '-');
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
                        Tutor: {c.tutor?.name ?? '—'} · updated{' '}
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
                    <DownloadReportCardButton
                      id={c.id}
                      filename={`report-card-${safeName}-${safeSubject}.pdf`}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  );
}
