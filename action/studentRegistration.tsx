'use server';
import bcrypt from 'bcryptjs';
import { sendEmail } from './emailAction';
import { auth } from '@/auth';
import { db } from '@/db/db';

export async function studentRegistration(formData: {
  name: string;
  state: string;
  address: string;
  city: string;
  school: string;
  studymode: string;
  gender: string;
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
    name,
    state,
    level,
    age,
    address,
    city,
    studymode,
    gender,
    school,
    sessionDuration,
    sessionFrequency,
    subject
  } = formData;

  let error;

  try {
    const student = await db.student.create({
      data: {
        name,
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
        subject
      }
    });

    return { success: 'student created successfully' };
  } catch (error) {
    console.error('Error creating student:', error);
    return { error: 'An error occurred while creating the student' };
  }
}

export const getAllStudents = async () => {
  const students = await db.student.findMany();
  return students;
};

export const updateStudent = async (id: string, data: any) => {
  try {
    const student = await db.student.update({
      where: {
        id
      },
      data: {
        name: data.name,
        state: data.state,
        address: data.address,
        city: data.city,
        sex: data.gender,
        studymode: data.studymode,
        class: data.level,
        school: data.school,
        age: data.age,
        sessionDuration: data.sessionDuration,
        sessionFrequency: data.sessionFrequency,
        subject: data.subject
      }
    });
    return { success: 'student updated successfully' };
  } catch (error) {
    console.log('error', error);
    return { error: 'An error occurred while updating the student' };
  }
};
