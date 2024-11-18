import { Breadcrumbs } from '@/components/breadcrumbs';
import { UserClient } from '@/components/tables/user-tables/client';
import {  PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'User', link: '/dashboard/user' }
];
export default async function page() {
  const users = await prisma.user.findMany();

  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <UserClient data={users} />
      </div>
    </>
  );
}
