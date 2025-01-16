const ProductAuction = require("../../../model/productAuction/productAuction");
const AuctionWinner = require("../../../model/productAuction/auctionWinner");
const AuctionRound = require("../../../model/productAuction/auctionRound");
const AuctionPriceHistory = require("../../../model/productAuction/auctionPriceHistory");
const AuctionPricingRange = require("../../../model/productAuction/auctionPricingRange");

const checkAuctionTime = async (req, res) => {
  const { slug } = req.params;
  try {
    const productAuction = await ProductAuction.findOne({ slug });
    if (!productAuction) {
      return res.status(404).json({
        code: "NOT_FOUND",
        status: "error",
        message: "Sản phẩm không tồn tại.",
      });
    }

    const auctionPricingRange = await AuctionPricingRange.findOne({ _id: productAuction.auctionPricing });
    if (!auctionPricingRange) {
      return res.status(500).json({
        code: "SERVER_ERROR",
        status: "error",
        message: "Lỗi server.",
      });
    }

    const auctionRound = await AuctionRound.findOne({ auctionPricing: productAuction.auctionPricing })
      .populate('bids.user', 'name email');
    if (!auctionRound) {
      const resultUpdated = [{
        user: null,
        bidPrice: null,
        status: "Đấu giá đã kết thúc nhưng không có giá đấu nào.",
        statusCheckAuctionTime: 4,
      }];
      return res.status(200).json({
        code: "NO_BIDS",
        case: 1,
        status: "success",
        message: "Đấu giá đã kết thúc nhưng không có giá đấu nào.",
        product: {
          name: productAuction.product_name,
          slug: productAuction.slug,
          status: productAuction.status,
        },
        bidders: resultUpdated,
      });
    }

    if (auctionPricingRange.status === 'temporary') {
      if (
        auctionPricingRange.currentPriceTemporarily != null &&
        auctionPricingRange.startTimeTemporarily != null &&
        auctionPricingRange.endTimeTemporarily != null &&
        auctionPricingRange.remainingTimeTemporarily != null
      ) {
        // Cộng thêm 5 phút
        auctionPricingRange.startTime = auctionPricingRange.startTimeTemporarily;
        auctionPricingRange.endTime = new Date(auctionPricingRange.endTimeTemporarily.getTime() + 5 * 60000);
        auctionPricingRange.remainingTime = auctionPricingRange.remainingTimeTemporarily + 5 * 60; // Thêm 5 phút
    
        // Cập nhật trạng thái và lưu
        auctionPricingRange.status = 'active';
        auctionPricingRange.currentPrice = auctionPricingRange.currentPriceTemporarily;
        auctionPricingRange.currentPriceTemporarily = null;
        auctionPricingRange.startTimeTemporarily = null;
        auctionPricingRange.endTimeTemporarily = null;
        auctionPricingRange.remainingTimeTemporarily = null;
    
        await auctionPricingRange.save();
    
        return res.status(200).json({
          code: "AUCTION_UPDATED_FROM_TEMPORARY",
          case: 4,
          status: "success",
          statusCheckAuctionTime: 5, // Trạng thái reset
          message: "Phiên đấu giá đã được cập nhật từ tạm thời sang đang hoạt động và cộng thêm 5 phút.",
          product: {
            name: productAuction.product_name,
            slug: productAuction.slug,
            status: productAuction.status,
          },
          time: {
            startTime: auctionPricingRange.startTime,
            endTime: auctionPricingRange.endTime,
            remainingTime: auctionPricingRange.remainingTime,
          },
          bidders: [],
        });
      }
    }
    
    
    if (auctionPricingRange.status === 'ended' && !auctionPricingRange.hasWinner) {
      const existingAuctionWinners = await AuctionWinner.find({ auctionPricingRange: auctionPricingRange._id });
      if (existingAuctionWinners.length === 0) {
        const topBids = await AuctionPriceHistory.find({ auctionPricingRange: productAuction.auctionPricing,
          status: { $ne: 'disabled' }
         })
          .sort({ bidPrice: -1 })
          .limit(2);

        if (topBids.length === 0) {
          const resultUpdated = auctionRound.bids.map(bid => ({
            user: bid.user,
            bidPrice: bid.bidPrice,
            status: "Đấu giá đã kết thúc nhưng không có giá đấu nào.",
            statusCheckAuctionTime: 4,
          }));
          return res.status(200).json({
            code: "NO_BIDS",
            case: 1,
            status: "success",
            message: "Đấu giá đã kết thúc nhưng không có giá đấu nào.",
            product: {
              name: productAuction.product_name,
              slug: productAuction.slug,
              status: productAuction.status,
            },
            bidders: resultUpdated,
          });
        }
        for (let i = 0; i < topBids.length; i++) {
          const bid = topBids[i];
          const auctionWinner = new AuctionWinner({
            user: bid.user,
            auctionPricingRange: auctionPricingRange._id,
            bidPrice: bid.bidPrice,
            bidTime: bid.bidTime,
            auctionRound: auctionRound._id,
            product_randBib: auctionPricingRange.product_randBib,
            notWinner: true,
            auctionStatus: i === 0 ? 'won' : 'pending',
            hasWinner: true,
            startTime: new Date(),
            endTime: new Date(new Date().getTime() + (i === 0 ? 1 : 2) * 24 * 60 * 60 * 1000),
          });
          await auctionWinner.save();
        }

        auctionPricingRange.hasWinner = true;
        await auctionPricingRange.save();
      }

      const auctionWinnersUpdated = await AuctionWinner.find({
        auctionPricingRange: productAuction.auctionPricing,
        status: { $ne: 'disabled' }
      })
        .populate("user", "name email")
        .sort({ bidPrice: -1 });

        const winnersMapUpdated = new Map(auctionWinnersUpdated.map((entry, index) => {
          const status = index === 0 ? "Đã trúng đấu giá" : "Đang trong danh sách hàng chờ";
          const statusCheckAuctionTime = index === 0 ? 0 : 1;
          return [entry.user._id.toString(), { user: entry.user, bidPrice: entry.bidPrice, status, statusCheckAuctionTime }];
        }));
        

        const resultUpdated = auctionRound.bids.map(bid => {
          if (winnersMapUpdated.has(bid.user._id.toString())) {
            return winnersMapUpdated.get(bid.user._id.toString());
          } else {
            return {
              user: bid.user,
              bidPrice: bid.bidPrice,
              status: "Không trúng đấu, chúc bạn may mắn lần sau",
              statusCheckAuctionTime: 2,
            };
          }
        });
        

      return res.status(200).json({
        code: "AUCTION_ENDED_WITH_WINNERS",
        case: 2,
        status: "success",
        message: "Phiên đấu giá đã kết thúc và cập nhật người thắng thành công.",
        product: {
          name: productAuction.product_name,
          slug: productAuction.slug,
          status: productAuction.status,
        },
        bidders: resultUpdated,
      });
    } else if (auctionPricingRange.status === 'paid') {
      const auctionWinnersUpdated = await AuctionWinner.find({
        auctionPricingRange: productAuction.auctionPricing,
        auctionStatus: 'paid', // Filter only 'paid' winners
      })
        .populate("user", "name email")
        .sort({ bidPrice: -1 });
    
      const winnersMapUpdated = new Map(auctionWinnersUpdated.map((entry, index) => {
        const status = index === 0 ? "Đã trúng đấu giá" : "Đang trong danh sách hàng chờ";
        const statusCheckAuctionTime = index === 0 ? 3 : 3;
        return [entry.user._id.toString(), { user: entry.user, bidPrice: entry.bidPrice, status, statusCheckAuctionTime }];
      }));
    
      const resultUpdated = auctionRound.bids.map(bid => {
        if (winnersMapUpdated.has(bid.user._id.toString())) {
          const winner = winnersMapUpdated.get(bid.user._id.toString());
          // Check if the user is in the list of winners and update statusCheckAuctionTime accordingly
          return {
            ...winner,
            statusCheckAuctionTime: winner.statusCheckAuctionTime === undefined ? 3 : winner.statusCheckAuctionTime,
          };
        } else {
          return {
            user: bid.user,
            bidPrice: bid.bidPrice,
            status: "Phiên đấu giá đã thanh toán.",
            statusCheckAuctionTime: 3, // Ensure 3 for non-winner
          };
        }
      });
    
      return res.status(200).json({
        code: "AUCTION_PAID",
        case: 3,
        status: "success",
        message: "Phiên đấu giá đã thanh toán.",
        product: {
          name: productAuction.product_name,
          slug: productAuction.slug,
          status: productAuction.status,
        },
        bidders: resultUpdated,
      });
    }
    
    


    const auctionWinnersUpdated = await AuctionWinner.find({
      auctionPricingRange: productAuction.auctionPricing,
    })
      .populate("user", "name email")
      .sort({ bidPrice: -1 });

    const winnersMapUpdated = new Map(auctionWinnersUpdated.map((entry, index) => {
      const status = index === 0 ? "Đã trúng đấu giá" : "Đang trong danh sách hàng chờ";
      const statusCheckAuctionTime = index === 0 ? 0 : 1;
      return [entry.user._id.toString(), { user: entry.user, bidPrice: entry.bidPrice, status, statusCheckAuctionTime }];
    }));

    let hasWinner = false;

    const resultUpdated = auctionRound.bids.map(bid => {
      if (winnersMapUpdated.has(bid.user._id.toString())) {
        const winnerData = winnersMapUpdated.get(bid.user._id.toString());
        // Gán statusCheckAuctionTime = 0 chỉ cho người thắng đầu tiên
        if (!hasWinner && winnerData.statusCheckAuctionTime === 0) {
          hasWinner = true;
          return winnerData;
        } else {
          // Nếu người này không phải người thắng cao nhất, chỉnh thành hàng chờ
          return {
            ...winnerData,
            statusCheckAuctionTime: 1,
          };
        }
      } else {
        return {
          user: bid.user,
          bidPrice: bid.bidPrice,
          status: "Không trúng đấu, chúc bạn may mắn lần sau",
          statusCheckAuctionTime: 2,
        };
      }
    });
    
  
    return res.status(200).json({
      code: "SUCCESS",
      status: "success",
      message: "Danh sách người đấu giá đã được tải thành công.",
      product: {
        name: productAuction.product_name,
        slug: productAuction.slug,
        status: productAuction.status,
      },
      bidders: resultUpdated,
    });
  } catch (error) {
    return res.status(500).json({
      code: "SERVER_ERROR",
      status: "error",
      message: "Lỗi server.",
    });
  }
  };
  
  module.exports = {
  checkAuctionTime,
  };
  