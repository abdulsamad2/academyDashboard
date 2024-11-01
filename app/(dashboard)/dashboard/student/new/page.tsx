import { ScrollArea } from '@/components/ui/scroll-area';
import { StudentForm } from '@/components/forms/student-form';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function Page() {
  const subject = await prisma.subject.findMany();

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-8 p-8">
        <StudentForm
          //@ts-ignore
          initialData={null}
          //@ts-ignore
          subject={subject}
          key={null}
        />
      </div>
    </ScrollArea>
  );
}
