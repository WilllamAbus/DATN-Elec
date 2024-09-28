const Product = require('../../../model/product_v2');

const relatedProduct = async (req, res) => {
    try {
        // Lấy ID sản phẩm từ request params
        const productId = req.params.id;
    
        // Tìm sản phẩm hiện tại
        const currentProduct = await Product.findById(productId); // Sử dụng đúng model 'Product'
        
        if (!currentProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
       

    
        // Tìm các sản phẩm liên quan cùng danh mục (loại trừ sản phẩm hiện tại)
        const relatedProducts = await Product.find({
            product_type: currentProduct.product_type._id, // Lọc theo danh mục của sản phẩm hiện tại
            _id: { $ne: currentProduct._id }  ,
            status: 'active'            // Loại trừ sản phẩm hiện tại
        }).limit(10);  // Giới hạn số sản phẩm liên quan (ví dụ: 10 sản phẩm)
     // Trả về kết quả bao gồm tên danh mục và danh sách sản phẩm liên quan
     res.json({
        relatedProducts
    });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = {relatedProduct}; // Đảm bảo export hàm đúng cách