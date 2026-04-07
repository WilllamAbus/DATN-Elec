const checkMissingParams = require('./enter-handles/checkMissingParams');
const findAuctionProduct = require('./enter-handles/findAuctionProduct');
const validateAuctionPricing = require('./enter-handles/validateAuctionPricing');
const updateCurrentPrice = require('./enter-handles/updateCurrentPrice');
const findOrCreateUserBidPrice = require('./enter-handles/findOrCreateUserBidPrice');
const updateAuctionRound = require('./enter-handles/updateAuctionRound');
const handleAuctionPriceHistory = require('./enter-handles/handleAuctionPriceHistory');
const updateUserAuctionHistory = require('./enter-handles/updateUserAuctionHistory');
const declareWinner = require('./enter-handles/declareWinner');
const checkUserTopBid = require('./enter-handles/checkUserTopBid');
const checkAuctionRoundTopBid = require('./enter-handles/checkAuctionRoundTopBid');
const findUserName = require('./enter-handles/findUserName');
const { getIO } = require('../../../services/skserver/socketServer');

const enterAuctionPrice = async (req, res) => {
  const { bidPrice } = req.body;
  const { slug } = req.params;
  const userId = req.user ? req.user.id : null;

  const missingParamsError = checkMissingParams(slug, bidPrice);
  if (missingParamsError) return res.status(400).json(missingParamsError);

  try {
    const productAuction = await findAuctionProduct(slug);
    if (productAuction.err) return res.status(404).json(productAuction);

    const auctionPricingRange = productAuction.auctionPricing;
    if (auctionPricingRange.err) return res.status(404).json(auctionPricingRange);

    const validationErrors = validateAuctionPricing(auctionPricingRange, bidPrice, userId);
    if (validationErrors) return res.status(400).json({ success: false, err: 1, msg: validationErrors.errors, status: 'error' });

    const userTopBidError = await checkUserTopBid(userId, auctionPricingRange);
    if (userTopBidError) return res.status(400).json(userTopBidError);

    const auctionRoundTopBidError = await checkAuctionRoundTopBid(userId, auctionPricingRange);
    if (auctionRoundTopBidError) return res.status(400).json(auctionRoundTopBidError);

    if (bidPrice === auctionPricingRange.maxPrice) {
      // Lưu các giá trị tạm thời
      auctionPricingRange.currentPriceTemporarily = auctionPricingRange.currentPrice;
      auctionPricingRange.startTimeTemporarily = auctionPricingRange.startTime;
      auctionPricingRange.endTimeTemporarily = auctionPricingRange.endTime;
      auctionPricingRange.remainingTimeTemporarily = auctionPricingRange.remainingTime;
      await auctionPricingRange.save();

      await updateCurrentPrice(auctionPricingRange, bidPrice);
      await findOrCreateUserBidPrice(userId, auctionPricingRange, bidPrice);
      const auctionRound = await updateAuctionRound(auctionPricingRange, userId, bidPrice);
      const auctionPriceHistory = await handleAuctionPriceHistory(auctionPricingRange, auctionRound, userId, bidPrice);
      await updateUserAuctionHistory(userId, auctionRound, bidPrice);

      auctionPricingRange.auctionPriceHistory = auctionPriceHistory._id;
      await auctionPricingRange.save();

      const userName = await findUserName(userId);
      await declareWinner(auctionPricingRange, auctionRound);

      getIO().emit('bidPlaced', {
        message: `Người dùng ${userName} đã đặt giá tối đa và cần xác nhận thanh toán trong 5 phút.`,
        userId,
        bidPrice,
        slug,
        status: 'temporary'
      });

      return res.status(200).json({
        success: true,
        err: 0,
        msg: 'Đã đặt giá thành công. Bạn cần xác nhận thanh toán trong 5 phút.',
        userId,
        status: 'temporary',
      });
    }

    await updateCurrentPrice(auctionPricingRange, bidPrice);
    await findOrCreateUserBidPrice(userId, auctionPricingRange, bidPrice);
    const auctionRound = await updateAuctionRound(auctionPricingRange, userId, bidPrice);
    const auctionPriceHistory = await handleAuctionPriceHistory(auctionPricingRange, auctionRound, userId, bidPrice);
    await updateUserAuctionHistory(userId, auctionRound, bidPrice);

    auctionPricingRange.auctionPriceHistory = auctionPriceHistory._id;
    await auctionPricingRange.save();

    getIO().emit('bidPlaced', { message: `Giá hiện tại đã tăng lên ${bidPrice}!`, userId, bidPrice, slug });

    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'Đã đặt giá thành công',
      userId,
      status: 'success',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Đã xảy ra lỗi khi đặt giá',
      status: 'error',
      error,
    });
  }
};

module.exports = { enterAuctionPrice };