import { Breadcrumbs } from '@/components/breadcrumbs';
import { StudentForm } from '@/components/forms/student-form';
import { db as prisma } from '@/db/db';
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Student', link: '/dashboard/student' },
  { title: 'Create', link: '/dashboard/student/create' }
];

export default async function Page(props: any) {
  const params = await props.params;
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
  // @ts-ignore
  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <StudentForm
        //@ts-ignore
        initialData={formatDate ? formatDate : undefined}
        key={null}
      />
    </>
  );
}
