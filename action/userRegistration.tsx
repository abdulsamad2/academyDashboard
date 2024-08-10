'use server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { sendEmail } from './emailAction';

const prisma = new PrismaClient();

export async function userRegistration(formData: {
  email: string;
  password: string;
}) {
  const { email, password } = formData;

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  // generate token for mail verfication using crypto
  const token = await bcrypt.hash(email, 10);
  const expires = new Date(Date.now() + 3600 * 1000 * 24); // Token expires in 1 hour

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

    const html = `
    <div>
    <h1>Verify your email</h1>
    <p>Click on the link below to verify your email</p>
    <a href="http://localhost:3000/auth/verify/?token=${token}}">Verify Email</a>
    `;
    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'student',
        status: 'pendingApproval',
        token: token,
        expiresAt: expires,
        isvarified: false,
        street: ''
      }
    });

    if (user) {
      const res = await sendEmail({
        mail_from: 'info@<mailtrap.io>',
        mail_to: user.email,
        subject: 'Verify your email',
        html: html
      });
      console.log(res);

      return { user };
    }
  } catch (error) {
    console.error('Error creating user:', error);
  }
}
