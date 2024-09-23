const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // ví dụ: smtp.gmail.com
  port: 587, // cổng SMTP
  secure: false, // true cho cổng 465, false cho cổng 587
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email đã được gửi thành công');
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    throw error; // Ném lỗi để xử lý trong controller
  }
};


module.exports = { sendEmail };