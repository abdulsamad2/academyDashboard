import { Breadcrumbs } from '@/components/breadcrumbs';
import { ParentForm } from '@/components/forms/parent-form';
import { Prisma } from '@prisma/client';
import { db as prisma } from '@/db/db';
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Tutor', link: '/dashboard/tutor' },
  { title: 'Create', link: '/dashboard/tutor/create' }
];

export default async function Page() {
  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <ParentForm initialData={null} key={null} />
    </>
  );
}
