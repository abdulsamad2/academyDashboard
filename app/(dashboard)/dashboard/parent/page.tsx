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
  const parents = await prisma.user.findMany({
    where: {
      role: 'parent'
    },
    include: {
      parent: true
    }
  });
  const fromatedParents = parents.map((parent) => ({
    ...parent,
    createdAt: new Date(parent.createdAt).toLocaleDateString()
  }));
  console.log(parents)

  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const country = searchParams.search || null;
  const offset = (page - 1) * pageLimit;

  const totalUsers = parents.length; //1000
  const pageCount = Math.ceil(totalUsers / pageLimit);
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Parents (${totalUsers})`}
            description="Manage parent)"
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
          searchKey="country"
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers}
          //@ts-ignore
          data={fromatedParents?fromatedParents:[]}
          pageCount={pageCount}
        />
      </div>
    </>
  );
}
