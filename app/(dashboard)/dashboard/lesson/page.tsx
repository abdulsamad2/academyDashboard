import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { columns } from '@/components/tables/lesson-table/columns';
import { LessonTable } from '@/components/tables/lesson-table/lesson-table';
import {
  getLessonForStudent,
  getLessons,
  getTotalDurationByMonth
} from '@/action/addLesson';
import MonthYearPicker from '@/components/monthYearPicker';
import { Card, CardContent } from '@/components/ui/card';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Lessons', link: '/dashboard/lesson' }
];

type paramsProps = {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
};

export default async function Page(props: paramsProps) {
  const searchParams = await props.searchParams;
  const id: string | undefined = searchParams.id;
  const month = searchParams.month ? parseInt(searchParams.month) : undefined;
  const year = searchParams.year ? parseInt(searchParams.year) : undefined;

  let lesson;
  let lessonData: any = [];

  if (id) {
    lessonData = await getTotalDurationByMonth(id, month, year);
  }

  const totalDuration = lessonData?.reduce(
    (
      acc: { hours: number; minutes: number },
      item: { totalDuration: number }
    ) => {
      const hours = Math.floor(item.totalDuration / 60);
      const minutes = item.totalDuration % 60;
      acc.hours += hours;
      acc.minutes += minutes;
      return acc;
    },
    { hours: 0, minutes: 0 }
  );

  if (totalDuration) {
    totalDuration.hours += Math.floor(totalDuration.minutes / 60);
    totalDuration.minutes = totalDuration.minutes % 60;
  }

  if (id) {
    lesson = await getLessonForStudent(id, month, year);
  } else {
    lesson = await getLessons();
  }

  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;

  //@ts-ignore
  const totalUsers = lesson.length;
  const pageCount = Math.ceil(totalUsers / pageLimit);

  const formatedData =
    lesson.length > 0 &&
    lesson.map((item) => {
      const startTime = new Date(item.startTime);
      const endTime = new Date(item.endTime);
      return {
        ...item,
        studentAdminId: item.student.adminId,
        name: item.student.name,
        tutor: item.tutor.name || item.tutor.email,
        tutorAdminId: item.tutor.adminId || 'NA',
        phone: item.tutor.phone,
        startTime: startTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'UTC'
        }),
        endTime: endTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'UTC'
        }),
        date: new Date(item.date).toLocaleDateString([], { timeZone: 'UTC' }),
        subject: item.subject,
        classDuration: `${item.totalDuration} minutes`
      };
    });

  const selectedMonthNumber =
    month !== undefined ? month : new Date().getMonth();
  const selectedYear = year !== undefined ? year : new Date().getFullYear();
  const selectedMonthName = new Date(
    selectedYear,
    selectedMonthNumber,
    1
  ).toLocaleString('default', { month: 'long' });

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Lessons"
        description={
          id
            ? `Filtered to one student · ${selectedMonthName} ${selectedYear}`
            : `${totalUsers} lesson${
                totalUsers === 1 ? '' : 's'
              } across all students`
        }
        actions={
          id ? (
            <Button asChild>
              <Link
                href={`generateinvoice/${id}?month=${selectedMonthNumber}&year=${selectedYear}`}
              >
                <Plus className="mr-2 h-4 w-4" />
                Generate invoice
              </Link>
            </Button>
          ) : undefined
        }
      />

      {id && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="shadow-elevated-sm">
            <CardContent className="p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total this month
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                {totalDuration?.hours ?? 0}h {totalDuration?.minutes ?? 0}m
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedMonthName} {selectedYear}
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-elevated-sm sm:col-span-2">
            <CardContent className="p-4">
              <MonthYearPicker
                studentId={id}
                initialMonth={selectedMonthNumber}
                initialYear={selectedYear}
              />
            </CardContent>
          </Card>
        </div>
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
