import { Breadcrumbs } from '@/components/breadcrumbs';
import { TutorForm } from '@/components/forms/tutor-form';
import { db as prisma } from '@/db/db';
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Tutor', link: '/dashboard/tutor' },
  { title: 'Create', link: '/dashboard/tutor/create' }
];

export default async function Page() {
  const subject = await prisma.subject.findMany();
  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <TutorForm subject={subject} initialData={null} />
    </>
  );
}
