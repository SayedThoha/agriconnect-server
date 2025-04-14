import nodemailer from "nodemailer";

export const generateMailForRoomId = async (email: string, roomId: string) => {
  const transpoter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.TRANSPORTER_EMAIL,
      pass: process.env.TRANSPORTER_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.TRANSPORTER_EMAIL,
    to: email,
    subject: "roomId for the video consultation",
    text: `ROOMID:${roomId}. Your roomId from agriconnect application for the expert consultation through video conference is: ${roomId}.Copy this code and fill the field fo roomId and join.`,
  };

  return new Promise((resolve, reject) => {
    transpoter.sendMail(mailOptions, (err) => {
      if (err) {
        reject(err.message);
      } else {
        resolve("room id send");
      }
    });
  });
};
