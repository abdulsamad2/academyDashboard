import { Breadcrumbs } from '@/components/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import { LessonForm } from '@/components/forms/lesson-form';
import { db as prisma } from '@/db/db';

const breadcrumbItems = [
  { title: 'Tutor', link: '/tutor-dashboard' },
  { title: 'Lessons', link: '/tutor-dashboard/lesson' },
  { title: 'Edit lesson', link: '#' }
];

export default async function Page(props: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await props.params;
  const data = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      student: {
        select: {
          name: true,
          id: true,
          subject: true
        }
      }
    }
  });

  const flatObject = {
    ...data,
    lessonId: data?.id,
    subj: data?.subject,
    studentId: data?.student?.id,
    date: data?.date.toISOString().split('T')[0],
    subject: data?.student?.subject
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Edit lesson"
        description={
          data?.student?.name
            ? `Update this session with ${data.student.name}.`
            : 'Update the details of this lesson.'
        }
      />
      <LessonForm
        //@ts-ignore
        initialData={flatObject ? flatObject : undefined}
      />
    </>
  );
}
