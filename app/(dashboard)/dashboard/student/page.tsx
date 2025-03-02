import { StudentTable } from '@/components/tables/student-tables/student-table';
import { columns } from '@/components/tables/student-tables/columns';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/db/db';
import { getParentSidetutorStudent } from '@/action/AssignTutor';
type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {
     const page = Number(searchParams.page) || 1;
     const pageLimit = Number(searchParams.limit) || 20;

   // Fetch total student count
   const totalUsers = await db.student.count();

   // Fetch paginated students
   const students = await db.student.findMany({
     include: {
       parent: {
         select: {
           name: true,
           email: true,
           phone: true
         }
       }
     }
   });
    //@ts-ignore
  // const totalUsers = students.length; //1000
  const pageCount = Math.ceil(totalUsers / pageLimit);
  const fromatedStudents = await Promise.all(
    students.map(async (student) => {
      const assignedTutors = await getParentSidetutorStudent(student.id);
      return {
        ...student,
        parent: student.parent?.name ?? 'N/A',
        parentEmail: student.parent?.email ?? 'N/A',
        parentPhone: student.parent?.phone ?? 'N/A',
        adminId: student.adminId ?? 'N/A',
        //@ts-ignore
        hoursperWeek: student.sessionFrequency * student.sessionDuration,
        //@ts-ignore
        assignedTutors: assignedTutors.length
          ? //@ts-ignore

            assignedTutors.join(', ')
          : 'No tutor assigned'
      };
    })
  );



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
