const cron = require('node-cron');
const Screen = require('../model/attributes/screen');
const softDeleteForModel = require('../utils/softDelete');
const BiddingService = require("../services/detailAuction/getBiddingListSV");

cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Cron Job bắt đầu: Xóa vĩnh viễn các tài nguyên đã bị xóa mềm quá 10 ngày');

    await softDeleteForModel(Screen, { status: 'disabled' }, { status: 'disabled', deletedAt: new Date() });

    console.log('Cron Job hoàn thành!');
  } catch (error) {
    console.error('Lỗi khi chạy Cron Job:', error.message);
  }
});



// Cron job kiểm tra phiên đấu giá mỗi phút
cron.schedule("* * * * *", async () => {
  console.log("Kiểm tra các phiên đấu giá kết thúc...");

  try {
    const activeAuctions = await ProductAuction.find({
      "auctionPricing.status": "active",
      "auctionPricing.endTime": { $lte: new Date() },
    }).populate("auctionPricing");

    for (const auction of activeAuctions) {
      await BiddingService.processAuctionWinner(auction.slug);
    }
  } catch (error) {
    console.error("Lỗi khi chạy cron job:", error.message);
  }
});
