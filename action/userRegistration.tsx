'use server';

import bcrypt from 'bcryptjs';
import { sendEmail } from './emailAction';
import { generateToken } from './factoryFunction';
const URL = process.env.NEXT_PUBLIC_URL;
import { db } from '@/db/db';
import { generateOTP, sendOTP } from './sendOtpt';
import { auth } from '@/auth';

export async function userRegistration(formData: {
  email: string;
  password: string;
  phone: string;
  name?: string;
  city?: string;
  address?: string;
  state?: string;
}) {
  const { name, address, city, state, email, password, phone } = formData;
  const session = await auth();
  //@ts-ignore
  const role = session?.role;
  // Input validation
  if (!email?.trim()) {
    return { error: 'Email is required' };
  }
  if (!phone?.trim()) {
    return { error: 'Phone is required' };
  }
  if (!password?.trim()) {
    return { error: 'Password is required' };
  }

  try {
    // Check if the user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { error: 'User already exists' };
    }

    // Generate OTPs
    const emailOtp = await generateOTP();
    const mobileOtp = await generateOTP();

    // Prepare email template
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7; color: #333; line-height: 1.6;">
      <h1 style="color: #2c3e50; text-align: center;">Verify Your Email</h1>
      <p style="font-size: 16px; color: #7f8c8d;">Hi there,</p>
      <p style="font-size: 16px; color: #7f8c8d;">
        Thank you for signing up with UhilAcademy! To complete your registration, please enter the OTP code below on the verification page.
      </p>
      <div style="text-align: center; margin: 30px 0; font-size: 24px; font-weight: bold; color: #27ae60;">
        ${emailOtp}
      </div>
      <p style="font-size: 14px; color: #95a5a6; text-align: center;">
        This code will expire in 10 minutes. If you didn't sign up, you can safely ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #ececec; margin: 40px 0;" />
      <p style="font-size: 12px; color: #bdc3c7; text-align: center;">
        © 2024 UhilAcademy. All rights reserved.<br>
        UhilAcademy, 123 Main Street, Kuala Lumpur, Malaysia
      </p>
    </div>
    `;

    // Define API URL
    const API_URL = process.env.NEXT_PUBLIC_URL || 'https://localhost:3000';

    // First verify phone number
    let mobileVerified = false;
    try {
      const mobileResult = await sendOTP(phone, mobileOtp);
      if (!mobileResult) {
        return { error: 'Invalid phone number. Please try again.' };
      }
      mobileVerified = true;
    } catch (otpError) {
      console.error('Error sending mobile OTP:', otpError);
      return {
        error: 'Failed to send mobile OTP. Please check the phone number.'
      };
    }

    if (mobileVerified) {
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create the user
      const user = await db.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || undefined,
          city: city || undefined,
          address: address || undefined,
          state: state || undefined,
          phone,
          role: 'parent',
          status: 'active',
          otp: mobileOtp,
          token: '',
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
          isvarified: role == 'admin' ? true : false,
          emailVerified: role == 'admin' ? true : false,
          phoneVerified: role == 'admin' ? true : false,
          onboarding: false
        }
      });

      return { user, error: null };
    } else {
      return { error: 'Verification failed. Please try again.' };
    }
  } catch (error) {
    console.error('Error registering user:', error);
    return { error: 'Error registering user' };
  }
}

export async function updateUser(
  userId: string,
  updateData: {
    name?: string;
    phone?: string;
    address?: string;
    country?: string;
    state?: string;
    city?: string;
    password?: string;
    status: 'active' | 'disabled' | 'pendingApproval';
    role: 'admin' | 'parent' | 'tutor';
  }
) {
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
        status: updateData.status,
        role: updateData.role,
        password: updateData.password
          ? await bcrypt.hash(updateData.password, 12)
          : undefined
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
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      city: true,
      state: true,
      country: true,
      address: true,
      phone: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  });
  return user;
};

export const requestPasswordReset = async (formData: { email: string }) => {
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
    const result = await fetch(`${URL}/api/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        emailTo: user.email,
        html: html,
        subject: 'Reset your password'
      })
    });

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
export const resetPassword = async (phone: string, password: string) => {
  const user = await db.user.findFirst({
    where: {
      phone
    }
  });
  if (user) {
    const hashedPassword = await bcrypt.hash(password, 12);
    const res = await db.user.update({
      where: {
        id: user.id
      },
      data: {
        password: hashedPassword
      }
    });
    return res;
  }
};

