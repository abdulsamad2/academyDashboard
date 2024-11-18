import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PrismaClient } from '@prisma/client';
import { LessonForm } from '@/components/forms/lesson-form';
const prisma = new PrismaClient();
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Student', link: '/dashboard/student' },
  { title: 'add lesson', link: '/dashboard/lesson/add' }
];

export default async function Page({ params }: any) {
  const id = params.lessonId;
  const data = await prisma.lesson.findUnique({
    where: {
      id: id
    }
    ,include:{
      student:{
        select:{
          name:true,
          id:true,
          subject:true,
        }
      }
      
    }
  });
  
const flatObject = {
  ...data,
  lessonId:data?.id,
  subj:data?.subject,
  studentId:data?.student?.id,
  date:data?.date.toISOString().split('T')[0],
  subject:data?.student?.subject
}

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <LessonForm
        //@ts-ignore
          initialData={flatObject?flatObject:undefined}
          key={null}
        />
      </div>
    </ScrollArea>
  );
}
