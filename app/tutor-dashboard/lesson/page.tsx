import { Breadcrumbs } from '@/components/breadcrumbs';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { columns } from '@/components/tables/lesson-table/columns';
import { LessonTable } from '@/components/tables/lesson-table/lesson-table';
import {getLessonForThisTutorAndStudent, getLessons, getTotalDurationForStudentandTutorThisMonth, getTotalDurationForStudentThisMonth } from '@/action/addLesson';
import { auth } from '@/auth';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'admin', link: '/dashboard/' }
];

type paramsProps = {
  searchParams: {
    [key: string]: string | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {
  const session = await auth();
const id: string | undefined = searchParams.id;
  let lesson;
  //@ts-ignore
  const  lessonData:any =await getTotalDurationForStudentandTutorThisMonth(id,session.id || '');

  const totalDuration = lessonData?.reduce((acc: { hours: number; minutes: number; }, item: { totalDuration: number; }) => {
    const hours = Math.floor(item.totalDuration / 60);
    const minutes = item.totalDuration % 60;
  
    acc.hours += hours;
    acc.minutes += minutes;
  
    return acc;
  }, { hours: 0, minutes: 0 });
  
  if (totalDuration) {
    totalDuration.hours += Math.floor(totalDuration.minutes / 60);
    totalDuration.minutes = totalDuration.minutes % 60;
  }  if (id) {
    //@ts-ignore
     lesson = await getLessonForThisTutorAndStudent(session?.id,id);

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
      phone:item.tutor.phone,
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
        <h1 className='font-bold'>{totalDuration?.hours}h {totalDuration?.minutes}m</h1>
      </div>
        }
         </div>
        
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
