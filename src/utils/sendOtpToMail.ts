import nodemailer from "nodemailer";

export const sentOtpToEmail = (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use your email service provider
    auth: {
      user: process.env.TRANSPORTER_EMAIL,
      pass: process.env.TRANSPORTER_PASSWORD,
    },
  });

  //interface for mail options
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
    subject: "OTP Verification",
    text: `Welcome to Agri Connect, Your Otp for registration is :${otp}`,
  };

  const sendEmail = async (mailOptions: MailOptions): Promise<boolean> => {
    try {
      await transporter.sendMail(mailOptions);

      // console.log("Mail Send to ", mailOptions.to);
      //if otp success return true;
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      //if otp fails return false;
      return false;
    }
  };
  return sendEmail(mailOptions);
};
