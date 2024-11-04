import { Breadcrumbs } from '@/components/breadcrumbs';
import { CreateProfileOne } from '@/components/forms/user-profile-stepper/create-profile';
import { ScrollArea } from '@/components/ui/scroll-area';
import UserUpdateForm from '../user/components/updateUserForm';
import { auth } from '@/auth';
import { getUserById } from '@/action/userRegistration';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Profile', link: '/dashboard/profile' }
];
export default async function page() {
  const session = await auth()
  //@ts-ignore
  const userData = await getUserById(session?.id)

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        
        <UserUpdateForm 
        //@ts-ignore
         initialData={userData}/>
      </div>
    </ScrollArea>
  );
}
