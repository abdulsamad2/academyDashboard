import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {  PrismaClient } from '@prisma/client';
import { Assigntutor } from '../component/assignTutorForm';
import { catchAsync } from '@/lib/utils';
import { getTutor } from '@/action/AssignTutor';
import { assign } from 'lodash';
const prisma = new PrismaClient();
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Tutor', link: '/dashboard/tutor' },
  { title: 'Create', link: '/dashboard/tutor/create' }
];

export default async function Page({ params}:any) {
  const id = params.studentId;
  const student = await prisma.student.findUnique({
    where: {
      id: id
    },
  });

 const tutorAssignedTothisStudent = await getTutor(id)
const tutors = await catchAsync(async() => {
    const tutor = await prisma.user.findMany({
      where: {
        role: 'tutor'
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc'
      }
    });
    return tutor;
  })

  const assignedTutor =tutorAssignedTothisStudent.map((tutor:any) => {
    const filtered = tutors.filter((t:any) => t.id === tutor.tutorId);
    return filtered
  })
const formatData = {
 name: student?.name,
 studentId: student?.id,
  tutors:tutors,
  assigned:assignedTutor


}
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <Assigntutor
        //@ts-ignore
          initialData={formatData}
          key={null}
        />
      </div>
    </ScrollArea>
  );
}
