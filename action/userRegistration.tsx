'use server';

import bcrypt from 'bcryptjs';
import { sendEmail } from './emailAction';
import { generateToken } from './factoryFunction';
const URL = process.env.NEXT_PUBLIC_URL;
import { db } from '@/db/db';

export async function userRegistration(formData: {
  email: string;
  password: string;
  name?: string;
}) {
  const { email, password, name, } =
    formData;
  const { token, expires } = await generateToken();

  if (!email) {
    return { error: 'Email is required' };
  }

  try {
    // Check if the user already exists
    const existingUser = await db.user.findUnique({
      where: {
        email
      }
    });

    if (existingUser) {
      return { error: 'User already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || '',
        role: 'parent',
        status: 'pendingApproval',
        token: token,
        expiresAt: expires,
        isvarified: false,
        onboarding: false
      }
    });

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7; color: #333; line-height: 1.6;">
      <h1 style="color: #2c3e50; text-align: center;">Verify Your Email</h1>
      <p style="font-size: 16px; color: #7f8c8d;">Hi there,</p>
      <p style="font-size: 16px; color: #7f8c8d;">
        Thanks for signing up with UhilAcademy! Please confirm your email address by clicking the button below.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${URL}/auth/verify/${token}" 
          style="display: inline-block; padding: 12px 24px; background-color: #27ae60; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">
          Verify Email
        </a>
      </div>
      <p style="font-size: 14px; color: #95a5a6; text-align: center;">
        If you didn’t sign up, you can safely ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #ececec; margin: 40px 0;" />
      <p style="font-size: 12px; color: #bdc3c7; text-align: center;">
        © 2024 UhilAcademy. All rights reserved.<br>
        UhilAcademy, 123 Main Street, Kuala Lumpur, Malaysia
      </p>
    </div>
  `;

    // Send verification email
    const result = await fetch(`${URL}/api/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        emailTo: user.email,
        html: html,
        subject: 'Verify your email'
      })
    });

    return { user, error: null };
  } catch (error) {
    console.error('Error registering user:', error);
    return { user: null, error:'Error registering user' };
  }
}


export async function updateUser(userId: string, updateData: {
  name?: string;
  phone?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  password?: string;
  
}) {
  try {
    // Update the user details
    const updatedUser = await db.user.update({
      where: {
        id: userId
      },
      data: {
        name: updateData.name || undefined,
        phone: updateData.phone || undefined,
        address: updateData.address || undefined,
        country: updateData.country || undefined,
        state: updateData.state || undefined,
        city: updateData.city || undefined,
        password: updateData.password ? await bcrypt.hash(updateData.password, 12) : undefined,
      }
    });

    return { user: updatedUser, error: null };
  } catch (error) {
    console.error('Error updating user:', error);
    return { user: null, error };
  }
}



export const getUser = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email
    }
  });
  return user;
};

export const getUserById = async (id: string) => {
  const user = await db.user.findUnique({
    where: {
      id
    }
  });
  return user;
};




export const requestPasswordReset = async (formData: {
  email: string;
}) => {
  const { email } = formData;
  const existing = await db.user.findUnique({
    where: {
      email
    }
  });
  if (existing) {
const { token, expires } = await generateToken();
    const user = await db.user.update({
      where: {
        email
      },
      data: {
        token: token,
        expiresAt: expires
      }
    });

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7; color: #333; line-height: 1.6;">
      <h1 style="color: #2c3e50; text-align: center;">Reset Your Password</h1>
      <p style="font-size: 16px; color: #7f8c8d;">Hi there,</p>
      <p style="font-size: 16px; color: #7f8c8d;">
        You recently requested to reset your password. Click on the button below to proceed.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${URL}/auth/password-reset/${user.token}" 
          style="display: inline-block; padding: 12px 24px; background-color: #2980b9; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">
          Reset Password
        </a>
      </div>
      <p style="font-size: 14px; color: #95a5a6; text-align: center;">
        If you didn’t request this, please ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #ececec; margin: 40px 0;" />
      <p style="font-size: 12px; color: #bdc3c7; text-align: center;">
        © 2024 UhilAcademy. All rights reserved.<br>
        UhilAcademy, 123 Main Street, Kuala Lumpur, Malaysia
      </p>
    </div>
  `;
  
    
    //sending email using 
    const result = await fetch(`${URL}/api/send`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        emailTo: user.email,
        html: html,
        subject: 'Reset your password'
      })
    })

    const res = await sendEmail({
      mail_from: 'info@<mailtrap.io>',
      mail_to: user.email,
      subject: 'Reset your password',
      html: html
    });
    return user;
  }
};



/// create password reset function
export const resetPassword = async (
 password: string,token: string 
) => {
  const user = await db.user.findFirst({
    where: {
      token
    }
  });
  if (user) {
    const hashedPassword = await bcrypt.hash(password, 12);
    const res = await db.user.update({
      where: {
        id: user.id
      },
      data: {
        password: hashedPassword,
        token: '',
      }
    });
    return res;
  }
};