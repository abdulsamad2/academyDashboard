'use server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface TutorRegistrationProps {
  email: string;
  name: string;
  hourly: string;
  dob: string;
  teaches: string;
  bio: string;
  availability: string;
  language: string;
  password: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
  yearsOfExperience: string;
  qualifications: string;
  expertise: string;
  
}


export const   tutorRegistration =async(formData:TutorRegistrationProps)=> {

  const {bio, street,city ,country,email, name,hourly,dob,teaches,availability,language, password,postalCode,yearsOfExperience,qualifications,expertise } = formData;
  if (!email) {
    throw new Error('Email and password are required');
  }

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (existingUser) {
      return {
        error: 'User already exists with this email'
      };
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    const tutorWithUser = await prisma.tutor.create({
      data: {
        yearsOfExperience: parseInt(yearsOfExperience, 10),
        qualifications,
        expertise,
        language: language.split(', ').map((item) => item.trim()),
        hourly: parseFloat(hourly),
        dob: new Date(dob),
        teaches: teaches.split(',').map((item) => item.trim()),

        user: {
          create: {
            role: 'tutor',
            name,
            street,
            city ,
            country,
            postalCode,
            status: 'active',
            email,
            password: hashedPassword
          }
        }
      },
      include: {
        user: true
      }
    })
    console.log('User created successfully:', tutorWithUser);


    return {
      success: 'tutor created successfully'
    };
  } catch (error) {
    console.error('Error creating user:', error);
  }
}
