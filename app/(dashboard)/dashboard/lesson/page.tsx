import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { columns } from '@/components/tables/lesson-table/columns';
import { LessonTable } from '@/components/tables/lesson-table/lesson-table';
import { getLessonForStudent, getLessons, getTotalDurationForStudentThisMonth } from '@/action/addLesson';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'admin', link: '/dashboard/' }
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {
  const id = searchParams.id;
  let lesson;
  let totalTime;
  if (id) {
     lesson = await getLessonForStudent(id);
     totalTime =await getTotalDurationForStudentThisMonth(id);

  }else{
     lesson = await getLessons();
  }
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
    //@ts-ignore
  const totalUsers = lesson.length; //1000
  const pageCount = Math.ceil(totalUsers / pageLimit);
  const formatedData = lesson.length > 0 && lesson.map((item) => {
    const startTime = new Date(item.startTime);
    const endTime = new Date(item.endTime);
    
    return {
      ...item,
      name: item.student.name,
      tutor: item.tutor.name || item.tutor.email,
      startTime: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Format as needed
      endTime: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Format as needed
      date: new Date(item.date).toLocaleDateString(),
      subject: item.subject,
      classDuration: `${item.totalDuration} minutes`,  // Round to nearest whole minute
    };
  });
  // get current month name 
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Lessons`}
            description="Manage lessons)"
          />
         <div>
        {id &&
        <div className="flex flex-col items-center space-x-2">
        <h1 className='font-bold'>Total Hours for {currentMonth}</h1>
        <Separator className='w-20' />
        <h1 className='font-bold'>{totalTime?.overallTotalHours}h {totalTime?.overallRemainderMinutes}m</h1>
      </div>
        }
         </div>
         {id &&
          <Link
          href={`generateinvoice/${id}`}
          className={cn(buttonVariants({ variant: 'default' }))}
        >
          <Plus className="mr-2 h-4 w-4" /> Generate Invoice
        </Link>}
        </div>
        <Separator />
       
        <LessonTable
          searchKey="name"
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers}
          //@ts-ignore
          data={formatedData}
          pageCount={pageCount}
        />
      </div>
    </>
  );
}
