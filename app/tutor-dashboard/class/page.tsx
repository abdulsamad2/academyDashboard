import { Breadcrumbs } from '@/components/breadcrumbs';
import { StudentTable } from '@/components/tables/student-tables/student-table';
import { columns } from '@/components/tables/tutor-tables/columns';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const totalUsers = 1000;

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Tutor', link: '/dashboard/Tutor' }
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {
  const session = await auth();
  //@ts-ignore
  const parentId = session.id;
  const students = await prisma.student.findMany({
    where: { parentId }
  });
  const fromatedStudents = students.map((student) => ({
    ...student,
    createdAt: new Date(student.createdAt).toLocaleDateString()
  }));
  const studentsCount = students.length;
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const country = searchParams.search || null;
  const offset = (page - 1) * pageLimit;

  const pageCount = Math.ceil(studentsCount / pageLimit);
  // const employee: Employee[] = employeeRes.users;
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Your Children `}
            description="Manage your children"
          />

          <Link
            href={'/parent-dashboard/children/new'}
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
          //@ts-ignore
          data={students ? fromatedStudents : []}
          pageCount={pageCount}
        />
      </div>
    </>
  );
}
