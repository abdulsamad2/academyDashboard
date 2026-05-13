import { Breadcrumbs } from '@/components/breadcrumbs';
import { StudentTable } from '@/components/tables/student-tables/student-table';
import { columns } from './component/column';
import { PageHeader } from '@/components/ui/page-header';
import { auth } from '@/auth';
import { getAssignedStudent } from '@/action/AssignTutor';
import { db as prisma } from '@/db/db';
import { redirect } from 'next/navigation';

const breadcrumbItems = [
  { title: 'Tutor', link: '/tutor-dashboard' },
  { title: 'Students', link: '/tutor-dashboard/students' }
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ searchParams }: paramsProps) {
  const session = await auth();
  if (!session?.id) redirect('/auth/signin');
  const tutorId = session.id;
  const students = await getAssignedStudent(tutorId);

  const formattedStudents = await Promise.all(
    students.map(async (student) => {
      const studentData = await prisma.student.findUnique({
        where: { id: student.id }
      });
      const sessionFrequency = studentData?.sessionFrequency
        ? parseInt(studentData.sessionFrequency)
        : 0;
      const sessionDuration = studentData?.sessionDuration
        ? parseInt(studentData.sessionDuration)
        : 0;
      return {
        ...student,
        ...studentData,
        hoursperWeek: sessionFrequency * sessionDuration
      };
    })
  );

  const studentsCount = students.length;
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const pageCount = Math.max(1, Math.ceil(studentsCount / pageLimit));

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Your students"
        description={`${studentsCount} student${
          studentsCount === 1 ? '' : 's'
        } assigned to you`}
      />
      <StudentTable
        searchKey="student name"
        pageNo={page}
        columns={columns}
        totalUsers={studentsCount}
        //@ts-ignore
        data={students ? formattedStudents : []}
        pageCount={pageCount}
      />
    </>
  );
}
