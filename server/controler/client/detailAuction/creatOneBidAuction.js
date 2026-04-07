const checkMissingParams = require('./handles/checkMissingParams');
const findAuctionProduct = require('./handles/findAuctionProduct');
const validateAuctionPricing = require('./handles/validateAuctionPricing');
const updateCurrentPrice = require('./handles/updateCurrentPrice');
const findOrCreateUserBidPrice = require('./handles/findOrCreateUserBidPrice');
const updateAuctionRound = require('./handles/updateAuctionRound');
const handleAuctionPriceHistory = require('./handles/handleAuctionPriceHistory');
const updateUserAuctionHistory = require('./handles/updateUserAuctionHistory');
const declareWinner = require('./handles/declareWinner');
const checkUserTopBid = require('./handles/checkUserTopBid');
const checkAuctionRoundTopBid = require('./handles/checkAuctionRoundTopBid');
const findUserName = require('./handles/findUserName');
const { getIO } = require('../../../services/skserver/socketServer');

const createOneUpdateBidAuction = async (req, res) => {
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

    await updateCurrentPrice(auctionPricingRange, bidPrice);
    await findOrCreateUserBidPrice(userId, auctionPricingRange, bidPrice);
    const auctionRound = await updateAuctionRound(auctionPricingRange, userId, bidPrice);
    const auctionPriceHistory = await handleAuctionPriceHistory(auctionPricingRange, auctionRound, userId, bidPrice);
    await updateUserAuctionHistory(userId, auctionRound, bidPrice);

    auctionPricingRange.auctionPriceHistory = auctionPriceHistory._id;

    const userName = await findUserName(userId);

    if (bidPrice === auctionPricingRange.maxPrice) {
      await declareWinner(auctionPricingRange, auctionRound);

      getIO().emit('bidPlaced', {
        message: `Người dùng ${userName} đã thắng với giá tối đa là ${bidPrice}`,
        userId,
        bidPrice,
        slug,
        status: 'ended'  
      });

      auctionPricingRange.status = 'ended';
      await auctionPricingRange.save();

      return res.status(200).json({
        success: true,
        err: 0,
        msg: 'Đã đặt giá thành công. Bạn đã chiến thắng sản phẩm đấu giá này!',
        userId,
        status: 'success',
      });
    }

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

module.exports = { createOneUpdateBidAuction };
