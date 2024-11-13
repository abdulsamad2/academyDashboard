"use server";

/**
 * Generates a 6-digit OTP
 * @returns {string} The generated OTP
 */
function generateOTP() {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}


export async function sendOTP(phoneNumber: string) {
  // Validate phone number format
  if (!phoneNumber.match(/^\+92\d{10}$/)) {
    throw new Error("Invalid Pakistani phone number format. Use format: +92XXXXXXXXXX");
  }

  const otp = generateOTP();
  const message = `Your OTP is: ${otp}`;
  try{
    return otp;
    const res = await fetch(`https://www.sms123.net/api/send.php?apiKey=[7d2a746e49c8649f5cb069e6397efdf3]&recipients=[${phoneNumber}]&messageContent=[${message}]`)
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP. Please try again later.");
  }
}