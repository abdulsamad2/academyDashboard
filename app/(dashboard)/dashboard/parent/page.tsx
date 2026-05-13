import { Breadcrumbs } from '@/components/breadcrumbs';
import { ParentTable } from '@/components/tables/parent-tables/parent-table';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { columns } from '@/components/tables/parent-tables/columns';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Prisma } from '@prisma/client';
import { db as prisma } from '@/db/db';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Parent', link: '/dashboard/parent' }
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const searchQuery = searchParams.search || '';

  const baseQuery = {
    where: {
      role: 'parent',
      ...(searchQuery && typeof searchQuery === 'string'
        ? {
            OR: [
              {
                name: {
                  contains: searchQuery,
                  mode: 'insensitive' as Prisma.QueryMode
                }
              },
              {
                adminId: {
                  contains: searchQuery,
                  mode: 'insensitive' as Prisma.QueryMode
                }
              }
            ]
          }
        : {})
    },
    include: {
      Student: { select: { id: true, name: true } }
    },
    orderBy: { createdAt: 'desc' }
  };

  //@ts-ignore
  const parents = await prisma.user.findMany(baseQuery);
  const totalUsers = await prisma.user.count({
    //@ts-ignore
    where: baseQuery.where
  });

  const formattedParents = parents.map((parent) => ({
    ...parent,
    //@ts-ignore
    students: parent.Student.map((student) => student.name),
    createdAt: new Date(parent.createdAt).toLocaleDateString()
  }));

  const pageCount = Math.ceil(totalUsers / pageLimit);

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Parents"
        description={`${totalUsers} parent${
          totalUsers === 1 ? '' : 's'
        } on your platform`}
        actions={
          <Button asChild>
            <Link href="/dashboard/parent/new">
              <Plus className="mr-2 h-4 w-4" />
              Add parent
            </Link>
          </Button>
        }
      />
      <ParentTable
        searchKey="name"
        pageNo={page}
        columns={columns}
        totalUsers={totalUsers}
        //@ts-ignore
        data={formattedParents ? formattedParents : []}
        pageCount={pageCount}
      />
    </>
  );
}
