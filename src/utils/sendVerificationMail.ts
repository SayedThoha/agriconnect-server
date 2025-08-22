import nodemailer from "nodemailer";

export const sendVerificationMail = (email: string, message: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.TRANSPORTER_EMAIL,
      pass: process.env.TRANSPORTER_PASSWORD,
    },
  });

  interface MailOptions {
    from: string | undefined;
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }
  const mailOptions = {
    from: process.env.TRANSPORTER_EMAIL,
    to: email,
    subject: "verification of account",
    text: `${message}`,
  };

  const sendEmail = async (mailOptions: MailOptions): Promise<boolean> => {
    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  };
  return sendEmail(mailOptions);
};
