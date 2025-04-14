import nodemailer from "nodemailer";

export const update_slot_time_through_email = async (
  userEmail: string,
  expertEmail: string
) => {
  const transpoter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.TRANSPORTER_EMAIL,
      pass: process.env.TRANSPORTER_PASSWORD,
    },
  });

  const userMailOptions = {
    from: process.env.TRANSPORTER_EMAIL,
    to: userEmail,
    subject: "Reminder: Your agriconnect Consultation Starts in 10 Minutes",
    text: `Dear ${userEmail},
  
      This is a quick reminder that your online consultation is set to begin in 10 minutes. Please ensure that you're in a quiet place with a stable internet connection.
  
      You will be connected with your expert shortly to discuss your farming concerns. Feel free to ask any questions or clarify any doubts during the session.
  
      We look forward to helping you with your agriculture needs.
  
      Warm regards,
      The agriconnect Team`,
  };

  const expertMailOptions = {
    from: process.env.TRANSPORTER_EMAIL,
    to: expertEmail,
    subject:
      "Upcoming Consultation Reminder - 10 Minutes Until Your Next Appointment",
    text: `Dear Expert,
  
        This is a friendly reminder that your scheduled online consultation will begin in 10 minutes.
  
        Please ensure you're ready to connect with the patient. If you need any assistance or have any last-minute preparations, feel free to get in touch.
  
        We wish you a smooth and productive consultation.
  
        Best regards,
        The agriconnect Team`,
  };

  return new Promise((resolve, reject) => {
    transpoter.sendMail(userMailOptions, (err) => {
      if (err) {
        reject(err.message);
      } else {
        resolve("resolved email generation for consultation updates");
      }
    });

    transpoter.sendMail(expertMailOptions, (err) => {
      if (err) {
        reject(err.message);
      } else {
        resolve("resolved email generation for consultation updates");
      }
    });
  });
};
