import { Breadcrumbs } from '@/components/breadcrumbs';
import { StudentTable } from '@/components/tables/student-tables/student-table';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';
import { columns } from '../components/column';
import { getParentSidetutorStudent, getTutor } from '@/action/AssignTutor';
const prisma = new PrismaClient();
const totalUsers = 1000;

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Parent', link: '/dashboard/parent' }
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;

  };
};
type Student = {
  id: string;
  name: string;
  class: string;
  studymode: string;
  createdAt: Date;
};

type FormattedStudent = {
  id: string;
  name: string;
  level: string;
  studymode: string;
  tutor: string[];
  createdAt: string;
};

export default async function page({ searchParams }: paramsProps) {
  const session = await auth();
  //@ts-ignore
  const parentId = session?.id;
  const students = await prisma.student.findMany({
    where: { parentId }

  });


  const studentsCount = students.length;
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const formatStudents = async (students: Student[]): Promise<FormattedStudent[]> => {
    try {
      const formattedStudents = await Promise.all(
        students.map(async (student) => {
          let tutor: string[] = ['Tutor Not Assigned'];
          try {
            const tutorData = await getParentSidetutorStudent(student.id);
            if (Array.isArray(tutorData) && tutorData.length > 0) {
              tutor = tutorData.map((t) => String(t)); // Ensure all tutors are strings
            }
          } catch (error) {
            console.error(`Failed to fetch tutor for student ${student.id}:`, error);
          }
  
          return {
            id: student.id,
            name: student.name,
            level: student.class,
            studymode: student.studymode,
            tutor,
            //@ts-ignore
            hoursperWeek : student.sessionFrequency * student.sessionDuration,
            createdAt: student.createdAt.toLocaleDateString("en-US"),
          };
        })
      );
  
      return formattedStudents;
    } catch (error) {
      console.error("Error formatting students:", error);
      throw error;
    }
  };
  

  const sub = await formatStudents(students);
  const pageCount = Math.ceil(studentsCount / pageLimit);
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
          searchKey=""
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers}
          //@ts-ignore
          data={sub}
          pageCount={pageCount}
        />
      </div>
    </>
  );
}
