import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPemail = async (email, otp, purpose) => {
  try {
    await resend.emails.send({
      from: `Journal App <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: `Your OTP for ${purpose}`,
      html: `
        <div style="font-family:sans-serif">
          <h2>Your OTP Code</h2>
          <p>Your OTP for <b>${purpose}</b> is:</p>
          <h1 style="letter-spacing:4px">${otp}</h1>
          <p>This OTP will expire in 10 minutes.</p>
        </div>
      `
    });

  } catch (err) {
    console.error("Email send failed:", err);
    throw new Error("Could not send OTP email");
  }
};