'use server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken, uploadFiles } from './factoryFunction';
import { sendEmail } from './emailAction';

const prisma = new PrismaClient();

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
  image: [];

  // Consider how you'll handle image file storage
}

export const tutorRegistration = async (formData: TutorRegistrationProps) => {
  const data = [];
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
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
    imgUrl
  } = data;
  const html = `
    <div>
    <h1>Verify your email</h1>
    <p>Click on the link below to verify your email</p>
    <a href="http://localhost:3000/auth/verify/${token}}">Verify Email</a>
    `;
  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      const updatedTutor = await prisma.tutor.update({
        where: {
          id: existingUser.id
        },
        data: {
          state,
          bank,
          bankaccount,
          currentposition,
          education,
          certification,
          bio,
          teachingOnline: Boolean(online), //convert string to boolean
          experience: experience,
          documents: [imgUrl],
          user: {
            create: {
              role: 'tutor',
              name,
              street: address,
              city,
              phone,

              email
            }
          }
        }
      });
      return { success: 'Tutor updated successfully' };
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Handle image upload logic here
    // Example: const imagePath = await uploadImage(image);
    // Create the user
    const tutorWithUser = await prisma.tutor.create({
      data: {
        state,
        bank,
        bankaccount,
        currentposition,
        education,
        certification,
        bio,
        subjects: subjects.map((subject) => subject),
        teachingOnline: Boolean(online), //convert string to boolean
        experience: experience,
        documents: imgUrl,

        user: {
          create: {
            role: 'tutor',
            name,
            token,
            expiresAt: expires,
            isvarified: false,
            street: address,
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
