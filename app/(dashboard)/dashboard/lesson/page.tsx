import { Breadcrumbs } from '@/components/breadcrumbs';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useColumns } from '@/components/tables/lesson-table/columns';
import { LessonTable } from '@/components/tables/lesson-table/lesson-table';
import {
  getLessonForStudent,
  getLessons,
  getTotalDurationByMonth
} from '@/action/addLesson';
import MonthYearPicker from '@/components/monthYearPicker';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Lessons', link: '/dashboard/lesson' }
];

type paramsProps = {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
};

export default async function page(props: paramsProps) {
  const searchParams = await props.searchParams;
  const id: string | undefined = searchParams.id;
  const month = searchParams.month ? parseInt(searchParams.month) : undefined;
  const year = searchParams.year ? parseInt(searchParams.year) : undefined;

  let lesson;
  let lessonData: any = [];

  // Use the updated function with month and year parameters
  if (id) {
    lessonData = await getTotalDurationByMonth(id, month, year);
  }

  // Calculate total hours and minutes for this student across all subjects
  const totalDuration = lessonData?.reduce(
    (
      acc: { hours: number; minutes: number },
      item: { totalDuration: number }
    ) => {
      const hours = Math.floor(item.totalDuration / 60);
      const minutes = item.totalDuration % 60;

      // Accumulate hours and minutes separately
      acc.hours += hours;
      acc.minutes += minutes;

      return acc;
    },
    { hours: 0, minutes: 0 }
  );

  // Adjust minutes to be in proper hours and minutes format
  if (totalDuration) {
    totalDuration.hours += Math.floor(totalDuration.minutes / 60);
    totalDuration.minutes = totalDuration.minutes % 60;
  }

  // Fetch lessons with filters
  if (id) {
    // Use the updated function with month and year parameters
    lesson = await getLessonForStudent(id, month, year);
  } else {
    lesson = await getLessons();
  }

  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;

  //@ts-ignore
  const totalUsers = lesson.length; //1000
  const pageCount = Math.ceil(totalUsers / pageLimit);

  const formatedData =
    lesson.length > 0 &&
    lesson.map((item) => {
      const startTime = new Date(item.startTime);
      const endTime = new Date(item.endTime);

      return {
        ...item,
        studentAdminId: item.student.adminId || 'N/A',
        name: item.student.name,
        tutor: item.tutor.name || item.tutor.email,
        tutorAdminId: item.tutor.adminId || 'NA',
        phone: item.tutor.phone,
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

  // Get selected month name or current month if none selected
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
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Lessons${id ? ' for Student' : ''}`}
            description="Manage and track student lessons"
          />

          {id && (
            <div className="flex flex-col items-center space-y-2">
              <h2 className="text-sm font-medium text-muted-foreground">
                Total Hours for {selectedMonthName} {selectedYear}
              </h2>
              <h3 className="text-xl font-bold">
                {totalDuration?.hours}h {totalDuration?.minutes}m
              </h3>
            </div>
          )}

          <div className="flex space-x-2">
            {!id && (
              <Link
                href="/dashboard/lesson/new"
                className={cn(buttonVariants({ variant: 'default' }))}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Lesson
              </Link>
            )}

            {id && (
              <Link
                href={`/dashboard/generateinvoice/${id}?month=${selectedMonthNumber}&year=${selectedYear}`}
                className={cn(buttonVariants({ variant: 'default' }))}
              >
                <Plus className="mr-2 h-4 w-4" /> Generate Invoice
              </Link>
            )}
          </div>
        </div>

        <Separator />

        {/* Month and Year Picker */}
        {id && (
          <div className="mb-4">
            <MonthYearPicker
              studentId={id}
              initialMonth={selectedMonthNumber}
              initialYear={selectedYear}
            />
          </div>
        )}

        <LessonTable
          searchKey="name"
          data={formatedData ? formatedData : []}
          pageNo={page}
          totalUsers={totalUsers}
          pageCount={pageCount}
        />
      </div>
    </>
  );
}
