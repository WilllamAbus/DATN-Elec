const { Schema, model, startSession } = require("mongoose");
const ProductAuction = require('../../../model/productAuction/productAuction');
const AuctionPricingRange = require('../../../model/productAuction/auctionPricingRange');
const { getIO } = require('../../../services/skserver/socketServer');

const getAuctionPricingRange = async (req, res) => {
    const { slug } = req.params;
    const session = await startSession();
    session.startTransaction();

    try {
        const product = await ProductAuction.findOne({ slug }).populate('auctionPricing').session(session);

        if (!product || !product.auctionPricing) {
            return res.status(404).json({
                code: "NOT_FOUND",
                status: "error",
                msg: "Sản phẩm hoặc thông tin đấu giá không tồn tại."
            });
        }

        const auctionPricing = product.auctionPricing;

        // Kiểm tra điều kiện hiện tại trước khi thay đổi
        const currentPrice = auctionPricing.currentPrice;
        const priceStep = auctionPricing.priceStep;
        const maxPrice = auctionPricing.maxPrice;
        const status = auctionPricing.status;

        // Tính giá mới
        let newPrice = currentPrice + priceStep;

        // Kiểm tra nếu trạng thái đã kết thúc hoặc giá hiện tại đã đạt giá tối đa
        if (status === 'ended' || currentPrice >= maxPrice) {
            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({
                code: "SUCCESS",
                status: "success",
                msg: "Không thỏa mãn điều kiện, sẽ không có thay đổi bước giá.",
                auctionPricing
            });
        }

        // Chỉ cập nhật nếu giá mới lớn hơn giá tối đa
        if (newPrice > maxPrice) {
            auctionPricing.priceStep = maxPrice - currentPrice;
            auctionPricing.isPriceStepAdjusted = true; // Cập nhật trường mới
            await auctionPricing.save({ session });

            await session.commitTransaction();
            session.endSession();

            // Phát sự kiện cập nhật giá đấu giá đến tất cả các máy khách
            getIO().emit('auctionPriceUpdated', { 
                productSlug: slug, 
                auctionPricing 
            });

            return res.status(200).json({
                code: "SUCCESS",
                status: "success",
                msg: "Kiểm tra và cập nhật bước giá thành công.",
                auctionPricing
            });
        } else {
            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({
                code: "SUCCESS",
                status: "success",
                msg: "Không thỏa mãn điều kiện, sẽ không có thay đổi bước giá.",
                auctionPricing
            });
        }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Lỗi cập nhật thông tin đấu giá: ", error);
        return res.status(500).json({
            code: "SERVER_ERROR",
            status: "error",
            msg: "Lỗi server."
        });
    }
};

module.exports = { getAuctionPricingRange };
