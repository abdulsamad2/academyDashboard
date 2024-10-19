import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StudentForm } from '@/components/forms/student-form';
import { PrismaClient } from '@prisma/client';
import { getLessonForStudent } from '@/action/addLesson';
const prisma = new PrismaClient();
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Student', link: '/dashboard/student' },
  { title: 'Create', link: '/dashboard/student/create' }
];

export default async function Page({ params }: any) {
  const subject = await prisma.subject.findMany();

  const id = params.studentId;
  const data = await prisma.student.findUnique({
    where: {
      id: id
    }
  });

  const lessons = await getLessonForStudent(id)

 

const formatDate = {
  ...data,
  level:data?.class,
  gender:data?.sex
  
}
  // @ts-ignore
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <StudentForm
        //@ts-ignore
          initialData={formatDate?formatDate:undefined}
          subject={subject}
          key={null}
        />
      </div>
      <div>
        
      </div>
    </ScrollArea>
  );
}
