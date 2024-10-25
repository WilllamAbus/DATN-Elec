const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Inventory = require('../model/inventory/inventory.model');
const mailConfig = require('../config/mailConfig');
const SocketServices = require('./serviceSocket'); // Import SocketServices

// Cấu hình Nodemailer
var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.EMAIL_USER, // Đọc địa chỉ email từ biến môi trường
        pass: process.env.EMAIL_PASS, // Đọc mật khẩu email từ biến môi trường
    }
});

// Tham chiếu đến io từ file server
let io;
function setSocketIO(socketIO) {
    io = socketIO;
}


async function checkInventoryAndNotify() {
  try {
    // Kiểm tra nếu chưa kết nối, thì mới kết nối
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(`${process.env.MONGODB_URI}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    // Tìm tất cả các bản ghi tồn kho
    const inventories = await Inventory.find().populate('product_variant');

    inventories.forEach(async (inventory) => {
        // Kiểm tra nếu quantityStock <= 10
        if (inventory.quantityStock <= 10) {
          const productName = inventory.product_variant.variant_name; // Lấy tên sản phẩm từ object product
  
          // Gửi email cảnh báo với tên sản phẩm
          const mailOptions = {
            from: mailConfig.auth.user,
            to: 'manager-email@gmail.com', // Địa chỉ email người quản lý
            subject: 'Cảnh báo tồn kho thấp',
            text: `Sản phẩm ${productName} có số lượng tồn kho thấp: ${inventory.quantityStock} sản phẩm.`,
          };
  
          // Sử dụng transport để gửi email
          transport.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Lỗi khi gửi email:', error);
            } else {
              console.log('Email đã gửi:', info.response);
            }
          });
  
          SocketServices.emitInventory(inventory.product_variant._id, productName, inventory.quantityStock);
        }
      });

    console.log('Kiểm tra tồn kho hoàn tất.');
  } catch (err) {
    console.error('Lỗi kiểm tra tồn kho và gửi thông báo:', err);
  } finally {
    // Không cần đóng kết nối Mongoose ngay ở đây nếu bạn còn cần nó ở các chỗ khác trong ứng dụng.
  }
}

module.exports = { checkInventoryAndNotify, setSocketIO };