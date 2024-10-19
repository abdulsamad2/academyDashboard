'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const parentRegistration = async (parentData: {
  id?: string;
  name?: string;
  phone?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
}) => {
  const {id ,name, phone, address, country, state, city } = parentData;
  try {
    const res = await prisma.user.update({
      where: {
        id
      },
      data: {
        onboarding: false,
        role: 'parent',
        phone: phone || undefined,
        token: '',
        name: name || undefined,
        address: address || undefined,
        country: country || undefined,
        state: state || undefined,
        city: city || undefined,
        status: undefined
      }
    });
    return { user: res, };
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
};
