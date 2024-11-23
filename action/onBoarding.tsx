'use server';
import { db } from '@/db/db';

export const parentRegistration = async (parentData: {
  id: string;
  name?: string;
  phone?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
}) => {
  const { id, name, phone, address, country, state, city } = parentData;
  try {
    const res = await db.user.update({
      where: {
        id
      },
      data: {
        onboarding: false,
        role: 'parent',
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
    return { user: res };
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
};
export const tutorOnboarding = async (formData: {
  id: string;
  degree?: string;
  age?: string;
  state?: string;
  country?: string;
  bank?: string;
  bankaccount?: string;
  currentposition?: string;
  education?: string;
  certification?: string;
  bio?: string;
  levels?: string;
  subjects?: string;
  online?: string;
  experience?: string;
  profilepic?: string;
  spm?: string;
  nric?: string;
  resume?: string;
  address?: string;
  city?: string;
  phone?: string;
  name?: string;
}) => {
  const {
    state,
    bank,
    bankaccount,
    currentposition,
    education,
    certification,
    bio,
    name,
    subjects,
    online,
    id,
    experience,
    profilepic,
    spm,
    degree,
    age,
    nric,
    resume,
    address,
    levels,
    city,
    phone,
    country
  } = formData;

  try {
    // Find the existing user by ID
    const existingUser = await db.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return { error: 'User not found' };
    }

    // Update the user details first
    await db.user.update({
      where: { id },
      data: {
        name: name || undefined,
        role: 'tutor',
        onboarding: false,
        address: address || undefined,
        city: city || undefined,
        phone: phone || undefined,
        country: country || undefined,
        state: state || undefined
      }
    });

    // Upsert the tutor (create if it doesn't exist, update if it does)
    const upsertedTutor = await db.tutor.upsert({
      where: {
        userId: existingUser.id // Assuming userId is the unique link between tutor and user
      },
      update: {
        bank: bank || undefined,
        bankaccount: bankaccount || undefined,
        currentposition: currentposition || undefined,
        education: education || undefined,
        certification: certification || undefined,
        bio: bio || undefined,
        age: age || undefined,
        degree: degree || undefined,
        teachinglevel: levels || undefined,
        //@ts-ignore
        subjects: subjects || undefined,
        teachingOnline: online ? Boolean(online) : undefined,
        experience: experience || undefined,
        profilepic: profilepic || undefined,
        nric: nric || undefined,
        resume: resume || undefined,
        spm: spm || undefined
      },
      create: {
        bank: bank || undefined,
        bankaccount: bankaccount || undefined,
        currentposition: currentposition || undefined,
        education: education || undefined,
        certification: certification || undefined,
        bio: bio || undefined,
        age: age || undefined,
        degree: degree || undefined,
        teachinglevel: levels || undefined,
        //@ts-ignore
        subjects: subjects || undefined,
        teachingOnline: online ? Boolean(online) : undefined,
        experience: experience || undefined,
        profilepic: profilepic || undefined,
        nric: nric || undefined,
        resume: resume || undefined,
        spm: spm || undefined,
        user: {
          connect: {
            id: existingUser.id
          }
        }
      }
    });

    return { success: 'Tutor upserted successfully', tutor: upsertedTutor };
  } catch (error) {
    console.error('Error during tutor onboarding:', error);
    return { error: 'Failed to onboard tutor' };
  }
};
