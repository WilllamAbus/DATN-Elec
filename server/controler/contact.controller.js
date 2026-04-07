// controllers/contactController.js
'use strict';
const Contact = require('../model/contact.model');
const multer = require('multer');
const dotenv = require("dotenv");
const { v4: uuidv4 } = require('uuid');
const Role = require('../model/role.model');
const { sendEmail } = require('../../server/services/contact.service');
dotenv.config();


const contactController = {
  addContact: async (req, res) => {
    try {
      const userRole = await Role.findOne({ name: 'user' });
      if (!userRole) {
        return res.status(500).json({
          success: false,
          err: 1,
          msg: "Không tìm thấy vai trò người dùng",
          status: 500
        });
      }
      console.log(req.user);
      if (!req.user || !Array.isArray(req.user.roles)) {
        return res.status(403).json({
          success: false,
          err: 1,
          msg: "Người dùng không có quyền truy cập.",
          status: 403
        });
      }

      // Kiểm tra xem người dùng có phải là người dùng bình thường không
      const isUser = req.user.roles.some(role => role._id.toString() === userRole._id.toString());

      if (!isUser) {
        return res.status(403).json({
          success: false,
          err: 1,
          msg: "Quyền truy cập bị từ chối: Chỉ người dùng mới có thể thực hiện hành động này.",
          status: 403
        });
      }
      // Lấy dữ liệu từ request body
      const { id_user, name, phone, message } = req.body;
      const email = req.user.email;
      console.log(email);
      // Kiểm tra thông tin bắt buộc
      if (!id_user || !name || !phone || !email || !message) {
        return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin liên hệ" });
      }

      // Tạo contact mới
      const contactData = { id_user, name, phone, email, message };
      const savedContact = await Contact.create(contactData);

      const mailOptions = {
        to: "daodinhhay@gmail.com",
        subject: "Thông tin liên hệ mới",
        text: `
      ********************************
             THÔNG TIN LIÊN HỆ
      ********************************
      👤 Họ và tên    : ${name}
      📱 Số điện thoại: ${phone}
      ✉️  Email       : ${email}
      💬 Tin nhắn:
      -------------------------------------------------
      ${message}
      -------------------------------------------------
      ⏰ Thời gian gửi: ${new Date().toLocaleString()}
      ********************************
      `,
      };


      await sendEmail(mailOptions);

      res.status(201).json({ message: "Liên hệ được tạo thành công", savedContact });

    } catch (error) {
      console.error('Lỗi khi thêm liên hệ:', error);
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  },
}

module.exports = contactController;