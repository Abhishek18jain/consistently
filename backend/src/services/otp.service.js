const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;

export function generateOTP(user) {
  const otp = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  user.otp = otp;
  user.otpExpiresAt = new Date(
    Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
  );
  user.otpAttempts = 0;

  return otp;
}

export function validateOTP(user, inputOtp) {
  if (!user.otp) throw new Error("OTP not generated");

  if (user.otpAttempts >= MAX_OTP_ATTEMPTS)
    throw new Error("OTP attempts exceeded");

  if (user.otpExpiresAt < new Date())
    throw new Error("OTP expired");

  if (user.otp !== inputOtp) {
    user.otpAttempts += 1;
    throw new Error("Invalid OTP");
  }

  return true;
}

export function clearOTP(user) {
  user.otp = null;
  user.otpExpiresAt = null;
  user.otpAttempts = 0;
}
