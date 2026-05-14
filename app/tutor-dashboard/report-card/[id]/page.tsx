import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getReportCardById } from '@/action/reportCard';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import { ReportCardEditor } from './components/report-card-editor';

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.id) redirect('/auth/signin');

  const { id } = await params;
  const card = await getReportCardById(id);
  if (!card) notFound();

  const breadcrumbItems = [
    { title: 'Tutor', link: '/tutor-dashboard' },
    { title: 'Report Cards', link: '/tutor-dashboard/report-card' },
    {
      title: card.student?.name ?? 'Card',
      link: `/tutor-dashboard/report-card/${card.id}`
    }
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title={`${card.student?.name ?? 'Student'} · ${card.subject}`}
        description="Fill in each quarter as you grade it, then save and download the report."
      />
      <ReportCardEditor card={card} />
    </>
  );
}
