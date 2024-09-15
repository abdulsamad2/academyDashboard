'use server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { revalidatePath } from 'next/cache';
const prisma = new PrismaClient();
import crypto from 'crypto';
import { auth, signIn, signOut } from '@/auth';
import { sendEmail } from './emailAction';

export const getDb = (model: any) => {
  //@ts-ignore
  return prisma?.model?.findMany();
};
export const deleteDb = async (id: number, modelName: string) => {
  try {
    //@ts-ignore
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

export const getById = async (id: number, modelName: string) => {
  try {
    //@ts-ignore
    const model = prisma[modelName]; // Access the model dynamically
    if (!model) {
      throw new Error(`Model ${modelName} does not exist`);
    }
    const res = await model.findUnique({
      where: {
        id
      }
    });
    return res;
  } catch (error) {
    console.error(
      `Error fetching record with ID ${id} from model ${modelName}:`,
      error
    );
    throw error; // Rethrow the error for further handling if needed
  }
};

// Ensure directory exists or create it

export const verifyToken = async (token: string, id: string) => {
  try {
    // Retrieve the user by their ID
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    });

    // If the user is not found, return an error
    if (!user) {
      return { error: 'User not found' };
    }

    // Check if the user is already verified
    if (user.isvarified) {
      return { error: 'User is already verified' };
    }

    // Check if the token exists and is valid
    if (user.token !== token) {
      return { error: 'Invalid or expired token' };
    }

    // Update the user's verification status
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        token: '', // Clear the token after successful verification
        isvarified: true,
        status: 'active',
        updatedAt: new Date()
      }
    });

    // Return the updated user
    return updatedUser;
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error verifying token:', error);
    return { error: 'An unexpected error occurred' };
  }
};

export const isAuthenticated = async () => {
  const session = await auth();
  if (session) {
    return true;
  }

  return false;
};
export const resendVerficationEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!user) {
    return false;
  }
  const { token, expires } = await generateToken();
  const res = await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      token,
      expiresAt: expires
    }
  });
  if (res) {
    // Send email with token
    sendEmail({
      mail_from: 'info@<mailtrap.io>',
      mail_to: user.email,
      subject: 'Verify your email',
      html: ` <div>
    <h1>Verify your email</h1>
    <p>Click on the link below to verify your email</p>
    <a href="http://localhost:3000/auth/verify/${token}}">Verify Email</a>
  </div>`
    });
    return true;
  }
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

