import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ParentForm } from '@/components/forms/parent-form';
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Tutor', link: '/dashboard/tutor' },
  { title: 'Create', link: '/dashboard/tutor/create' }
];

export default async function Page({ params }:any) {
  const id = params.parentId;
  const data = await prisma.user.findUnique({
    where: {
      id: id
    },
    include: {
      parent: true
    }
  });

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <ParentForm
          //@ts-ignore
          initialData={data?data:[]}
          key={null}
        />
      </div>
    </ScrollArea>
  );
}
