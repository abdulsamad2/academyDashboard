import { auth } from '@/auth';
import { TutorOnboarding } from '@/components/forms/tutor-onboarding';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import { getSubjects } from '@/action/subjectAction';
import { db as prisma } from '@/db/db';

const breadcrumbItems = [
  { title: 'Tutor', link: '/tutor-dashboard' },
  { title: 'Profile', link: '/tutor-dashboard/profile' }
];

export default async function Page() {
  const session = await auth();
  //@ts-ignore
  const id = session?.id as string | undefined;

  if (!id) {
    throw new Error('User is not authenticated or session ID is missing.');
  }

  const user = await prisma.user.findUnique({
    where: { id },
    include: { tutor: true }
  });

  let formattedData;
  if (user && user.tutor) {
    formattedData = {
      //@ts-ignore
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

  const subject = await getSubjects().catch(() => []);
  const isEdit = !!user?.tutor;

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title={isEdit ? 'Edit your profile' : 'Complete your tutor profile'}
        description={
          isEdit
            ? 'Keep your details current so parents see the latest info.'
            : 'Fill in everything below to start receiving students.'
        }
      />
      <TutorOnboarding
        //@ts-ignore
        initialData={isEdit ? formattedData : null}
        //@ts-ignore
        subject={subject ? subject : []}
      />
    </>
  );
}
