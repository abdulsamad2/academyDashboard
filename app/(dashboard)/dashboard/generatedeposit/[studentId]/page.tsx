import SecurityDepositInvoiceForm from './component/page';
import { db } from '@/db/db';

export default async function Page(props: any) {
  const params = await props.params;
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
    <>
      <SecurityDepositInvoiceForm initialData={formatedData} />
    </>
  );
}
export const revalidate = 0;
