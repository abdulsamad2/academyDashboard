import { Breadcrumbs } from '@/components/breadcrumbs';
import { UserClient } from '@/components/tables/user-tables/client';
import { db as prisma } from '@/db/db';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Users', link: '/dashboard/user' }
];

export default async function Page() {
  const users = await prisma.user.findMany();
  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <UserClient data={users} />
    </>
  );
}
