import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TutorForm } from '@/components/forms/tutor-form';
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Tutor', link: '/dashboard/tutor' },
  { title: 'Create', link: '/dashboard/tutor/create' }
];

export default async function Page({ params }: any) {
  const { tutorId } = params;
  let formattedData;

  const tutor = await prisma.tutor.findUnique({
    where: {
      id: tutorId
    },
    // Include any related data if needed
    include: {
      user: true
    }
  });

  if (tutor) {
    formattedData = {
      bio: tutor.bio || '',
      experience: tutor.experience || '',
      //@ts-ignore
      name: tutor.user.name || '',
            //@ts-ignore

      email: tutor.user.email || '',
      password: '',
            //@ts-ignore

      phone: tutor.user.phone || '',
            //@ts-ignore

      experience: tutor.experience || '',
      state: tutor.state || '',
      address: tutor.user?.address || '',
            //@ts-ignore

      city: tutor.user.city || '',
      bank: tutor.bank || '',
      bankaccount: tutor.bankaccount || '',
      currentposition: tutor.currentposition || '',
      education: tutor.education || '',
      certification: tutor.certification || '',
      subjects: '', // Assuming no subjects information in the original data
      online: tutor.teachingOnline,
      profilepic: tutor.profilepic || '',
      nric: tutor.nric || '',
      stt: tutor.stt || '',
      resume: tutor.resume || ''
    };
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <TutorForm // @ts-ignore 
        initialData={formattedData || null} key={null} />
      </div>
    </ScrollArea>
  );
}
