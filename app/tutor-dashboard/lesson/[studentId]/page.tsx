import { Breadcrumbs } from '@/components/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import { LessonForm } from '@/components/forms/lesson-form';
import { db as prisma } from '@/db/db';

const breadcrumbItems = [
  { title: 'Tutor', link: '/tutor-dashboard' },
  { title: 'Lessons', link: '/tutor-dashboard/lesson' },
  { title: 'Log a lesson', link: '#' }
];

export default async function Page(props: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await props.params;
  const data = await prisma.student.findUnique({
    where: { id: studentId }
  });

  const formatDate = {
    ...data,
    level: data?.class,
    gender: data?.sex
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Log a lesson"
        description={
          data?.name
            ? `Record a completed session with ${data.name}.`
            : 'Record a completed tutoring session.'
        }
      />
      <LessonForm
        //@ts-ignore
        initialData={formatDate ? formatDate : undefined}
      />
    </>
  );
}
