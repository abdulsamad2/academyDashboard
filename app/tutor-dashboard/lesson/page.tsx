import { Breadcrumbs } from '@/components/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { columns } from '@/components/tables/lesson-table/columns';
import { LessonTable } from '@/components/tables/lesson-table/lesson-table';
import {
  getLessonForThisTutorAndStudent,
  getTotalDurationForStudentandTutorThisMonth
} from '@/action/addLesson';
import { auth } from '@/auth';
import { db as prisma } from '@/db/db';
import { redirect } from 'next/navigation';

const breadcrumbItems = [
  { title: 'Tutor', link: '/tutor-dashboard' },
  { title: 'Lessons', link: '/tutor-dashboard/lesson' }
];

type paramsProps = {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
};

export default async function Page(props: paramsProps) {
  const searchParams = await props.searchParams;
  const session = await auth();
  if (!session?.id) redirect('/auth/signin');

  const id: string | undefined = searchParams.id;
  let lessons: any[] = [];
  let totalDuration: { hours: number; minutes: number } | null = null;

  if (id) {
    // Filtered to a specific student
    lessons = (await getLessonForThisTutorAndStudent(session.id, id)) ?? [];

    const lessonData: any = await getTotalDurationForStudentandTutorThisMonth(
      id,
      session.id
    );
    totalDuration = lessonData?.reduce(
      (
        acc: { hours: number; minutes: number },
        item: { totalDuration: number }
      ) => {
        acc.hours += Math.floor(item.totalDuration / 60);
        acc.minutes += item.totalDuration % 60;
        return acc;
      },
      { hours: 0, minutes: 0 }
    );
    if (totalDuration) {
      totalDuration.hours += Math.floor(totalDuration.minutes / 60);
      totalDuration.minutes = totalDuration.minutes % 60;
    }
  } else {
    // Restrict to lessons for students formally assigned to this tutor
    const assignments = await prisma.studentTutor.findMany({
      where: { tutorId: session.id },
      select: { studentId: true }
    });
    const assignedIds = assignments.map((a) => a.studentId);

    lessons = assignedIds.length
      ? await prisma.lesson.findMany({
          where: {
            tutorId: session.id,
            studentId: { in: assignedIds }
          },
          include: { student: true, tutor: true },
          orderBy: { date: 'desc' }
        })
      : [];
  }

  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const totalUsers = lessons.length;
  const pageCount = Math.max(1, Math.ceil(totalUsers / pageLimit));

  const formatedData =
    lessons.length > 0 &&
    lessons.map((item: any) => {
      const startTime = new Date(item.startTime);
      const endTime = new Date(item.endTime);
      return {
        ...item,
        name: item.student?.name ?? 'Unknown',
        tutor: item.tutor?.name ?? item.tutor?.email ?? '—',
        phone: item.tutor?.phone ?? '',
        startTime: startTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        endTime: endTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        date: new Date(item.date).toLocaleDateString(),
        subject: item.subject,
        classDuration: `${item.totalDuration} minutes`
      };
    });

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Lessons"
        description={
          id
            ? `Filtered to one student · ${currentMonth}`
            : `${totalUsers} lesson${totalUsers === 1 ? '' : 's'} you delivered`
        }
      />
      {id && (
        <Card className="shadow-elevated-sm">
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total this month
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {totalDuration?.hours ?? 0}h {totalDuration?.minutes ?? 0}m
            </p>
            <p className="text-xs text-muted-foreground">{currentMonth}</p>
          </CardContent>
        </Card>
      )}
      <LessonTable
        searchKey="name"
        pageNo={page}
        columns={columns}
        totalUsers={totalUsers}
        //@ts-ignore
        data={formatedData ? formatedData : []}
        pageCount={pageCount}
      />
    </>
  );
}
