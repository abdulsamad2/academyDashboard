import { Breadcrumbs } from '@/components/breadcrumbs';
import { StudentForm } from '@/components/forms/student-form';
import { getUserById } from '@/action/userRegistration';
import { auth } from '@/auth';
import { db as prisma } from '@/db/db';
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Student', link: '/dashboard/student' },
  { title: 'Create', link: '/dashboard/student/create' }
];

export default async function Page() {
  const subject = await prisma.subject.findMany();

  // filter user email phone
  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <StudentForm
        initialData={null}
        key={null}
        subject={subject}
        studentId={null}
      />
    </>
  );
}
