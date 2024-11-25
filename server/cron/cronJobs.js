const cron = require('node-cron');
const Screen = require('../model/attributes/screen');
const softDeleteForModel = require('../utils/softDelete');

cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Cron Job bắt đầu: Xóa vĩnh viễn các tài nguyên đã bị xóa mềm quá 10 ngày');

    await softDeleteForModel(Screen, { status: 'disabled' }, { status: 'disabled', deletedAt: new Date() });

    console.log('Cron Job hoàn thành!');
  } catch (error) {
    console.error('Lỗi khi chạy Cron Job:', error.message);
  }
});
