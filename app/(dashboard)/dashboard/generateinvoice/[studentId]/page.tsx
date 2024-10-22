import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PrismaClient } from '@prisma/client';
import InvoicePage from '../component/invoicePage';
const prisma = new PrismaClient();
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Student', link: '/dashboard/student' },
  { title: 'Create', link: '/dashboard/student/create' }
];

export default async function Page({ params }: any) {
  const id = params.studentId;

  // @ts-ignore
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        {/* <StudentForm
        //@ts-ignore
          initialData={formatDate?formatDate:undefined}
          key={null}
        /> */}
        <InvoicePage studentId={id}/>
      </div>
    </ScrollArea>
  );
}
export const revalidate = 0;