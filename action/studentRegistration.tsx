'use server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { sendEmail } from './emailAction';
import { auth } from '@/auth';
const prisma = new PrismaClient();

export async function studentRegistration(formData: {
  email: string;
  name: string;
  state: string;
  address: string;
  city: string;
  school: string;
  studymode: string;
  gender: string;
  phone: string;
  level: string;
  age: string;
  sessionDuration: string;
  sessionFrequency: string;
  subject: string[];
}) {
  const session = await auth();
  if (!session) return;
  //@ts-ignore
  const parentId = session?.id;

  const {
    email,
    name,
    state,
    level,
    age,
    address,
    city,
    studymode,
    gender,
    phone,
    school,
    sessionDuration,
    sessionFrequency,
    subject,
  } = formData;

  let error;

  // generate token for mail verfication using crypto
  // Token expires in 1 hour

  try {
    // const html = `
    // <div>
    // <h1>Verify your email</h1>
    // <p>Click on the link below to verify your email</p>
    // <a href="http://localhost:3000/auth/verify/${token}}">Verify Email</a>
    // `;
    // Create the student
    const student = await prisma.student.create({
      data: {
        name,
        email,
        phone,
        address,
        city,
        state,
        studymode,
        class: level,
        parentId,
        sex: gender,
        school,
        age,
        sessionDuration,
        sessionFrequency,
        subject,
      }
    });

    // if (student) {
    //   const res = await sendEmail({
    //     mail_from: 'info@<mailtrap.io>',
    //     mail_to: student.email,
    //     subject: 'Verify your email',
    //     html: html
    //   });

    return { success: 'student created successfully' };
  } catch (error) {
    return { error: 'An error occurred while creating the student' };
  }
}

