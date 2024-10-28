'use server';
import bcrypt from 'bcryptjs';
import { generateToken } from './factoryFunction';
import { sendEmail } from './emailAction';

import { db } from '@/db/db';
interface TutorRegistrationProps {
  bio: string;
  experience: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  state: string;
  address: string;
  city: string;
  bank: string;
  bankaccount: string;
  currentposition: string;
  education: string;
  certification: string;
  subjects: string[];
  online: string;
  profilepic: string;
  nric: string;
  stt: string;
  resume: string;

  // Consider how you'll handle image file storage
}

export const tutorRegistration = async (formData: TutorRegistrationProps) => {
  const { token, expires } = await generateToken();
  const {
    bio,
    experience,
    name,
    email,
    password,
    phone,
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
    stt,
    resume
  } = formData;
  const html = `
    <div>
    <h1>Verify your email</h1>
    <p>Click on the link below to verify your email</p>
    <a href="http://localhost:3000/auth/verify/${token}}">Verify Email</a>
    `;
  try {
    // Check if the user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      // Retrieve the tutor associated with this user
      const existingTutor = await db.tutor.findUnique({
        where: { userId: existingUser.id }
      });

      if (existingTutor) {
        const updatedTutor = await db.tutor.update({
          where: {
            id: existingTutor.id // Use the tutor's ID to update the tutor
          },
          include: {
            user: true
          },
          data: {
            state: state || undefined,
            bank: bank || undefined,
            bankaccount: bankaccount || undefined,
            currentposition: currentposition || undefined,
            education: education || undefined,
            certification: certification || undefined,
            bio: bio || undefined,
            subjects:subjects || undefined,
            teachingOnline: online ? Boolean(online) : undefined,
            experience: experience || undefined,
            profilepic: profilepic || undefined,
            stt: stt || undefined,
            nric: nric || undefined,
            resume: resume || undefined,

            user: {
              update: {
                role: 'tutor',
                name: name || undefined,
                address: address || undefined,
                city: city || undefined,
                phone: phone || undefined,
                token: token || undefined,
                email: email || undefined
              }
            }
          }
        });

        return { success: 'Tutor updated successfully' };
      }
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Handle image upload logic here
    // Example: const imagePath = await uploadImage(image);
    // Create the user
    const tutorWithUser = await db.tutor.create({
      data: {
        state,
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
        stt: stt,
        resume: resume,

        user: {
          create: {
            role: 'tutor',
            name,
            token,
            expiresAt: expires,
            isvarified: false,
            address: address,
            city,
            phone,
            status: 'active',
            email,
            password: hashedPassword
          }
        }
      }
    });

    if (tutorWithUser) {
      const res = await sendEmail({
        mail_from: 'info@<mailtrap.io>',
        mail_to: email,
        subject: 'Verify your email',
        html: html
      });
      return { success: 'Tutor created successfully' };
    }
  } catch (error) {
    console.error('Error creating user:', error);
    return { error: 'Error creating tutor' };
  }
};



export const getAllTutors = async () => {
  const tutors = await db.tutor.findMany();
  return tutors;
};