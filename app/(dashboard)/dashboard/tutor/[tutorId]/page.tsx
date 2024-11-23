import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TutorForm } from '@/components/forms/tutor-form';
import { Prisma, PrismaClient } from '@prisma/client';
import { FormSchema } from '@/components/forms/tutor-form';
import { z } from 'zod';
const prisma = new PrismaClient();
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Tutor', link: '/dashboard/tutor' },
  { title: 'Create', link: '/dashboard/tutor/create' }
];

export interface TutorPageProps {
  params: {
    tutorId: string;
  };
}

export default async function Page({ params }: TutorPageProps) {
  const { tutorId } = params;
  let formattedData;

  const tutor = await prisma.tutor.findUnique({
    where: {
      id: tutorId
    },

    include: {
      user: true
    }
  });

  if (tutor) {
    formattedData = {
      bio: tutor.bio || '',
      experience: tutor.experience || '',
      currentposition: tutor.currentposition || '',
      address: tutor.user?.address || '',
      city: tutor.user?.city || '',
      state: tutor.user?.state || '',
      name: tutor.user?.name || '',
      id: tutor.id || '',
      email: tutor.user?.email || '',
      password: '',
      phone: tutor.user?.phone || '',
      bank: tutor.bank || '',
      bankaccount: tutor.bankaccount || '',
      education: tutor.education || '',
      certification: tutor.certification || '',
      subjects: tutor.subjects || '',
      online: tutor.teachingOnline,
      profilepic: tutor.profilepic || '',
      nric: tutor.nric || '',
      spm: tutor.spm || '',
      resume: tutor.resume || '',
      age: tutor.age || '',
      degree: tutor.degree || '',
      country: tutor.user?.country || '',
      levels: tutor.teachinglevel || ''
    };
  }
  const subject = await prisma.subject.findMany();
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <TutorForm
          subject={subject}
          //@ts-ignore
          initialData={formattedData || null}
          key={null}
        />
      </div>
    </ScrollArea>
  );
}
