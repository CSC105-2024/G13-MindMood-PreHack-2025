import nodemailer from 'nodemailer';

export const sendResetEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!
    }
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Password',
    text: `http://localhost:5173/resetPassword/${token}`,
  });

  return info;
};
