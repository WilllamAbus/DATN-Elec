const Product = require('../../../model/product_v2');
const ProductVariant = require('../../../model/product_v2/productVariant');

const relatedProduct = async (req, res) => {
    try {
        const productSlug = req.params.slug;

        // Tìm sản phẩm chính theo slug
        const currentProduct = await Product.findOne({ slug: productSlug });

        if (!currentProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Tìm các biến thể liên quan và lấy thông tin cần thiết từ `ProductVariant`
        const relatedVariants = await ProductVariant.find({
            product: currentProduct._id,
            status: 'active'
        })
        .populate([
            {
                path: 'image',
                model: 'ImageVariant',
                select: 'image color slug',
                populate: { path: 'color', model: 'Color', select: 'name' }
            },
            {
                path: 'product_discount', // Populate discountId từ ProductVariant
                model: 'discounts',
                select: 'discountPercent' // Chỉ lấy trường discountPercent
            }
        ])
        .limit(10)
        .lean(); // Lấy kết quả dưới dạng đối tượng thuần túy

        // Kiểm tra và log discountPercent
        relatedVariants.forEach(variant => {
            if (variant.product_discount && variant.product_discount.discountPercent) {
                console.log("Discount Percent: ", variant.product_discount.discountPercent);
            }
        });

        // Thêm thông tin product_ratingAvg và weight_g vào từng biến thể liên quan
        relatedVariants.forEach(variant => {
            variant.product_ratingAvg = currentProduct.product_ratingAvg;
            variant.weight_g = currentProduct.weight_g;
        });

        // Gửi phản hồi JSON
        res.json({
            relatedVariants
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = { relatedProduct };
