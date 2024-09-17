const crypto = require('crypto');

// Hàm tính chữ ký sử dụng crypto tích hợp trong Node.js
const calculateSignature = (rawSignature, secretKey) => {
  return crypto.createHmac('sha256', secretKey)
               .update(rawSignature)
               .digest('hex');
};


module.exports = {calculateSignature}