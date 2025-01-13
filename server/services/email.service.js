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
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});
// Gửi email khôi phục mật khẩu
module.exports.sendPasswordResetEmail = async (email, token) => {
  try {
    const resetUrl = `${process.env.URL_FE}/reset-password?token=${token}`;
    const emailTemplate = await ejs.renderFile(
      path.join(__dirname, "..", "views", "resetPasswordEmail.ejs"),
      { resetUrl }
    );

    const info = await transporter.sendMail({
      from: "E-Com  <noreply@gmail.com",
      to: email,
      subject: "Reset Password",
      html: emailTemplate,
    });

    return info;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Gửi email xác nhận
module.exports.sendVerificationEmail = async (email, token) => {
  try {
    const verifyUrl = `${process.env.URL_FE}/verify-email?token=${token}`;
    const emailTemplate = await ejs.renderFile(
      path.join(__dirname, "..", "views", "verifyEmail.ejs"),
      { token, verifyUrl }
    );

    const info = await transporter.sendMail({
      from: "E-Com  <noreply@gmail.com",
      to: email,
      subject: "Verify Email",
      html: emailTemplate,
    });

    return info;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
module.exports.sendRandomPasswordEmail = async (email, randomPassword) => {
  try {
    const resetUrl = `${process.env.APP_URL}/reset-password?password=${randomPassword}`;
    const emailTemplate = await ejs.renderFile(
      path.join(__dirname, "..", "views", "randomPasswordEmail.ejs"),
      { randomPassword, resetUrl }
    );

    const info = await transporter.sendMail({
      from: "E-Com  <noreply@gmail.com",
      to: email,
      subject: "Your Temporary Password",
      html: emailTemplate,
    });

    return info;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
module.exports.sendOrderConfirmationEmail = async (email, orderDetails) => {
  try {
    const emailTemplate = await ejs.renderFile(
      path.join(__dirname, "..", "views", "orderEmail.ejs"),
      orderDetails
    );

    const info = await transporter.sendMail({
      from: "E-Com <noreply@gmail.com>",
      to: email,
      subject: "Xác nhận đơn hàng của bạn",
      html: emailTemplate,
    });

    return info;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
module.exports.sendOrderAuctionConfirmationEmail = async (
  email,
  orderDetails
) => {
  try {
    const emailTemplate = await ejs.renderFile(
      path.join(__dirname, "..", "views", "orderEmailAuction.ejs"),
      orderDetails
    );

    const info = await transporter.sendMail({
      from: "E-Com <noreply@gmail.com>",
      to: email,
      subject: "Xác nhận đơn hàng của bạn",
      html: emailTemplate,
    });

    return info;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports.sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email đã được gửi thành công");
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
    throw error; // Ném lỗi để xử lý trong controller
  }
};

// module.exports = { sendEmail };
