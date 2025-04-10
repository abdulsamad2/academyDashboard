import { getDb } from '@/action/factoryFunction';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Prisma, PrismaClient } from '@prisma/client';
import { SubjectTable } from '@/components/tables/subject-table/student-table';
import { columns } from '@/components/tables/subject-table/columns';
const prisma = new PrismaClient();

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Subjects', link: '/dashboard/subject' }
];

type paramsProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function page(props: paramsProps) {
  const searchParams = await props.searchParams;
  const subject = await prisma.subject.findMany();
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  
  const totalUsers = subject.length;
  const pageCount = Math.ceil(totalUsers / pageLimit);

  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Subjects (${totalUsers})`}
            description="Manage and organize subjects"
          />

          <Link
            href={'/dashboard/subject/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />

        <SubjectTable
          searchKey="name"
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers}
          //@ts-ignore
          data={subject ? subject : []}
          pageCount={pageCount}
        />
      </div>
    </>
  );
}
