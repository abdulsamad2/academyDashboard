import { Breadcrumbs } from '@/components/breadcrumbs';
import { AssignTutor } from '../component/assignTutorForm';
import { catchAsync } from '@/lib/utils';
import { getTutor } from '@/action/AssignTutor';
import { db as prisma } from '@/db/db';
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Tutor', link: '/dashboard/tutor' },
  { title: 'Create', link: '/dashboard/tutor/create' }
];

export default async function Page({ params }: any) {
  const id = params.studentId;

  // Fetch the student data
  const student = await prisma.student.findUnique({
    where: {
      id: id
    }
  });

  // Fetch tutors assigned to this student, each with an hourly rate
  const tutorAssignedTothisStudent: any = await getTutor(id);

  // Fetch all tutors with basic info
  const tutors = await catchAsync(async () => {
    const tutor = await prisma.user.findMany({
      where: {
        role: 'tutor'
      },
      select: {
        id: true,
        name: true,
        email: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    return tutor;
  });

  const assignedTutor = tutorAssignedTothisStudent
    .map((tutor: any) => {
      const filteredTutor = tutors?.find((t: any) => t.id === tutor.tutorId);
      if (filteredTutor) {
        return {
          ...filteredTutor,
          hourlyRate: tutor.tutorhourly
        };
      }
      return null;
    })
    .filter(Boolean);

  const formatData = {
    name: student?.name,
    studentId: student?.id,
    tutors: tutors,
    assigned: assignedTutor
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <AssignTutor
        //@ts-ignore

        initialData={formatData}
        key={null}
      />
    </>
  );
}
