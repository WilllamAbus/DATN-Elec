'use strict'

const productService = require('../services/product_v2.service');


const productController = {
    createProduct: async (req, res) => {
        try {
            const productData = req.body;
            const images = req.files;

            const newProduct = await productService.createProductV2(productData, images);
            res.status(201).json({
                message: 'Product created successfully',
                product: newProduct,
                inventory: newInventory,
            });
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({
                message: 'Failed to create product',
                error: error.message
            });
        }
    },

    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedData = req.body;
            const newImages = req.files ? req.files.images : null; // Adjust based on how images are uploaded

            const updatedProduct = await productService.edditProductV2(id, updatedData, newImages);
            res.status(200).json(updatedProduct);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },


    getAllProduct: async (req, res) => {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const pageSize = parseInt(req.query.pageSize, 4) || 4;

            // Call the service function to get paginated discounts
            const discount = await discountService.getAllDiscount(page, pageSize);

            // Send the response

            res.status(200).json(discount);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },


    softDeleteProduct: async (req, res) => {
        const { id } = req.params;
        try {
            const deletedProduct = await productService.softDeleteProduct(id);
            res.status(200).json(deletedProduct);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    restore: async (req, res) => {
        try {
            // const adminRole = await Role.findOne({ name: 'admin' });


            // if (!adminRole) {
            //     return res.status(500).json({ message: "Không tìm thấy vai trò quản trị viên" });
            // }


            // const isAdmin = req.user.roles.some(role => role._id.toString() === adminRole._id.toString());

            // if (!isAdmin) {
            //     return res.status(403).json({ message: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể khôi phục sản phẩm" });
            // }


            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Thiếu id sản phẩm" });
            }

            // Cập nhật trạng thái của sản phẩm thành 'active'
            const restoreProduct = await productService.restore(id)

            if (!restoreProduct) {
                return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
            }

            // Trả về phản hồi thành công
            res.status(200).json({ message: "Sản phẩm đã được khôi phục thành công", data: restoreProduct });
        } catch (error) {
            // Xử lý lỗi và trả về phản hồi lỗi server
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },
    getDeletedProducts: async (req, res) => {
        const { page = 1, pageSize = 4 } = req.query;
        try {
            const result = await productService.deletedListProduct(page, pageSize);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getProductById: async (req, res) => {
        const { id } = req.params;
        try {
            const product = await productService.getProductById(id);
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    searchProducts: async (req, res) => {
        const { keyword } = req.query;
        try {
            const products = await productService.searchProducts(keyword);
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getSuggestions: async (req, res) => {
        const { query, limit } = req.query;
        try {
            const suggestions = await productService.getSuggestions(query, parseInt(limit, 10) || 5);
            res.status(200).json(suggestions);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },


    searchProductAdmin: async (req, res) => {
        const { query, page = 1, pageSize = 10 } = req.query;
        try {
            const result = await productService.searchProductAdmin(query, page, pageSize);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAllCategoriesController: async (req, res) => {
        try {
            const { cateReady } = await productService.getAllCategoriesService();
            res.status(200).json({ cateReady });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getAllConditionsController: async (req, res) => {
        try {
            const { conditionReady } = await productService.getAllConditionService();
            res.status(200).json({ conditionReady });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    getAllFormatsController: async (req, res) => {
        try {
            const { formatReady } = await productService.getAllFormatsService();
            res.status(200).json({ formatReady });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getAllDiscountsController: async (req, res) => {
        try {
            const { discountReady } = await productService.getAllDiscountsService();
            res.status(200).json({ discountReady });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    upView: async (req, res) => {
        try {
            // Lấy product_id từ tham số URL
            const { id } = req.params;
    
            // Kiểm tra nếu không có product_id
            if (!id) {
                return res.status(400).json({
                    success: false,
                    err: 1,
                    msg: 'Thiếu product_id',
                    status: 400,
                });
            }
    
            // Tăng lượt xem sản phẩm
            const upView = await productService.incrementProductView(id);
    
            // Trả về kết quả sau khi tăng lượt xem
            res.status(200).json({ success: true, upView });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    


    price: async (req, res) => {
        try {
            const { price } = req.params;
            const products = await productService.filterProductsByPrice(price);

            if (products.length > 0) {
                res.status(200).json({
                    data: products
                });
            } else {
                console.error("No products found in this price range");
                res.status(404).json({
                    message: "No products found in this price range"
                });
            }
        } catch (error) {
            console.error('Error fetching products by price:', error);
            res.status(500).json({
                message: 'Internal Server Error',
                error: error.message
            });
        }
    },


    deleteProduct: async (req, res) => {
        try {
            const product = await productService.deleteProduct(req.params.id);
            if (!product) {
                return res.status(404).json({ error: 'product not found' });
            }
            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
}


module.exports = productController