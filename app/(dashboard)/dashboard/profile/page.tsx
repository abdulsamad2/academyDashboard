import { Breadcrumbs } from '@/components/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import UserUpdateForm from '../user/components/updateUserForm';
import { auth } from '@/auth';
import { getUserById } from '@/action/userRegistration';
import { redirect } from 'next/navigation';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Profile', link: '/dashboard/profile' }
];

export default async function Page() {
  const session = await auth();
  if (!session?.id) redirect('/auth/signin');
  const userData = await getUserById(session.id);

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader title="Profile" description="Manage your account details" />
      <UserUpdateForm
        //@ts-ignore
        initialData={userData}
      />
    </>
  );
}
