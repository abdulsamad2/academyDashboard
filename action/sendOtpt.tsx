"use server";

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


export async function sendOTP(phoneNumber: string,otp:string) {
  // Validate phone number format
  if (!phoneNumber.match(/^\+60\d{9}$/)) {
    throw new Error("Invalid Malaysaian phone number format. Use format: +60XXXXXXXXXX");
  }
  const message = `RM0 UHIL Academy: Your OTP is  ${otp}. This code will expire in 10 minutes`;
  try{
    const res = await fetch(`https://www.sms123.net/api/send.php?apiKey=7d2a746e49c8649f5cb069e6397efdf3&recipients=${phoneNumber}&messageContent=${message}`)
     return res
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP. Please try again later.");
  }
}