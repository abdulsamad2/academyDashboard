import { Breadcrumbs } from '@/components/breadcrumbs';
import { StudentTable } from '@/components/tables/student-tables/student-table';
import { columns } from './component/column';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Prisma, PrismaClient } from '@prisma/client';
import { auth } from '@/auth';
import { getAssignedStudent } from '@/action/AssignTutor';
import { cn } from '@/lib/utils';
import { db } from '@/db/db';
const prisma = new PrismaClient();
const totalUsers = 1000;

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Tutor', link: '/dashboard/tuor' }
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {
  const session = await auth();
  //@ts-ignore
  const tutorId = session.id;
  //@ts-ignore
 const students = await getAssignedStudent(tutorId);

 const formattedStudents = await Promise.all(
   students.map(async (student) => {
     // Fetch full student data from database using student.id
     const studentData = await prisma.student.findUnique({
       where: {
         id: student.id
       }
     });

     // Calculate hours per week using the data from studentData
     const sessionFrequency = studentData?.sessionFrequency
       ? parseInt(studentData.sessionFrequency)
       : 0;

     const sessionDuration = studentData?.sessionDuration
       ? parseInt(studentData.sessionDuration)
       : 0;

     const hoursperWeek = sessionFrequency * sessionDuration;

     // Combine all data
     return {
       ...student,
       ...studentData,
       hoursperWeek: hoursperWeek,
       
     };
   })
 );
   

 
  // const fromatedStudents = students.map(
  //   (student: { createdAt: string | number | Date }) => ({
  //     ...student,
  //     createdAt: new Date(student.createdAt).toLocaleDateString()
  //   })
  // );
  const studentsCount = students.length;
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const country = searchParams.search || null;
  const offset = (page - 1) * pageLimit;
  //
  const pageCount = Math.ceil(studentsCount / pageLimit);
  
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <div className="flex items-start justify-between">
          <Heading
            title={`Your Students `}
            description="Manage your Assigned Students"
          />
        </div>
        <Separator />

        <StudentTable
          searchKey="student name"
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers}
          //@ts-ignore
          data={students ? formattedStudents : []}
          pageCount={pageCount}
        />
      </div>
    </>
  );
}
