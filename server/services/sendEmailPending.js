
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const dotenv = require('dotenv');
const ejs = require('ejs');
const path = require('path');

dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_MAILER_CLIENT_ID,
  process.env.GOOGLE_MAILER_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
});

module.exports.sendEmailPending = async (pendingEmail, subject, template, data) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USERNAME_AUCTION,
        clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
        clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const filePath = path.join(__dirname, "..", "views", template);
    const emailTemplate = await ejs.renderFile(filePath, data);

    const info = await transporter.sendMail({
      from: `"Hệ thống đấu giá thương mại điện tử E-COM" <${process.env.EMAIL_USERNAME_AUCTION}>`,
      to: pendingEmail,
      subject: subject,
      html: emailTemplate,
    });

    console.log("Email đã được gửi:", info.messageId);
    return info;
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
    throw error;
  }
};
