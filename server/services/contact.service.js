const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const ejs = require("ejs");
const path = require("path");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: 'daodinhhay@gmail.com',
    pass: process.env.EMAIL_PASSWORD,
  },
});


const sendContactEmail = (fromEmail, toEmail, subject, message) => {
  const mailOptions = {
    from: fromEmail,
    to: toEmail,
    subject: subject,
    text: message,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

module.exports = { sendContactEmail };
