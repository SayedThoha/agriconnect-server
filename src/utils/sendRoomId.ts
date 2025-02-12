import nodemailer from "nodemailer";

export const generateMailForRoomId = async (email: string, roomId: string) => {
  console.log("generateMailForRoomId function");
  // const roomId = roomId;
  console.log("roomId:", roomId);

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

  console.log("mailoptions:", mailOptions);

  return new Promise((resolve, reject) => {
    transpoter.sendMail(mailOptions, (err) => {
      console.log("get into return");
      if (err) {
        console.log("error while generating otp");
        reject(err.message);
      } else {
        console.log("generated otp for registration:");
        resolve("otp,resolved email generation for roomId");
      }
    });
  });
};
