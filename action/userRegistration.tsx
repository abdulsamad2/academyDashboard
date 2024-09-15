'use server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { sendEmail } from './emailAction';
import { generateToken } from './factoryFunction';
const prisma = new PrismaClient();

export async function userRegistration(formData: {
  email: string;
  password: string;
  role: string;
  name?: string;
  phone?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
}) {
  const { email, role, password, name, phone, address, country, state, city } =
    formData;
  const { token, expires } = await generateToken();
  let error;
  if (!email) {
    throw new Error('Email address are required');
  }
  const hashedPassword = await bcrypt.hash(password, 12);

  // generate token for mail verfication using crypto
  // Token expires in 1 hour

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (existingUser) {
      const res = await prisma.user.update({
        where: {
          id: existingUser.id
        },
        data: {
          email: email || undefined,
          onboarding: false,
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

      return { user: res, error };
    }

    // Hash the password

    const html = `
    <div>
    <h1>Verify your email</h1>
    <p>Click on the link below to verify your email</p>
    <a href="http://localhost:3000/auth/verify/${token}}">Verify Email</a>
    `;
    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        //@ts-ignore
        role: role || 'parent',
        status: 'pendingApproval',
        token: token,
        expiresAt: expires,
        isvarified: false,
        address: '',
        onboarding: true
      }
    });

    if (user) {
      const res = await sendEmail({
        mail_from: 'info@<mailtrap.io>',
        mail_to: user.email,
        subject: 'Verify your email',
        html: html
      });

      return { user, error };
    }
  } catch (error) {
    console.error('Error creating user:', error);
  }
}