// make a comprehensive verify method which verifiy number and email with different otp and then set user to isverfied
export const verifyEmail = async (email: string, otp: string) => {
  try {
    const user = await db.user.findFirst({
      where: {
        email
      }
    });
    if (user) {
      if (user.token === otp) {
        const res = await db.user.update({
          where: {
            id: user.id
          },
          data: {
            token: '',
            emailVerified: true
          }
        });
        return res;
      }
    }
  } catch (error) {
    return { error: 'Error verifying email' };
  }
};

export const verifyMobile = async (phone: string, otp: string) => {
  try {
    const user = await db.user.findFirst({
      where: {
        phone
      }
    });
    if (user) {
      if (user.otp === otp) {
        const res = await db.user.update({
          where: {
            id: user.id
          },
          data: {
            otp: '',
            phoneVerified: true,
            isvarified: true,
            onboarding: true
          }
        });
        return res;
      }
    }
  } catch (error) {
    return { error: 'Error verifying mobile number' };
  }
};

export const requestNewOtp = async () => {
  try {
    const session = await auth();
    //@ts-ignore
    if (!session?.id) {
      return {
        error: 'User session is invalid or expired. Please log in again.'
      };
    }

    const generatedOtp = await generateOTP();
    if (!generatedOtp) {
      return { error: 'Failed to generate OTP. Please try again later.' };
    }

    const user = await db.user.findUnique({
      where: {
        //@ts-ignore
        id: session.id
      }
    });
    if (!user) {
      return {
        error: 'User not found. Please ensure you are logged in correctly.'
      };
    }

    const updatedUser = await db.user.update({
      where: {
        //@ts-ignore
        id: session.id
      },
      data: {
        otp: generatedOtp
      }
    });
    if (!updatedUser) {
      return { error: 'Failed to update OTP. Please try again later.' };
    }

    const mobileResult = await sendOTP(user.phone, generatedOtp);
    if (!mobileResult) {
      return {
        error: 'Invalid phone number or SMS sending failed. Please try again.'
      };
    }
    return {
      success: 'A new OTP has been sent to your registered phone number.'
    };
  } catch (error: unknown) {
    console.error('Error in requestNewOtp:', error);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
};

export const requestResetOtp = async (phone: string) => {
  try {
    const generatedOtp = await generateOTP();
    if (!generatedOtp) {
      return { error: 'Failed to generate OTP. Please try again later.' };
    }

    const user = await db.user.findUnique({
      where: {
        phone
      }
    });
    if (!user) {
      return {
        error: 'User not found with this number.'
      };
    }

    const updatedUser = await db.user.update({
      where: {
        phone
      },
      data: {
        otp: generatedOtp
      }
    });
    if (!updatedUser) {
      return { error: 'Something went wrong. Please try again later.' };
    }

    const mobileResult = await sendOTP(user.phone, generatedOtp);
    if (!mobileResult) {
      return {
        error: 'Invalid phone number or SMS sending failed. Please try again.'
      };
    }
    return {
      success: 'A new OTP has been sent to your registered phone number.'
    };
  } catch (error: unknown) {
    console.error('Error in requestNewOtp:', error);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
};

export const verifyOTP = async (phone: string, otp: string) => {
  try {
    // Check if the input parameters are valid
    if (!phone || typeof phone !== 'string') {
      throw new Error('Invalid phone number provided');
    }

    if (!otp || typeof otp !== 'string' || otp.length !== 6) {
      throw new Error('Invalid OTP provided. OTP must be a 6-digit string.');
    }

    // Find user by phone number
    const user = await db.user.findFirst({
      where: { phone }
    });

    if (!user) {
      return { error: 'User not found for the provided phone number.' };
    }

    // Verify if the provided OTP matches the one stored in the database
    if (user.otp !== otp) {
      return { error: 'Invalid OTP. Please try again.' };
    }

    // OTP matches, proceed to clear it from the database
    await db.user.update({
      where: { id: user.id },
      data: { otp: '' }
    });

    return { success: 'OTP verified successfully.' };
  } catch (error: any) {
    // Log the error for debugging (avoid exposing sensitive details in production)
    console.error('Error verifying OTP:', error.message);

    // Return a generic error message to the client
    return {
      error:
        error.message || 'An unexpected error occurred while verifying OTP.'
    };
  }
};
