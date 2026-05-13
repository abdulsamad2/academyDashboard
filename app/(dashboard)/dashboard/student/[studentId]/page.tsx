import { Breadcrumbs } from '@/components/breadcrumbs';
import { StudentForm } from '@/components/forms/student-form';
import { getLessonForStudent } from '@/action/addLesson';
import { db as prisma } from '@/db/db';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Student', link: '/dashboard/student' },
  { title: 'Edit', link: '#' }
];

export default async function Page(props: any) {
  const params = await props.params;
  const subject = await prisma.subject.findMany();
  const id = params.studentId;
  const data = await prisma.student.findUnique({ where: { id } });
  await getLessonForStudent(id);

  const formatDate = {
    ...data,
    level: data?.class,
    gender: data?.sex
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <StudentForm
        //@ts-ignore
        studentId={id}
        //@ts-ignore
        initialData={formatDate ? formatDate : undefined}
        subject={subject}
        key={null}
      />
    </>
  );
}
