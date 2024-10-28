'use server';
import bcrypt from 'bcryptjs';
import { sendEmail } from './emailAction';
import { auth } from '@/auth';
import { db } from '@/db/db';

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



  try {
   
    const student = await db.student.create({
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

    return { success: 'student created successfully' };
  } catch (error) {
    return { error: 'An error occurred while creating the student' };
  }
}


export const getAllStudents = async () => {
  const students = await db.student.findMany();
  return students;
};