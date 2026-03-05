import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPemail = async (email, otp, purpose) => {
  try {
    const response = await resend.emails.send({
      from: `Journal App <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: `Your OTP for ${purpose}`,
      html: `
        <h2>Your OTP</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This expires in 10 minutes.</p>
      `
    });

    console.log("EMAIL SENT:", response);

  } catch (err) {
    console.error("EMAIL ERROR:", err);
    throw new Error("Could not send OTP email");
  }
};