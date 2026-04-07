const dotenv = require("dotenv");

module.exports = {
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Đọc địa chỉ email từ biến môi trường
        pass: process.env.EMAIL_PASS, // Đọc mật khẩu email từ biến môi trường
    },
  };