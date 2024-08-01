'use server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function tutorRegistration(formData: { email: string; name: string; address: string; hourly: string; dob: string; teaches: string; bio: string; availability: string; language: string; }) {

  const {bio, email, name,hourly,dob,teaches,address,availability,language, password } = formData;
  if (!email) {
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
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    const tutorWithUser = await prisma.tutor.create({
      data: {
        name,
        email,

        user: {
          create: {
            role: 'tutor',
            name,
            status: 'active',
            email,
            password: hashedPassword
          }
        }
      },
      include: {
        user: true
      }
    })
    console.log('User created successfully:', tutorWithUser);


    return {
      success: 'tutor created successfully'
    };
  } catch (error) {
    console.error('Error creating user:', error);
  }
}
