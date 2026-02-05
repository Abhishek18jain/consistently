import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPemail = async (email, otp, purpose) => {
  try {
    await transporter.sendMail({
      from: `"Journal App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your OTP for ${purpose}`,
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    });
  } catch (err) {
    console.error("Email send failed:", err);
    throw new Error("Could not send OTP email");
  }
};
