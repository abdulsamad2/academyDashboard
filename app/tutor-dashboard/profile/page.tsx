import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ParentForm } from '@/components/forms/parent-form';
import { Prisma, PrismaClient } from '@prisma/client';
import { auth } from '@/auth';
const prisma = new PrismaClient();
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Parent', link: '/dashboard/tutor' },
  { title: 'Create', link: '/dashboard/tutor/create' }
];

export default async function Page() {
  const session = await auth();
  //@ts-ignore
  const id = session.id;
  const data = await prisma.user.findUnique({
    where: {
      id: id
    },
    include: {
      parent: true
    }
  });

  const initialData = { ...data, password: '' };
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <ParentForm
          //@ts-ignore
          initialData={initialData}
          key={null}
        />
      </div>
    </ScrollArea>
  );
}
