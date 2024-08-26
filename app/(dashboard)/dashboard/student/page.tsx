import { getDb } from '@/action/factoryFunction';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { StudentTable } from '@/components/tables/student-tables/student-table';
import { columns } from '@/components/tables/student-tables/columns';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Employee } from '@/constants/data';
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
  const students = await prisma.student.findMany();
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const student = searchParams.search || null;
  const offset = (page - 1) * pageLimit;
  const totalUsers = students.length; //1000
  const pageCount = Math.ceil(totalUsers / pageLimit);
  const fromatedStudents = students.map((student) => ({
    ...student,
    createdAt: new Date(student.createdAt).toLocaleDateString()
  }));

  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Students (${totalUsers})`}
            description="Manage Student)"
          />

          <Link
            href={'/dashboard/student/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />

        <StudentTable
          searchKey="country"
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers}
          data={students ? fromatedStudents : []}
          pageCount={pageCount}
        />
      </div>
    </>
  );
}
