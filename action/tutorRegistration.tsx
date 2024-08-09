'use server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {uploadFiles } from './factoryFunction';

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
  image: File;
  nric:File;
  resume:File;
  stt:File;
  arf:File;
    // Consider how you'll handle image file storage
}


export const tutorRegistration = async (formData: TutorRegistrationProps) => {
const data =[]
  for (const [key, value] of formData.entries()) {
    data[key] = value;
}

const { bio, experience,resume,nric,stt,arf, name, email, password, phone, state, address, city, bank, bankaccount, currentposition, education, certification, subjects, online, image } =data;
try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
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
        state ,                  
        bank     ,        
        bankaccount,      
        currentposition,  
        education,        
        certification ,   
        teachingOnline: Boolean(online), //convert string to boolean 
        experince:experience, 
        bio,
       
        user: {
          create: {
            role: 'tutor',
            name,
           street: address,
            city,
            phone,
            status: 'active',
            email,
            password: hashedPassword
          }
        }
      },
    });
    
    const result = await fetch('/api/upload',{
        method: 'POST',
        body: formData
    }) // Assuming ServerUpload is a function that handles file uploads ServerUpload()
    const data = await result.json()
    return { success: 'Tutor created successfully' };
  } catch (error) {
    console.error('Error creating user:', error);
    return { error: 'Error creating tutor' };
  }
}
