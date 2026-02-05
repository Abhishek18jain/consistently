import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
   tls: {
    rejectUnauthorized: false,
  },


});
  transporter.verify().then(console.log ,"transported").catch(console.error,"transported");

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
