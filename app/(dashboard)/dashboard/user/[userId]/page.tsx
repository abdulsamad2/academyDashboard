import { Breadcrumbs } from '@/components/breadcrumbs';
import React from 'react';
import UserUpdateForm from '../components/updateUserForm';
import { getUserById } from '@/action/userRegistration';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'User', link: '/dashboard/user' },
  { title: 'Create', link: '/dashboard/user/create' }
];
export default async function Page({ params }: any) {
  const userId = params.userId;
  const userData = await getUserById(userId);
  return (
    <>
      <UserUpdateForm
        //@ts-ignore
        initialData={userData}
      />
    </>
  );
}
