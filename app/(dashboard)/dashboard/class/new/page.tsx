import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PrismaClient } from '@prisma/client';
import { ClassForm } from '@/components/forms/add-class-form';

const prisma = new PrismaClient();

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Class', link: '/dashboard/class' },
  { title: 'Create', link: '/dashboard/class/add' }
];

// Fetch subjects and students data
const getSubjects = async () => {
  return await prisma.subject.findMany();
};

const getStudents = async () => {
  return await prisma.student.findMany();
};

export default async function Page() {
  // Fetch data
  const subjects = await getSubjects();
  const students = await getStudents();

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <ClassForm
          //@ts-ignore
          initialData={{}}
          subjects={subjects} // Pass subjects to the form
          students={students} // Pass students to the form
          key={null}
        />
      </div>
    </ScrollArea>
  );
}
