import { StudentTable } from '@/components/tables/student-tables/student-table';
import { columns } from '@/components/tables/student-tables/columns';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {
  const students = await prisma.student.findMany({
    include: {
      parent: {
        select: {
          name: true,
          email: true,
          phone: true
        }
      },
      
    }
    
  });
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
    //@ts-ignore
  const totalUsers = students.length; //1000
  const pageCount = Math.ceil(totalUsers / pageLimit);
  const fromatedStudents = students.map((student) => ({
    ...student,
    //@ts-ignore
    parent: student.parent.name,
    //@ts-ignore
    parentEmail: student.parent.email,
    parentPhone: student.parent.phone,
        //@ts-ignore

   hoursperWeek : student.sessionFrequency * student.sessionDuration
  }));

  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">

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
          searchKey="name"
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
