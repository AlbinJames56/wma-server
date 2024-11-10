const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "GMAIL",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const SendEmail = async (data) => {
  try {
    const info = await transporter.sendMail({
      from: "albinjameswb@gmail.com", // Replace this email with your sender email if needed
      to: data.receiver, // Fixed typo here to align with the receiver field in your data object
      subject: data.subject,
      text: data.text,
      attachments: data.attachments,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = SendEmail;
