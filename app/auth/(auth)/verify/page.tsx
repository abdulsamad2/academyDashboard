import { auth } from '@/auth';
import { getUserById } from '@/action/userRegistration';
import { redirect } from 'next/navigation';
import VerifyPage from './components/verification';

export default async function Page() {
  const session = await auth();
  if (!session) {
    redirect('/auth/signin');
  }
  //@ts-ignore
  if (session?.user?.isvarified) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 sm:p-6">
        <div className="w-full max-w-md">
          <h1 className="text-center text-2xl font-bold">
            You are already verified
          </h1>
        </div>
      </div>
    );
  }
  //@ts-ignore
  const id = session?.id;
  const user = await getUserById(id);
  if (!user) {
    redirect('/auth/signin');
  }

  return <VerifyPage phone={user?.phone} />;
}
