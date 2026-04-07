
const { homeAllProduct, getID, auction, upView, shopping, search, recommendations, getPhoneByVariants, getLaptopByVariants, getAccessoryByVariants } = require('./home');
const {listcatenav,getProductsByCategory} = require('./navbar');
const {listPageAuction,resetFilter} = require('./page-auction-product');
const {getProductDetail,getAllStorageBySlugUrl,getAllProductVariantsByVariantPrice} = require('./detail');
const {getAuctionWinsByUser,confirmAuction,canceledAuction,getUserPendingAuctionWins,canceledAuctionTemporary,confirmAuctionTemporary} = require('./AuctionByUser');
const { getLimitProductClient, relatedProduct } = require('./product');
const {
  getProductDetailAuction,
  createOneUpdateBidAuction,
  getAuctionDetailsBySlug,
  getBiddingListAndWinner,
  enterAuctionPrice,
  getAuctionPricingRange,
  getUserBiddingHistory,
  getUserBiddingDetails,
  checkAuctionTime,
  checkStatusAuctionPricingRange,
  highBidderInformation,
  getAuctionProgress,
  getTop3HighestBidders,
  getUserCart,
  checkAuctionTimeAuctionPricingRange,
  emailTwowinners,

} = require('./detailAuction');

const {
  getAllBrandPageAuction,
  getALLConditionShopping,
  getAllProductVariants,
  getAllColorVariant,
} = require('./sidebar');
const {
  getAllRam,
  getAllColor,
  getAllCpu,
  getAllScreen,
  getAllGraphicsCard,
  getAllBattery,
  getAllOperatingSystem,
  getAllStorage
} = require('./attributes');
module.exports = {
  homeAllProduct,
  getID,
  listcatenav,
  getLimitProductClient,
  getProductsByCategory,
  shopping,
  auction,
  upView,
  listPageAuction,
  resetFilter,
  getAllBrandPageAuction,
  getALLConditionShopping,
  getAllProductVariants,
  getAllColorVariant,
  search,
  getAllRam,
  getAllColor,
  getAllCpu,
  getAllScreen,
  getAllGraphicsCard,
  getAllBattery,
  getAllOperatingSystem,
  getAllStorage,
  relatedProduct,
  getProductDetail,
  getAllStorageBySlugUrl,
  getAllProductVariantsByVariantPrice,
  recommendations,
  getPhoneByVariants,
  getLaptopByVariants,
  getAccessoryByVariants,
  getProductDetailAuction,
  createOneUpdateBidAuction,
  getAuctionDetailsBySlug,
  getAuctionWinsByUser,
  confirmAuction,
  canceledAuction,
  getUserBiddingHistory,
  getUserBiddingDetails,
  getBiddingListAndWinner,
  getAuctionPricingRange,
  enterAuctionPrice,
  getUserPendingAuctionWins,
  checkAuctionTime,
  checkStatusAuctionPricingRange,
  highBidderInformation,
  canceledAuctionTemporary,
  getAuctionProgress,
  getTop3HighestBidders,
  getUserCart,
  checkAuctionTimeAuctionPricingRange,
  emailTwowinners,
  confirmAuctionTemporary
};

