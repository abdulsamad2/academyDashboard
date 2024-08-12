'use server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { revalidatePath } from 'next/cache';
const prisma = new PrismaClient();
import crypto from 'crypto';
import { auth , signIn, signOut,} from '@/auth';

export const getDb = (model: any) => {
  return prisma?.model?.findMany();
};
export const deleteDb = async (id: number, modelName: string) => {
  try {
    const model = prisma[modelName]; // Access the model dynamically
    if (!model) {
      throw new Error(`Model ${modelName} does not exist`);
    }

    const res = await model.delete({
      where: {
        id
      }
    });

    return res;
  } catch (error) {
    console.error(
      `Error deleting record with ID ${id} from model ${modelName}:`,
      error
    );
    throw error; // Rethrow the error for further handling if needed
  }
};

// Ensure directory exists or create it

export const verfiyToken = async (token: string, id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id
    }
  });

  if (!user) {
    return false;
  }

  if (user?.token && user.expiresAt > new Date()) {
    const res = await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        token: '',
        isvarified: true,
        status: 'active',
        updatedAt: new Date()
      }
    });
    if (res) {
      
      return user;
    }
  }
};

export const isAuthenticated = async () => {
  const session = await auth();
  if (session) {
    return true;
  }

  return false;
};
export const generateToken = async () => {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 3600 * 1000 * 24);
  return { token, expires }; // Token expires in 1 hour
};

export async function uploadFile(formData: FormData) {
  const file = formData.get('image') as File;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  await fs.promises.writeFile(`./public/uploads/${file.name}`, buffer);
  revalidatePath('/');
}

export const updateSession = async (user: any) => {
  const session = await getSession();
  session.user = user;
  await session.save();
};