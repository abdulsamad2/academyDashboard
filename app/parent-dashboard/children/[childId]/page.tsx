import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StudentForm } from '@/components/forms/student-form';
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Student', link: '/dashboard/student' },
  { title: 'Create', link: '/dashboard/student/create' }
];

export default async function Page({ params }: any) {
  const id = params.childId;
  const data = await prisma.student.findUnique({
    where: {
      id: id
    }
  });
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <StudentForm
        //@ts-ignore
        initialData={data || null} key={null} />
      </div>
    </ScrollArea>
  );
}
