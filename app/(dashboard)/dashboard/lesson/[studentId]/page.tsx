import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PrismaClient } from '@prisma/client';
import { LessonForm } from '@/components/forms/lesson-form';
import { auth } from '@/auth';
import { getUserById } from '@/action/userRegistration';
const prisma = new PrismaClient();
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Student', link: '/dashboard/student' },
  { title: 'add lesson', link: '/dashboard/lesson/add' }
];

export default async function Page({ params }: any) {
  const session = await auth();
  const id = params.studentId;
  const data = await prisma.student.findUnique({
    where: {
      id: id
    }
  });
  const tutor = await prisma.tutor.findUnique({
    where: {
      //@ts-ignore
      userId: session?.id as string,
    },
    select:{
      hourly:true
    }
  })
const formatDate = {
  ...data,
  level:data?.class,
  gender:data?.sex,
  hourly:tutor?.hourly

}



  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <LessonForm
        //@ts-ignore
          initialData={formatDate?formatDate:undefined}
          key={null}
        />
      </div>
    </ScrollArea>
  );
}
