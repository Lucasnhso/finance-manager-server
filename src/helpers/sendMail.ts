import nodemailer from "nodemailer";

interface SendMail {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendMail({ to, subject, text, html }: SendMail) {
  const transporter = nodemailer.createTransport({
    host: "smtp.umbler.com",
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    const { response } = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}
