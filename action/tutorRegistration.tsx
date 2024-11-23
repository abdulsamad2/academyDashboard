'use server';
import bcrypt from 'bcryptjs';
import { FormSchema } from '@/components/forms/tutor-form';
import { z } from 'zod';

import { db } from '@/db/db';
type TutorRegistrationData = z.infer<typeof FormSchema>;
interface TutorUpdateFormData {
  spm?: string;
  experience?: string;
  name?: string;
  state?: string;
  address?: string;
  city?: string;
  bank?: string;
  bankaccount?: string;
  currentposition?: string;
  education?: string;
  certification?: string;
  subjects?: string[];
  online?: boolean | string;
  profilepic?: string;
  nric?: string;
  resume?: string;
  country?: string;
  degree?: string;
  email?: string;
  phone?: string;
}

interface UpdateResponse {
  success?: string;
  error?: string;
  tutor?: any;
}

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
  formData: TutorUpdateFormData
): Promise<UpdateResponse> => {
  // Validate input
  if (!id?.trim()) {
    return { error: 'Tutor ID is required' };
  }

  try {
    // First check if tutor exists
    const existingTutor = await db.tutor.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!existingTutor) {
      return { error: 'Tutor not found' };
    }

    // If email is being updated, check for uniqueness
    if (formData.email && formData.email !== existingTutor.user?.email) {
      const emailExists = await db.user.findUnique({
        where: { email: formData.email }
      });
      if (emailExists) {
        return { error: 'Email already exists' };
      }
    }

    // If phone is being updated, check for uniqueness
    if (formData.phone && formData.phone !== existingTutor.user?.phone) {
      const phoneExists = await db.user.findUnique({
        where: { phone: formData.phone }
      });
      if (phoneExists) {
        return { error: 'Phone number already exists' };
      }
    }

    // Prepare tutor data update
    const tutorUpdateData: any = {
      bank: formData.bank,
      bankaccount: formData.bankaccount,
      currentposition: formData.currentposition,
      education: formData.education,
      certification: formData.certification,
      subjects: formData.subjects,
      teachingOnline: formData.online === 'true' || formData.online === true,
      experience: formData.experience,
      profilepic: formData.profilepic,
      nric: formData.nric,
      degree: formData.degree,
      spm: formData.spm,
      resume: formData.resume
    };

    // Remove undefined values
    Object.keys(tutorUpdateData).forEach((key) => {
      if (tutorUpdateData[key] === undefined) {
        delete tutorUpdateData[key];
      }
    });

    // Prepare user data update
    const userUpdateData: any = {
      role: 'tutor' as const,
      name: formData.name,
      isvarified: false,
      address: formData.address,
      state: formData.state,
      city: formData.city,
      country: formData.country,
      phone: formData.phone,
      status: 'active' as const,
      email: formData.email
    };

    // Remove undefined values
    Object.keys(userUpdateData).forEach((key) => {
      if (userUpdateData[key] === undefined) {
        delete userUpdateData[key];
      }
    });

    // Update tutor and related user data
    const updatedTutor = await db.tutor.update({
      where: {
        id: id
      },
      data: {
        ...tutorUpdateData,
        user: {
          update: {
            ...userUpdateData,
            token: null,
            expiresAt: null
          }
        }
      },
      include: {
        user: true
      }
    });

    if (!updatedTutor) {
      return { error: 'Failed to update tutor' };
    }

    return {
      success: 'Tutor updated successfully',
      tutor: updatedTutor
    };
  } catch (error) {
    console.error('Error updating tutor:', error);

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('unique constraint')) {
        return { error: 'Email or phone number already exists' };
      }
      if (error.message.includes('foreign key constraint')) {
        return { error: 'Invalid user reference' };
      }
    }

    return { error: 'Error updating tutor. Please try again.' };
  }
};
