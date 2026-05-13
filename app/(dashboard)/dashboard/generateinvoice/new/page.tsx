import { Breadcrumbs } from '@/components/breadcrumbs';
import { Prisma } from '@prisma/client';
import { SubjectForm } from '@/components/forms/subject-form';
import { db as prisma } from '@/db/db';
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Subject', link: '/dashboard/subject' },
  { title: 'Create', link: '/dashboard/student/create' }
];

export default async function Page() {
  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <SubjectForm
        //@ts-ignore
        initialData={null}
        key={null}
      />
    </>
  );
}
