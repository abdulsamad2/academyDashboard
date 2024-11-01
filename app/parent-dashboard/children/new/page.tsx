import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StudentForm } from '@/components/forms/student-form';
import { PrismaClient } from '@prisma/client';
import { getUserById } from '@/action/userRegistration';
import { auth } from '@/auth';
const prisma = new PrismaClient();

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Student', link: '/dashboard/student' },
  { title: 'Create', link: '/dashboard/student/create' }
];

export default async function Page () {
  const subject = await prisma.subject.findMany();

  // filter user email phone
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <StudentForm  initialData={null} key={null} subject={subject} />
      </div>
    </ScrollArea>
  );
}
