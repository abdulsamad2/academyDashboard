'use server';
import bcrypt from 'bcryptjs';
import { FormSchema } from '@/components/forms/tutor-form';
import { z } from 'zod';

import { db } from '@/db/db';
type TutorRegistrationData = z.infer<typeof FormSchema>;

export const tutorRegistration = async (formData: TutorRegistrationData) => {
  const {
    bio,
    levels,
    age,
    spm,
    experience,
    name,
    state,
    address,
    city,
    bank,
    bankaccount,
    currentposition,
    education,
    certification,
    subjects,
    online,
    profilepic,
    nric,
    resume,
    country,
    degree,
    email,
    phone,
    password
  } = formData;

  try {
    // Check if the user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    });
    const existingPhone = await db.user.findUnique({
      where: { phone }
    });
    if (existingUser && existingPhone) {
      return { error: `User already exists with this ${email} ${phone}` };
    }
    const hashedPassword = password ? await bcrypt.hash(password, 12) : null;

    const tutorWithUser = await db.tutor.create({
      data: {
        bank,
        bankaccount,
        currentposition,
        education,
        certification,
        bio,
        subjects,
        teachingOnline: Boolean(online), //convert string to boolean
        experience: experience,
        profilepic: profilepic,
        nric: nric,
        spm: spm,
        age: age,
        resume: resume,
        degree: degree,
        teachinglevel: levels,
        user: {
          create: {
            role: 'tutor',
            name,
            token: undefined,
            expiresAt: undefined,
            isvarified: false,
            address: address,
            city,
            country: country,
            phone,
            state: state,
            status: 'active',
            email,
            //@ts-ignore
            password: hashedPassword
          }
        }
      }
    });
    return { success: 'Tutor created successfully' };
  } catch (error) {
    console.log('Error creating user:', error);
    return { error: 'Error creating tutor' };
  }
};

export const getAllTutors = async () => {
  const tutors = await db.tutor.findMany();
  return tutors;
};

export const getTutorById = async (id: string) => {
  try {
    const tutor = await db.user.findUnique({
      where: { id },
      include: {
        tutor: true
      }
    });
    return tutor;
  } catch (error) {
    return { error: 'Error fetching tutor' };
  }
};

export const getTutorByEmail = async (email: string) => {
  try {
    const tutor = await db.user.findUnique({
      where: { email },
      include: {
        tutor: true
      }
    });
    return tutor;
  } catch (error) {
    return { error: 'Error fetching tutor' };
  }
};

export const updateTutor = async (
  id: string,
  formData: TutorRegistrationData
) => {
  const {
    bio,
    levels,
    age,
    spm,
    experience,
    name,
    state,
    address,
    city,
    bank,
    bankaccount,
    currentposition,
    education,
    certification,
    subjects,
    online,
    profilepic,
    nric,
    resume,
    country,
    degree,
    email,
    phone
  } = formData;
  try {
    const updatedTutor = await db.tutor.update({
      where: {
        id: id
      },
      include: {
        user: true
      },
      data: {
        bank,
        bankaccount,
        currentposition,
        education,
        certification,
        bio,
        subjects,
        teachingOnline: Boolean(online), //convert string to boolean
        experience: experience,
        profilepic: profilepic,
        nric: nric,
        degree: degree,
        spm: spm,
        age: age,
        resume: resume,
        teachinglevel: levels,
        user: {
          update: {
            role: 'tutor',
            name,
            token: undefined,
            expiresAt: undefined,
            isvarified: false,
            address: address,
            state: state,
            city,
            country: country,
            phone,
            status: 'active',
            email
          }
        }
      }
    });

    return { success: 'Tutor updated successfully' };
  } catch (error) {
    console.error('Error updating tutor:', error);
    return { error: 'Error updating tutor' };
  }
};
