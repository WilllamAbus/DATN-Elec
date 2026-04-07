const { getIO } = require('../../../services/skserver/socketServer');
const { Schema, model, startSession } = require("mongoose");
const ProductAuction = require('../../../model/productAuction/productAuction');
const AuctionPricingRange = require('../../../model/productAuction/auctionPricingRange');
const AuctionWinner = require('../../../model/productAuction/auctionWinner');
const AuctionPriceHistory = require('../../../model/productAuction/auctionPriceHistory'); // thêm dòng này
const findUserName = require('./enter-handles/findUserName');

const highBidderInformation = async (req, res) => {
    const { slug } = req.params;
    const session = await startSession();
    session.startTransaction();

    try {
        const product = await ProductAuction.findOne({ slug }).populate('auctionPricing').session(session);

        if (!product || !product.auctionPricing) {
            await session.endSession();
            return res.status(404).json({
                code: "NOT_FOUND",
                status: "error",
                msg: "Sản phẩm hoặc thông tin đấu giá không tồn tại."
            });
        }

        const auctionPricing = product.auctionPricing;

        // Kiểm tra trạng thái hiện tại của sản phẩm đấu giá
        if (auctionPricing.status !== 'temporary') {
            await session.endSession();
            return res.status(200).json({
                code: "INVALID_STATUS",
                status: "error",
                msg: "Trạng thái sản phẩm không phải là temporary."
            });
        }

        // Kiểm tra giá hiện tại với giá tối đa
        if (auctionPricing.currentPrice === auctionPricing.maxPrice) {

            // Chuyển đổi auctionPricing._id sang ObjectId nếu cần thiết
            const auctionPricingObjectId = auctionPricing._id.toString();

            // Tìm AuctionWinner
            const auctionWinner = await AuctionWinner.findOne({
                auctionPricingRange: auctionPricingObjectId,
                auctionStatus: 'temporary'
            }).session(session);

            if (!auctionWinner) {
                await session.endSession();
                return res.status(200).json({
                    code: "WINNER_NOT_FOUND",
                    status: "error",
                    msg: "Không tìm thấy thông tin người trúng đấu giá."
                });
            }

            const userName = await findUserName(auctionWinner.user);
            const { startTime, endTime, bidPrice } = auctionWinner;

            // Tính remainingTime
            const currentTime = new Date().getTime();
            const endTimeMillis = new Date(endTime).getTime();
            const remainingTimeMillis = endTimeMillis - currentTime;
            const days = Math.floor(remainingTimeMillis / (1000 * 60 * 60 * 24));
            const hours = Math.floor((remainingTimeMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((remainingTimeMillis % (1000 * 60)) / (1000 * 60));
            const seconds = Math.floor((remainingTimeMillis % (1000 * 60)) / 1000);

            const remainingTime = remainingTimeMillis > 0
                ? `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`
                : "Đã kết thúc";

            if (remainingTime === "Đã kết thúc") {
                const auctionPricingRange = auctionPricing;
                if (auctionPricingRange.status === 'temporary' && auctionPricingRange.currentPriceTemporarily != null) {
                    auctionPricingRange.currentPrice = auctionPricingRange.currentPriceTemporarily;
                    auctionPricingRange.startTime = auctionPricingRange.startTimeTemporarily;
                    auctionPricingRange.endTime = auctionPricingRange.endTimeTemporarily;
                    auctionPricingRange.remainingTime = auctionPricingRange.remainingTimeTemporarily;
                    auctionPricingRange.status = 'active';
                    auctionPricingRange.currentPriceTemporarily = null;
                    auctionPricingRange.startTimeTemporarily = null;
                    auctionPricingRange.endTimeTemporarily = null;
                    auctionPricingRange.remainingTimeTemporarily = null;
                    await auctionPricingRange.save();

                    // Update AuctionPriceHistory status to 'disabled'
                    await AuctionPriceHistory.updateMany(
                        { auctionPricingRange: auctionPricingRange._id, status: 'active' },
                        { $set: { status: 'disabled' } }
                    );
                }

                // Reset trạng thái của AuctionWinner khi thời gian tạm ngưng kết thúc
                auctionWinner.auctionStatus = 'lose';
                await auctionWinner.save();

                // Phát sự kiện socket với trạng thái "active"
                getIO().emit('auctionStatusChange', { status: 'active' });

                await session.commitTransaction();
                await session.endSession();

                return res.status(200).json({
                    code: "TIME_EXPIRED",
                    status: "info",
                    msg: "Người dùng không thanh toán trong thời gian tạm ngưng. Đấu giá sẽ tiếp tục.",
                });
            }

            // Phát sự kiện socket với trạng thái "temporary"
            getIO().emit('auctionStatusChange', { status: 'temporary' });

            await session.commitTransaction();
            await session.endSession();

            return res.status(200).json({
                code: "SUCCESS",
                status: "success",
                msg: "Thông tin trạng thái và người trúng đấu giá.",
                data: {
                    userName,
                    startTime,
                    endTime,
                    remainingTime,
                    bidPrice
                }
            });
        } else {
            await session.commitTransaction();
            await session.endSession();
            return res.status(200).json({
                code: "PRICE_NOT_MAX",
                status: "info",
                msg: "Giá hiện tại chưa đạt giá tối đa.",
                data: {
                    currentPrice: auctionPricing.currentPrice,
                    maxPrice: auctionPricing.maxPrice
                }
            });
        }
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        console.error("Lỗi kiểm tra trạng thái đấu giá: ", error);
        return res.status(500).json({
            code: "SERVER_ERROR",
            status: "error",
            msg: "Lỗi server."
        });
    }
};

module.exports = { highBidderInformation };
