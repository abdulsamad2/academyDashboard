import { Breadcrumbs } from '@/components/breadcrumbs';
import { ParentForm } from '@/components/forms/parent-form';
import { Prisma } from '@prisma/client';
import { auth } from '@/auth';
import { db as prisma } from '@/db/db';
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Parent', link: '/dashboard/tutor' },
  { title: 'Create', link: '/dashboard/tutor/create' }
];

export default async function Page() {
  const session = await auth();
  //@ts-ignore
  const id = session.id;
  const data = await prisma.user.findUnique({
    where: {
      id: id
    }
  });

  const initialData = { ...data, password: '' };
  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <ParentForm
        //@ts-ignore
        initialData={initialData}
        key={null}
      />
    </>
  );
}
