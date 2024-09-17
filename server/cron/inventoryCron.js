const cron = require('node-cron');
const { checkInventoryAndNotify } = require('../services/inventoryChecker');

// Tạo cron job để kiểm tra tồn kho mỗi ngày lúc 8 giờ sáng
cron.schedule('0 8 * * *', () => {
  console.log('Đang kiểm tra tồn kho...');
  checkInventoryAndNotify();
});