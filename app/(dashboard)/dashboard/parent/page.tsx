import { Breadcrumbs } from '@/components/breadcrumbs';
import { ParentTable } from '@/components/tables/parent-tables/parent-table';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { columns } from '@/components/tables/parent-tables/columns';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Parent', link: '/dashboard/parent' }
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const searchQuery = searchParams.search || '';
  const offset = (page - 1) * pageLimit;

  // Create a base query
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
      Student: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  };

  // Execute the query
  //@ts-ignore
  const parents = await prisma.user.findMany(baseQuery);

  // Get the total count for pagination
  const totalUsers = await prisma.user.count({
    //@ts-ignore
    where: baseQuery.where
  });

  const formattedParents = parents.map((parent) => ({
    ...parent,
    // converting students to array of string to make it work on combined column
    //@ts-ignore
    students: parent.Student.map((student) => student.name),
    createdAt: new Date(parent.createdAt).toLocaleDateString()
  }));

  const pageCount = Math.ceil(totalUsers / pageLimit);
  
  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Parents (${totalUsers})`}
            description="Manage parents"
          />

          <Link
            href={'/dashboard/parent/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <ParentTable
          searchKey="name"
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers}
          //@ts-ignore
          data={formattedParents ? formattedParents : []}
          pageCount={pageCount}
        />
      </div>
    </>
  );
}