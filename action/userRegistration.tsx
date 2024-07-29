'use server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function userRegistration(formData: {
  email: string;
  password: string;
}) {
  const { email, password } = formData;

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (existingUser) {
      return {
        error: 'User already exists with this email'
      };
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 14);

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role:'student',
        status:'active',
        address:'',
      }
    });

    return { user };
  } catch (error) {
    console.error('Error creating user:', error);
  }
}
