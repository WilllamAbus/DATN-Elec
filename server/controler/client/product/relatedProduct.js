const Product = require('../../../model/product_v2');
const ProductVariant = require('../../../model/product_v2/productVariant');

const relatedProduct = async (req, res) => {
    try {
        const productSlug = req.params.slug;

        // Tìm sản phẩm chính theo slug
        const currentProduct = await Product.findOne({ slug: productSlug })
            .populate({
                path: 'product_discount.discountId', // Populate trường discountId từ bảng discounts
                model: 'discounts',
                select: 'discountPercent code isActive status disabledAt' // Chỉ lấy các trường cần thiết
            });
        
        if (!currentProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Tìm các biến thể liên quan và lấy thông tin cần thiết từ `Product`
        const relatedVariants = await ProductVariant.find({
            product: currentProduct._id,
            status: 'active'
        })
        .populate({
            path: 'image', 
            model: 'ImageVariant',
            select: 'image color slug',
            populate: { path: 'color', model: 'Color', select: 'name' }
        })
        .limit(10)
        .lean();

        // Thêm thông tin product_discount, product_ratingAvg và weight_g vào từng biến thể liên quan
        relatedVariants.forEach(variant => {
            variant.product_ratingAvg = currentProduct.product_ratingAvg;
            variant.weight_g = currentProduct.weight_g;
            variant.product_discount = currentProduct.product_discount; // Thêm product_discount từ Product
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

module.exports = {relatedProduct}; 