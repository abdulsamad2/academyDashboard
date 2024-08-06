'use server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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
  image: File;  // Consider how you'll handle image file storage
}

export const tutorRegistration = async (formData: TutorRegistrationProps) => {
  const {
    bio, experience, name, email, password, phone, state, address, city,
    bank, bankaccount, currentposition, education, certification, subjects, online, image
  } = formData;

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where:formData.email
    });
    if (existingUser) {
      return { error: 'User already exists with this email' };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Handle image upload logic here
    // Example: const imagePath = await uploadImage(image);

    // Create the user
    const tutorWithUser = await prisma.tutor.create({
      data: {
        bio,
        experience,
        currentposition,
        education,
        certification,
        subjects: subjects.join(','),  // Ensure the schema supports this
        image: image.name,  // Update with actual image path or URL if needed
        online,
        bank,
        bankaccount,
        phone,
        state,
        address,
        city,
        user: {
          create: {
            role: 'tutor',
            name,
            phone,
            status: 'active',
            email,
            password: hashedPassword
          }
        }
      },
      include: { user: true }
    });

    console.log('User created successfully:', tutorWithUser);

    return { success: 'Tutor created successfully' };
  } catch (error) {
    console.error('Error creating user:', error);
    return { error: 'Error creating tutor' };
  }
}
