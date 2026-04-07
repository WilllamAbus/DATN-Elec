const OrderDetail = require('../../../model/orders/orderCart/OrderDetails'); // Import model OrderDetail
const Product = require('../../../model/product_v2'); // Import model Product
const ProductVariant = require('../../../model/product_v2/productVariant'); // Import model ProductVariant

const getBestSellingProducts = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Tạo pipeline cho aggregation
        const matchStage = {
            $match: {
                // Lọc đơn hàng theo thời gian nếu có
                ...(startDate && endDate && {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                    },
                }),
            },
        };

        const unwindStage = {
            $unwind: "$items", // Phân tách từng sản phẩm trong đơn hàng
        };

        const groupStage = {
            $group: {
                _id: "$items.product", // Group theo sản phẩm
                totalQuantity: { $sum: "$items.quantity" }, // Tính tổng số lượng đã bán
                totalRevenue: { $sum: "$items.totalItemPrice" }, // Tính tổng doanh thu
            },
        };

        const sortStage = {
            $sort: { totalQuantity: -1 }, // Sắp xếp theo số lượng bán giảm dần
        };

        const limitStage = {
            $limit: 10, // Lấy top 10 sản phẩm
        };

        const lookupProductStage = {
            $lookup: {
                from: "product_v2", // Tên collection sản phẩm
                localField: "_id",
                foreignField: "_id",
                as: "productDetails",
            },
        };

        const unwindProductDetailsStage = {
            $unwind: "$productDetails", // Phân tách từng sản phẩm chi tiết
        };

        const lookupDiscountStage = {
            $lookup: {
                from: "discounts", // Tên collection discount
                localField: "productDetails.product_discount",
                foreignField: "_id",
                as: "discountDetails",
            },
        };

        const lookupProductVariantsStage = {
            $lookup: {
                from: "productvariants", // Tên collection productvariants
                localField: "_id", // Kết nối với productId từ OrderDetails
                foreignField: "product", // Kết nối với product trong productvariants
                as: "productVariants",
            },
        };

        const projectStage = {
            $project: {
                _id: 0,
                productId: "$_id",
                totalQuantity: 1,
                totalRevenue: 1,
                productDetails: {
                    _id: "$productDetails._id",
                    product_name: "$productDetails.product_name",
                    image: "$productDetails.image",
                    product_description: "$productDetails.product_description",
                    sku: "$productDetails.sku",
                    product_type: "$productDetails.product_type",
                    product_brand: "$productDetails.product_brand",
                    product_condition: "$productDetails.product_condition",
                    product_supplier: "$productDetails.product_supplier",
                    product_ratingAvg: "$productDetails.product_ratingAvg",
                    product_view: "$productDetails.product_view",
                    weight_g: "$productDetails.weight_g",
                    status: "$productDetails.status",
                    slug: "$productDetails.slug", // Lấy slug từ productDetails
                    createdAt: "$productDetails.createdAt",
                    updatedAt: "$productDetails.updatedAt",
                },
                discountPercent: { 
                    $ifNull: [{ $arrayElemAt: ["$discountDetails.discountPercent", 0] }, 0] 
                }, // Lấy discountPercent từ discountDetails
                totalViewCount: {
                    $sum: "$productVariants.viewCount" // Tính tổng viewCount từ productVariants
                },
                totalOriginalPrice: { 
                    $arrayElemAt: ["$productVariants.variant_original_price", 0] 
                }, // Lấy giá gốc của variant đầu tiên
                variant_price: { 
                    $arrayElemAt: ["$productVariants.variant_price", 0] 
                } 
            },
        };

        // Kết hợp các stages
        const pipeline = [
            matchStage,
            unwindStage,
            groupStage,
            sortStage,
            limitStage,
            lookupProductStage,
            unwindProductDetailsStage,
            lookupDiscountStage,
            lookupProductVariantsStage,
            projectStage,
        ];

        // Thực thi aggregation
        const bestSellingProducts = await OrderDetail.aggregate(pipeline);

        // Trả về kết quả
        res.status(200).json({
            success: true,
            data: bestSellingProducts,
        });
    } catch (error) {
        console.error("Error fetching best-selling products:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = {
    getBestSellingProducts,
};
