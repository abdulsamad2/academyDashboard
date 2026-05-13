import { Breadcrumbs } from '@/components/breadcrumbs';
import { LessonForm } from '@/components/forms/lesson-form';
import { db as prisma } from '@/db/db';
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Student', link: '/dashboard/student' },
  { title: 'add lesson', link: '/dashboard/lesson/add' }
];

export default async function Page({ params }: any) {
  const id = params.studentId;
  const data = await prisma.student.findUnique({
    where: {
      id: id
    }
  });

  const formatDate = {
    ...data,
    level: data?.class,
    gender: data?.sex
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <LessonForm
        //@ts-ignore
        initialData={formatDate ? formatDate : undefined}
        key={null}
      />
    </>
  );
}
