'use server';

import bcrypt from 'bcryptjs';
import { db } from '@/db/db';
import { generateOTP, sendOTP } from './sendOtpt';
import { auth } from '@/auth';
import { rateLimit } from '@/lib/rate-limit';
import { requireAdmin } from '@/lib/authz';

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
  const role = session?.role;

  if (!email?.trim()) return { error: 'Email is required' };
  if (!phone?.trim()) return { error: 'Phone is required' };
  if (!password?.trim()) return { error: 'Password is required' };

  try {
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) return { error: 'User already exists' };

    const mobileOtp = await generateOTP();

    try {
      const mobileResult = await sendOTP(phone, mobileOtp);
      if (!mobileResult) {
        return { error: 'Invalid phone number. Please try again.' };
      }
    } catch (otpError) {
      console.error('Error sending mobile OTP:', otpError);
      return {
        error: 'Failed to send mobile OTP. Please check the phone number.'
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const isAdminCreated = role === 'admin';

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
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        isvarified: isAdminCreated,
        emailVerified: isAdminCreated,
        phoneVerified: isAdminCreated,
        onboarding: false
      }
    });

    return { user, error: null };
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
    adminId?: string;
  }
) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return { user: null, error: guard.error };
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name: updateData.name || undefined,
        phone: updateData.phone || undefined,
        address: updateData.address || undefined,
        country: updateData.country || undefined,
        state: updateData.state || undefined,
        city: updateData.city || undefined,
        status: updateData.status,
        role: updateData.role,
        adminId: updateData.adminId || undefined,
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
  return db.user.findUnique({ where: { email } });
};

export const getUserById = async (id: string) => {
  return db.user.findUnique({
    where: { id },
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
      updatedAt: true,
      adminId: true
    }
  });
};

export const resetPassword = async (
  phone: string,
  otp: string,
  password: string
) => {
  if (!phone || !otp || !password) {
    return { error: 'Missing required fields.' };
  }
  const user = await db.user.findFirst({ where: { phone } });
  // Proof of OTP ownership is required — this is the actual security gate,
  // not the client-side step state. Re-verify here and consume the OTP.
  if (!user || !user.otp || user.otp !== otp) {
    return { error: 'Invalid or expired code.' };
  }
  if (user.expiresAt && user.expiresAt < new Date()) {
    return { error: 'Code has expired. Please request a new one.' };
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await db.user.update({
    where: { id: user.id },
    data: { password: hashedPassword, otp: '' }
  });
  return { success: 'Password updated.' };
};

export const verifyMobile = async (phone: string, otp: string) => {
  try {
    const user = await db.user.findFirst({ where: { phone } });
    if (!user || user.otp !== otp) {
      return { error: 'Invalid code' };
    }
    return db.user.update({
      where: { id: user.id },
      data: {
        otp: '',
        phoneVerified: true,
        isvarified: true,
        onboarding: true
      }
    });
  } catch (error) {
    console.error('Error verifying mobile:', error);
    return { error: 'Error verifying mobile number' };
  }
};

export const requestNewOtp = async () => {
  try {
    const session = await auth();
    if (!session?.id) {
      return {
        error: 'User session is invalid or expired. Please log in again.'
      };
    }

    const limited = rateLimit({
      key: `otp:resend:${session.id}`,
      limit: 3,
      windowMs: 10 * 60 * 1000
    });
    if (!limited.success) {
      return { error: 'Too many OTP requests. Please wait a few minutes.' };
    }

    const generatedOtp = await generateOTP();
    if (!generatedOtp) {
      return { error: 'Failed to generate OTP. Please try again later.' };
    }

    const user = await db.user.findUnique({ where: { id: session.id } });
    if (!user) {
      return {
        error: 'User not found. Please ensure you are logged in correctly.'
      };
    }

    const updatedUser = await db.user.update({
      where: { id: session.id },
      data: { otp: generatedOtp }
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
  } catch (error) {
    console.error('Error in requestNewOtp:', error);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
};

export const requestResetOtp = async (phone: string) => {
  try {
    if (!phone?.trim()) return { error: 'Phone is required' };

    const limited = rateLimit({
      key: `otp:reset:${phone}`,
      limit: 3,
      windowMs: 10 * 60 * 1000
    });
    if (!limited.success) {
      return { error: 'Too many OTP requests. Please wait a few minutes.' };
    }

    const generatedOtp = await generateOTP();
    if (!generatedOtp) {
      return { error: 'Failed to generate OTP. Please try again later.' };
    }

    const user = await db.user.findUnique({ where: { phone } });
    if (!user) {
      return { error: 'User not found with this number.' };
    }

    const updatedUser = await db.user.update({
      where: { phone },
      data: { otp: generatedOtp }
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
  } catch (error) {
    console.error('Error in requestResetOtp:', error);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
};

export const verifyOTP = async (phone: string, otp: string) => {
  try {
    if (!phone || typeof phone !== 'string') {
      return { error: 'Invalid phone number provided' };
    }
    if (!otp || typeof otp !== 'string' || otp.length !== 6) {
      return { error: 'Invalid OTP. Must be a 6-digit code.' };
    }

    const user = await db.user.findFirst({ where: { phone } });
    if (!user) {
      return { error: 'User not found for the provided phone number.' };
    }
    if (!user.otp || user.otp !== otp) {
      return { error: 'Invalid OTP. Please try again.' };
    }
    if (user.expiresAt && user.expiresAt < new Date()) {
      return { error: 'Code has expired. Please request a new one.' };
    }

    // Do NOT clear the OTP here — resetPassword re-verifies it as the real
    // gate and consumes it. Clearing now would let the password step run
    // without any proof of ownership.
    return { success: 'OTP verified successfully.' };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { error: 'An unexpected error occurred while verifying OTP.' };
  }
};
