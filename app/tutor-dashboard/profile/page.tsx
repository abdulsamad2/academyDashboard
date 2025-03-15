import { ScrollArea } from '@/components/ui/scroll-area';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';
import { TutorForm } from '@/components/forms/tutor-form';
import { TutorOnboarding } from '@/components/forms/tutor-onboarding';
import { getSubjects } from '@/action/subjectAction';

const prisma = new PrismaClient();

export default async function Page() {
  const session = await auth();
  //@ts-ignore
  const id = session?.id as string | undefined;

  if (!id) {
    throw new Error('User is not authenticated or session ID is missing.');
  }

  let formattedData;

  const user = await prisma.user.findUnique({
    where: {
      id: id
    },
    include: {
      tutor: true
    }
  });

  //

  if (user && user.tutor) {
    formattedData = {
      // @ts-ignore
      id: user.tutor.id,
      bio: user.tutor.bio || '',
      experience: user.tutor.experience || '',
      name: user.name || '',
      email: user.email || '',
      password: '',
      phone: user.phone || '',
      state: user?.state || '',
      age: user?.tutor.age || '',
      address: user.address || '',
      degree: user.tutor.degree || '',
      spm: user.tutor.spm || '',
      country: user.country || '',
      city: user.city || '',
      levels: user.tutor.teachinglevel || '',
      bank: user.tutor.bank || '',
      bankaccount: user.tutor.bankaccount || '',
      currentposition: user.tutor.currentposition || '',
      education: user.tutor.education || '',
      certification: user.tutor.certification || '',
      subjects: user.tutor.subjects || [],
      online: user.tutor.teachingOnline || false,
      profilepic: user.tutor.profilepic || '',
      nric: user.tutor.nric || '',
      resume: user.tutor.resume || '',
      agreementRead: user.tutor.agreementRead || true
    };
  } else {
    formattedData = {
      id: '',
      bio: '',
      experience: '',
      name: '',
      email: '',
      password: '',
      phone: '',
      state: '',
      address: '',
      city: '',
      bank: '',
      bankaccount: '',
      currentposition: '',
      education: '',
      certification: '',
      subjects: [],
      online: false,
      profilepic: '',
      nric: '',
      stt: '',
      resume: ''
    };
  }
  const fetchSubjects = async () => {
    try {
      const sub = await getSubjects();
      return sub && sub.length > 0 ? sub : [];
    } catch (error) {
      console.log(error)
    }
  };
  const subject = await fetchSubjects()

  return (
    <ScrollArea className="">
      <div className="flex-1 space-y-4 p-8">
        <TutorOnboarding
          initialData={formattedData}
          key={null}
          //@ts-ignore
          subject={subject ? subject : []}
        />
      </div>
    </ScrollArea>
  );
}
