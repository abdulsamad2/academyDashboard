import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {  PrismaClient } from '@prisma/client';
import { AssignTutor } from '../component/assignTutorForm';
import { catchAsync } from '@/lib/utils';
import { getTutor } from '@/action/AssignTutor';
const prisma = new PrismaClient();
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Tutor', link: '/dashboard/tutor' },
  { title: 'Create', link: '/dashboard/tutor/create' }
];


export default async function Page({ params}:any) {
  const id = params.studentId;

  // Fetch the student data
  const student = await prisma.student.findUnique({
    where: {
      id: id,
    },
  });
  
  // Fetch tutors assigned to this student, each with an hourly rate
  const tutorAssignedTothisStudent: any = await getTutor(id);
  
  // Fetch all tutors with basic info
  const tutors = await catchAsync(async () => {
    const tutor = await prisma.user.findMany({
      where: {
        role: 'tutor',
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return tutor;
  });
  
  // Map the assigned tutors, adding the hourly rate and flattening the structure
  const assignedTutor = tutorAssignedTothisStudent.map((tutor: any) => {
    const filteredTutor = tutors?.find((t: any) => t.id === tutor.tutorId);
    if (filteredTutor) {
      return {
        ...filteredTutor,
        hourlyRate: tutor. tutorhourly, // Add the hourly rate from assigned tutors
      };
    }
    return null;
  }).filter(Boolean); // Remove any null values if no match is found
  
  // Format data to include student details and assigned tutor information
  const formatData = {
    name: student?.name,
    studentId: student?.id,
    tutors: tutors,
    assigned: assignedTutor,
  };
  

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <AssignTutor
          //@ts-ignore
        
          initialData={formatData}
          key={null}
        />
      </div>
    </ScrollArea>
  );
}
