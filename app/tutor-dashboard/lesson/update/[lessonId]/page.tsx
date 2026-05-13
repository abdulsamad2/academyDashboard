import { Breadcrumbs } from '@/components/breadcrumbs';
import { LessonForm } from '@/components/forms/lesson-form';
import { db as prisma } from '@/db/db';
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Student', link: '/dashboard/student' },
  { title: 'add lesson', link: '/dashboard/lesson/add' }
];

export default async function Page(props: any) {
  const params = await props.params;
  const id = params.lessonId;
  const data = await prisma.lesson.findUnique({
    where: {
      id: id
    },
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
      <LessonForm
        //@ts-ignore
        initialData={flatObject ? flatObject : undefined}
        key={null}
      />
    </>
  );
}
