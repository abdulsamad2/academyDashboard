import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import InvoicePage from '../component/invoicePage';
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Student', link: '/dashboard/student' },
  { title: 'Create', link: '/dashboard/student/create' }
];

export default async function Page({ params }: any) {
  const id = params.studentId;
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <InvoicePage studentId={id}/>
      </div>
    </ScrollArea>
  );
}
export const revalidate = 0;