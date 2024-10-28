'use server';
import { db } from "@/db/db";

export const parentRegistration = async (parentData: {
  id?: string;
  name?: string;
  phone?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
}) => {
  const {id ,name, phone, address, country, state, city } = parentData;
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
    return { user: res, };
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
};
export const tutorOnboarding = async (formData: {
  id?: string;
  state?: string;
  bank?: string;
  bankaccount?: string;
  currentposition?: string;
  education?: string;
  certification?: string;
  bio?: string;
  subjects?: string;
  online?: string;
  experience?: string;
  profilepic?: string;
  stt?: string;
  nric?: string;
  resume?: string;
  address?: string;
  city?: string;
  phone?: string;
}) => {
  const {
    state,
    bank,
    bankaccount,
    currentposition,
    education,
    certification,
    bio,
    subjects,
    online,
    id,
    experience,
    profilepic,
    stt,
    nric,
    resume,
    address,
    city,
    phone,
  } = formData;

  // Find the existing user by ID
  const existingUser = await db.user.findUnique({
    where: { id }
  });


  if (existingUser) {
    // Update the user details first
    await db.user.update({
      where: { id },
      data: {
        role: 'tutor',
        onboarding: false,
        address: address || undefined,
        city: city || undefined,
        phone: phone || undefined,
      },
    });

    // Upsert the tutor (create if it doesn't exist, update if it does)
    const upsertedTutor = await db.tutor.upsert({
      where: {
        userId: existingUser.id, // Assuming userId is the unique link between tutor and user
      },
      update: {
        state: state || undefined,
        bank: bank || undefined,
        bankaccount: bankaccount || undefined,
        currentposition: currentposition || undefined,
        education: education || undefined,
        certification: certification || undefined,
        bio: bio || undefined,
        //@ts-ignore
        subjects: subjects || undefined,
        teachingOnline: online ? Boolean(online) : undefined,
        experience: experience || undefined,
        profilepic: profilepic || undefined,
        stt: stt || undefined,
        nric: nric || undefined,
        resume: resume || undefined,
      },
      create: {
        state: state || undefined,
        bank: bank || undefined,
        bankaccount: bankaccount || undefined,
        currentposition: currentposition || undefined,
        education: education || undefined,
        certification: certification || undefined,
        bio: bio || undefined,
        //@ts-ignore
        subjects: subjects || undefined,
        teachingOnline: online ? Boolean(online) : undefined,
        experience: experience || undefined,
        profilepic: profilepic || undefined,
        stt: stt || undefined,
        nric: nric || undefined,
        resume: resume || undefined,

        // Connect the tutor to the existing user
        user: {
          connect: { id: existingUser.id },
        },
      },
    });

    return { success: 'Tutor upserted successfully', tutor: upsertedTutor };
  } else {
    return { error: 'User not found' };
  }
};

