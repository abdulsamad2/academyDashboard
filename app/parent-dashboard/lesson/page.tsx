import { Breadcrumbs } from '@/components/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { columns } from '@/components/tables/lesson-table/columns';
import { LessonTable } from '@/components/tables/lesson-table/lesson-table';
import { getLessonForStudent, getLessons } from '@/action/addLesson';

const breadcrumbItems = [
  { title: 'Parent', link: '/parent-dashboard' },
  { title: 'Lessons', link: '/parent-dashboard/lesson' }
];

type paramsProps = {
  searchParams: {
    [key: string]: string | undefined;
  };
};

export default async function Page({ searchParams }: paramsProps) {
  const id: string | undefined = searchParams.id;
  let lesson;

  if (id) {
    lesson = await getLessonForStudent(id);
  } else {
    lesson = await getLessons();
  }

  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  //@ts-ignore
  const totalUsers = lesson.length;
  const pageCount = Math.max(1, Math.ceil(totalUsers / pageLimit));

  const formatedData =
    lesson.length > 0 &&
    lesson.map((item) => {
      const startTime = new Date(item.startTime);
      const endTime = new Date(item.endTime);
      return {
        ...item,
        name: item.student.name,
        tutor: item.tutor.name || item.tutor.email,
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
          id ? `Filtered to one child · ${currentMonth}` : 'All recent lessons'
        }
      />
      {id && (
        <Card className="shadow-elevated-sm">
          <CardContent className="p-4 text-sm text-muted-foreground">
            Filter currently scoped to one student.
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
