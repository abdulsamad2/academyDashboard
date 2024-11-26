import { ScrollArea } from '@/components/ui/scroll-area';
import SecurityDepositInvoiceForm from './component/page';
import { db } from '@/db/db';

export default async function Page({ params }: any) {
  const id = params.studentId;
  const student = await db.student.findFirst({
    where: {
      id: id
    },
    select: {
      id: true,
      name: true,
      parent: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true
        }
      }
    }
  });
  const formatedData: any = {
    id: student?.id ?? '',
    studentName: student?.name,
    parentId: student?.parent?.id,
    parentName: student?.parent?.name,
    parentEmail: student?.parent?.email,
    parentPhone: student?.parent?.phone
  };
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <SecurityDepositInvoiceForm initialData={formatedData} />
      </div>
    </ScrollArea>
  );
}
export const revalidate = 0;
