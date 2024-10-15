import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Prisma, PrismaClient } from '@prisma/client';
import { SubjectForm } from '@/components/forms/subject-form';
const prisma = new PrismaClient();
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Subject', link: '/dashboard/subject' },
  { title: 'Create', link: '/dashboard/student/create' }
];

export default async function Page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <SubjectForm
          //@ts-ignore
          initialData={null}
          key={null}
        />
      </div>
    </ScrollArea>
  );
}
