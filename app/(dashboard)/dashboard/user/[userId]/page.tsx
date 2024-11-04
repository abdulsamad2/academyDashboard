import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';
import UserUpdateForm from '../components/updateUserForm';
import { getUserById } from '@/action/userRegistration';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'User', link: '/dashboard/user' },
  { title: 'Create', link: '/dashboard/user/create' }
];
export default async function Page({params}:any) {
  const userId = params.userId
  const userData = await getUserById(userId)
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
       <UserUpdateForm 
               //@ts-ignore
       initialData ={userData }/>
      </div>
    </ScrollArea>
  );
}
