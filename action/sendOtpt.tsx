'use server';

/**
 * Generates a 6-digit OTP
 * @returns {string} The generated OTP
 */
export async function generateOTP() {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

export async function sendOTP(phoneNumber: string, otp: string) {
  // Validate phone number format
  if (!phoneNumber.match(/^\+60(1\d{8}|11\d{8})$/)) {
    throw new Error(
      'A valid Malaysian mobile number is required (e.g. +60123456789). Landline numbers cannot be used for registration — the verification code is sent by SMS.'
    );
  }
  const message = `RM0 UHIL Academy: Your OTP is  ${otp}. This code will expire in 10 minutes`;
  const apiKey = process.env.SMS_KEY ?? process.env.NEXT_PUBLIC_SMS_KEY;
  const url =
    `https://www.sms123.net/api/send.php` +
    `?apiKey=${encodeURIComponent(apiKey ?? '')}` +
    `&recipients=${encodeURIComponent(phoneNumber)}` +
    `&messageContent=${encodeURIComponent(message)}`;
  try {
    const res = await fetch(url);
    // The gateway returns HTTP 200 even on failure; the real status is in the body.
    const body = await res.json().catch(() => null);
    if (!res.ok || !body || body.status !== 'ok') {
      console.error('SMS gateway rejected send:', body ?? res.statusText);
      throw new Error(body?.statusMsg || 'SMS gateway rejected the message.');
    }
    return { success: true as const, referenceID: body.referenceID };
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP. Please try again later.');
  }
}
