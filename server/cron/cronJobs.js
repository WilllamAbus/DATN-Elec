const cron = require('node-cron');
const Screen = require('../model/attributes/screen');
const softDeleteForModel = require('../utils/softDelete');
const BiddingService = require("../services/detailAuction/getBiddingListSV");
const ProductAuction = require('../model/productAuction/productAuction');
cron.schedule('0 0 * * *', async () => {
  try {
    await softDeleteForModel(Screen, { status: 'disabled' }, { status: 'disabled', deletedAt: new Date() });
  } catch (error) {
    console.error('lỗi softDeleteForModel nằm ở file cron/cronJobs.js:', error.message);
  }
});

cron.schedule("* * * * *", async () => {
 
  try {
    const activeAuctions = await ProductAuction.find({
      "auctionPricing.status": "active",
      "auctionPricing.endTime": { $lte: new Date() },
    }).populate("auctionPricing");

    for (const auction of activeAuctions) {
      await BiddingService.processAuctionWinner(auction.slug);
    }
  } catch (error) {
    console.error("lỗi activeAuctions nằm ở file cron/cronJobs.js:", error.message);
  }
});
