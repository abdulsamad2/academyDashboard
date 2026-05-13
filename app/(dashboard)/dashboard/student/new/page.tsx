import { StudentForm } from '@/components/forms/student-form';
import { db as prisma } from '@/db/db';
export default async function Page() {
  const subject = await prisma.subject.findMany();

  return (
    <>
      <StudentForm
        //@ts-ignore
        initialData={null}
        //@ts-ignore
        subject={subject}
        key={null}
        studentId={null}
      />
    </>
  );
}
