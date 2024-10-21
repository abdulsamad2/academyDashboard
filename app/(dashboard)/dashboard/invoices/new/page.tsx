import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StudentForm } from '@/components/forms/student-form';
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Invoice', link: '/dashboard/invoice' },
  { title: 'Create', link: '/dashboard/invoice/create' }
];

export default async function Page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <StudentForm
          initialData={null}
          key={null} subject={[]}        />
      </div>
    </ScrollArea>
  );
}
