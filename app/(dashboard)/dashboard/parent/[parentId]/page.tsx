import { Breadcrumbs } from '@/components/breadcrumbs';
import { ParentForm } from '@/components/forms/parent-form';
import { Prisma } from '@prisma/client';
import { db as prisma } from '@/db/db';
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Tutor', link: '/dashboard/tutor' },
  { title: 'Create', link: '/dashboard/tutor/create' }
];

export default async function Page(props: any) {
  const params = await props.params;
  const id = params.parentId;
  const data = await prisma.user.findUnique({
    where: {
      id: id
    }
  });

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <ParentForm
        //@ts-ignore
        initialData={data ? data : []}
        key={null}
      />
    </>
  );
}
