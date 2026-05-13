import { Breadcrumbs } from '@/components/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { MessageSquare } from 'lucide-react';
import { getJobs } from '@/action/jobActions';
import TutorRequests from './components/TutorRequests';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Inquiries', link: '/dashboard/inquiries' }
];

export default async function Page() {
  const tutorRequests = await getJobs();

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Inquiries"
        description={`${tutorRequests.length} tutor request${
          tutorRequests.length === 1 ? '' : 's'
        } from parents`}
      />
      {tutorRequests.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No inquiries yet"
          description="When parents request a tutor, you’ll see their requests here so you can match them."
        />
      ) : (
        <TutorRequests
          //@ts-ignore
          tutorRequests={tutorRequests}
        />
      )}
    </>
  );
}
