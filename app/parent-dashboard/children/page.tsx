import { Breadcrumbs } from '@/components/breadcrumbs';
import { StudentTable } from '@/components/tables/student-tables/student-table';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/auth';
import { columns } from '../components/column';
import { getParentSidetutorStudent } from '@/action/AssignTutor';
import { db as prisma } from '@/db/db';
import { redirect } from 'next/navigation';

const breadcrumbItems = [
  { title: 'Parent', link: '/parent-dashboard' },
  { title: 'Children', link: '/parent-dashboard/children' }
];

type paramsProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
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

export default async function Page(props: paramsProps) {
  const searchParams = await props.searchParams;
  const session = await auth();
  if (!session?.id) redirect('/auth/signin');
  const parentId = session.id;
  const students = await prisma.student.findMany({ where: { parentId } });

  const studentsCount = students.length;
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;

  const formatStudents = async (
    students: Student[]
  ): Promise<FormattedStudent[]> => {
    return Promise.all(
      students.map(async (student) => {
        let tutor: string[] = ['Tutor Not Assigned'];
        try {
          const tutorData = await getParentSidetutorStudent(student.id);
          if (Array.isArray(tutorData) && tutorData.length > 0) {
            tutor = tutorData.map((t) => String(t));
          }
        } catch (error) {
          console.error(
            `Failed to fetch tutor for student ${student.id}:`,
            error
          );
        }
        return {
          id: student.id,
          name: student.name,
          level: student.class,
          studymode: student.studymode,
          tutor,
          //@ts-ignore
          hoursperWeek: student.sessionFrequency * student.sessionDuration,
          createdAt: student.createdAt.toLocaleDateString('en-US')
        };
      })
    );
  };

  //@ts-ignore
  const sub = await formatStudents(students);
  const pageCount = Math.max(1, Math.ceil(studentsCount / pageLimit));

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Your children"
        description={`${studentsCount} child${
          studentsCount === 1 ? '' : 'ren'
        } enrolled`}
        actions={
          <Button asChild>
            <Link href="/parent-dashboard/children/new">
              <Plus className="mr-2 h-4 w-4" />
              Add child
            </Link>
          </Button>
        }
      />
      <StudentTable
        searchKey=""
        pageNo={page}
        columns={columns}
        totalUsers={studentsCount}
        //@ts-ignore
        data={sub}
        pageCount={pageCount}
      />
    </>
  );
}
