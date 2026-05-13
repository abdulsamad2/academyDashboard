import { StudentTable } from '@/components/tables/student-tables/student-table';
import { columns } from '@/components/tables/student-tables/columns';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/db/db';
import { getParentSidetutorStudent } from '@/action/AssignTutor';

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 20;

  const totalUsers = await db.student.count();

  const students = await db.student.findMany({
    include: {
      parent: { select: { name: true, email: true, phone: true } }
    }
  });

  const pageCount = Math.ceil(totalUsers / pageLimit);
  const formatted = await Promise.all(
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
      <PageHeader
        title="Students"
        description={`${totalUsers} student${
          totalUsers === 1 ? '' : 's'
        } enrolled`}
        actions={
          <Button asChild>
            <Link href="/dashboard/student/new">
              <Plus className="mr-2 h-4 w-4" />
              Add student
            </Link>
          </Button>
        }
      />
      <StudentTable
        searchKey="name"
        pageNo={page}
        columns={columns}
        totalUsers={totalUsers}
        //@ts-ignore
        data={students ? formatted : []}
        pageCount={pageCount}
      />
    </>
  );
}
