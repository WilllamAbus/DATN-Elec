"use strict";
const modelProductV2 = require("../../model/product_v2/index");
const modelProductVariant = require('../../model/product_v2/productVariant');
const modelInventory = require("../../model/inventory/inventory.model");
const { checkInventoryAndNotify } = require('../../services/inventoryChecker');
const modelProductAution = require("../../model/productAuction/productAuction");


const admin = require("firebase-admin");
const serviceAccount = require("../../config/serviceAccount.json");
const multer = require("multer");
const Role = require("../../model/role.model");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");

dotenv.config();

const STORE_BUCKET = process.env.STORE_BUCKET;
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: STORE_BUCKET,
    });
}

const storage = admin.storage();
const bucket = storage.bucket();

const multerStorage = multer.memoryStorage();


const inventoryController = {
    listInventory: async (req, res) => {
        try {
            const page = parseInt(req.query.page, 10) || 1; // Trang hiện tại, mặc định là 1
            const limit = parseInt(req.query.limit, 5) || 5; // Số kết quả mỗi trang, mặc định là 5

            // Tạo điều kiện truy vấn
            let query = {
                status: { $ne: "disable" },
                product_variant: { $exists: true, $type: "objectId" }
            };

            // Truy vấn dữ liệu các lô hàng với phân trang
            const inbounds = await modelInventory
                .find(query)
                .populate({
                    path: 'product_variant',
                    match: { _id: { $ne: null } },
                    select: 'variant_name',
                    populate: {
                        path: 'product',
                        select: 'product_supplier',
                        populate: {
                            path: 'product_supplier',
                            model: 'Supplier',
                            select: '_id name'
                        }
                    }
                })
            // Lọc các bản ghi có productAuction không phải null
            const filteredInbounds = inbounds.filter(item => item.product_variant !== null);

            // Tính toán tổng số trang
            const totalResults = filteredInbounds.length;
            const totalPages = Math.ceil(totalResults / limit);

            // Phân trang dữ liệu
            const paginatedInbounds = filteredInbounds.slice((page - 1) * limit, page * limit);
            // Trả về kết quả
            res.status(200).json({
                success: true,
                msg: "Lấy danh sách lô hàng thành công",
                data: paginatedInbounds,
                totalPages: totalPages,
                currentPage: page,
                totalResults: totalResults
            });
        } catch (error) {
            console.error("Lỗi khi lấy danh sách lô hàng:", error);
            res.status(500).json({
                success: false,
                msg: "Lỗi khi lấy danh sách lô hàng",
                error: error.message,
            });
        }
    },
    listInventoryV2: async (req, res) => {
        try {
            const page = parseInt(req.query.page, 10) || 1; // Sử dụng hệ thập phân, mặc định là 1 nếu không có giá trị
            const limit = parseInt(req.query.limit, 5) || 5; // Sử dụng hệ thập phân, mặc định là 10 nếu không có giá trị

            const inbounds = await modelInventory
                .find({ status: { $ne: "disable" }, productAuction: { $exists: true, $ne: null } })
                .populate({
                    path: 'productAuction',
                    match: { _id: { $ne: null } },
                    select: 'product_name',
                    populate: {
                        path: 'product_supplier',
                        model: 'Supplier',
                        select: '_id name'
                    }
                })
            // Lọc các bản ghi có productAuction không phải null
            const filteredInbounds = inbounds.filter(item => item.productAuction !== null);

            // Tính toán tổng số trang
            const totalResults = filteredInbounds.length;
            const totalPages = Math.ceil(totalResults / limit);

            // Phân trang dữ liệu
            const paginatedInbounds = filteredInbounds.slice((page - 1) * limit, page * limit);
            res.status(200).json({
                success: true,
                msg: "Lấy danh sách lô hàng thành công",
                data: paginatedInbounds,
                totalPages: totalPages,
                currentPage: page,
                totalResults: totalResults
            });
        } catch (error) {
            console.error("Lỗi khi lấy danh sách lô hàng:", error);
            res.status(500).json({
                success: false,
                msg: "Lỗi khi lấy danh sách lô hàng",
                error: error.message,
            });
        }
    },

    updateQuantityShelf: async (req, res) => {
        try {
            const { product_variant, quantity } = req.body;
            if (!product_variant || quantity == null) {
                return res.status(400).json({ message: "Vui lòng cung cấp thông tin sản phẩm và số lượng." });
            }

            // Tìm sản phẩm trong kho (inventory)
            const inventory = await modelInventory.findOne({ product_variant: product_variant });

            if (!inventory) {
                return res.status(404).json({ message: "Không tìm thấy sản phẩm trong kho." });
            }

            // Kiểm tra nếu quantity cần cập nhật vượt quá quantityStock
            if (quantity > inventory.quantityStock) {
                return res.status(400).json({ message: "Số lượng chuyển lên kệ vượt quá số lượng trong kho." });
            }

            // Cập nhật số lượng trên kệ và trong kho
            inventory.quantityShelf += quantity;
            inventory.quantityStock -= quantity;

            await inventory.save();
            const productVariant = await modelProductVariant.findById(product_variant);
            if (productVariant) {
                if (!productVariant.inventory.includes(inventory._id)) {
                    productVariant.inventory.push(inventory._id);
                    await productVariant.save();
                }
            }

            res.status(200).json({ message: "Cập nhật thành công.", inventory });
        } catch (error) {
            console.error("Lỗi khi cập nhật quantityShelf:", error);
            res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
        }
    },

    updateQuantityShelfProductV2: async (req, res) => {
        try {
            const { productAuction, quantity } = req.body;
            if (!productAuction || quantity == null) {
                return res.status(400).json({ message: "Vui lòng cung cấp thông tin sản phẩm và số lượng." });
            }

            // Tìm sản phẩm trong kho (inventory)
            const inventory = await modelInventory.findOne({ productAuction: productAuction });

            if (!inventory) {
                return res.status(404).json({ message: "Không tìm thấy sản phẩm trong kho." });
            }

            // Kiểm tra nếu quantity cần cập nhật vượt quá quantityStock
            if (quantity > inventory.quantityStock) {
                return res.status(400).json({ message: "Số lượng chuyển lên kệ vượt quá số lượng trong kho." });
            }

            // Cập nhật số lượng trên kệ và trong kho
            inventory.quantityShelf += quantity;
            inventory.quantityStock -= quantity;

            await inventory.save();

            const products = await modelProductV2.findById(productAuction);
            if (products) {
                // Kiểm tra nếu `products.inventory` tồn tại và là một mảng
                if (!Array.isArray(products.inventory)) {
                    products.inventory = []; // Khởi tạo thành mảng nếu chưa có
                }

                // Kiểm tra nếu inventory._id chưa có trong products.inventory
                if (!products.inventory.includes(inventory._id)) {
                    products.inventory.push(inventory._id);
                    await products.save();
                }
            }

            res.status(200).json({ message: "Cập nhật thành công.", inventory });
        } catch (error) {
            console.error("Lỗi khi cập nhật quantityShelf:", error);
            res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
        }
    },

    getProductsInInventoryController: async (req, res) => {
        try {
            // Tìm tất cả các bản ghi trong inventory và chỉ lấy trường 'product_variant'
            const inventoryItems = await modelInventory
                .find({
                    status: { $ne: 'disable' },
                    product_variant: { $exists: true }
                })
                .populate('product_variant', 'variant_name')
                .exec();

            // Duyệt qua các bản ghi inventory, lọc các bản ghi có product_variant không null
            const productsInInventory = inventoryItems
                .filter(item => item.product_variant !== null) // Lọc bỏ các item có product_variant là null
                .map(item => ({
                    product_variant: item.product_variant._id,
                    variant_name: item.product_variant.variant_name, // Assuming variant_name is populated
                    _id: item.product_variant._id
                }));

            res.status(200).json({ productsInInventory });
        } catch (error) {
            console.error('Error fetching products in inventory:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },


    getProductV2InInventoryController: async (req, res) => {
        try {
            // Tìm tất cả các bản ghi trong inventory và chỉ lấy trường 'productAuction'
            const inventoryItems = await modelInventory
                .find({ status: { $ne: 'disable' }, productAuction: { $exists: true } })
                .populate('productAuction', 'product_name')
                .exec();

            // Duyệt qua các bản ghi inventory, lọc ra những bản ghi có productAuction không null
            const productsInInventory = inventoryItems
                .filter(item => item.productAuction !== null) // Lọc bỏ các item có productAuction là null
                .map(item => ({
                    productAuction: item.productAuction._id,
                    product_name: item.productAuction.product_name, // Assuming product_name is populated
                    _id: item.productAuction._id
                }));

            res.status(200).json({ productsInInventory });
        } catch (error) {
            console.error('Error fetching products in inventory:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    getOne: async (req, res) => {
        try {
            // Lấy productId từ params
            const productId = req.params.productId;


            // Tìm sản phẩm trong inventory dựa trên productId
            const inventoryItem = await modelInventory.findOne({ product_variant: productId })
                .populate('product_variant', 'variant_name')
                .exec();

            if (inventoryItem) {
                res.status(200).json({
                    success: true,
                    msg: "Lấy thông tin sản phẩm thành công",
                    data: inventoryItem,
                });
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        } catch (error) {
            console.error('Error retrieving product:', error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    },
    getOneV2: async (req, res) => {
        try {
            // Lấy productId từ params
            const productId = req.params.productId;


            // Tìm sản phẩm trong inventory dựa trên productId
            const inventoryItem = await modelInventory.findOne({ productAuction: productId })
                .populate('productAuction', 'product_name')
                .exec();

            if (inventoryItem) {
                res.status(200).json({
                    success: true,
                    msg: "Lấy thông tin sản phẩm thành công",
                    data: inventoryItem,
                });
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        } catch (error) {
            console.error('Error retrieving product:', error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    },
    search: async (req, res) => {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const keyword = req.query.keyword;

            if (isNaN(page) || page <= 0) {
                return res.status(400).json({
                    message: "Số trang không hợp lệ",
                });
            }

            if (isNaN(limit) || limit <= 0 || limit > 100) {
                return res.status(400).json({
                    message: "Giới hạn số lượng kết quả trên mỗi trang không hợp lệ",
                });
            }

            if (!keyword || keyword.trim() === "") {
                return res.status(400).json({
                    message: "Từ khóa tìm kiếm không hợp lệ",
                });
            }

            // Tìm kiếm sản phẩm dựa trên variant_name
            const products = await modelProductVariant.find({
                variant_name: { $regex: keyword, $options: "i" }
            });

            const productIds = products.map(product => product._id);

            const searchQuery = {
                status: { $ne: "disable" },
                $or: [
                    { product_variant: { $in: productIds } }
                ]
            };

            // Đếm số lượng kết quả
            const totalResults = await modelInventory.countDocuments(searchQuery);

            if (totalResults === 0) {
                return res.status(200).json({
                    message: "Không tìm thấy kết quả nào",
                    data: [],
                    totalResults: 0,
                });
            }

            // Tìm kiếm với phân trang
            const result = await modelInventory
                .find(searchQuery)
                .populate({
                    path: 'product_variant',
                    select: 'variant_name',
                    populate: {
                        path: 'product',
                        select: 'product_supplier',
                        populate: {
                            path: 'product_supplier',
                            model: 'Supplier',
                            select: '_id name'
                        }
                    }
                })
                .skip((page - 1) * limit)
                .limit(limit);

            // Tính toán tổng số trang
            const totalPages = Math.ceil(totalResults / limit);

            // Trả về kết quả tìm kiếm
            res.status(200).json({
                message: "Tìm kiếm thành công",
                data: result,
                currentPage: page,
                totalResults,
                totalPages,
            });

        } catch (error) {
            console.error("Lỗi trong quá trình tìm kiếm:", error);
            res.status(500).json({
                message: "Lỗi máy chủ",
                error: error.message,
            });
        }
    },
    searchV2: async (req, res) => {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const keyword = req.query.keyword;

            if (isNaN(page) || page <= 0) {
                return res.status(400).json({
                    message: "Số trang không hợp lệ",
                });
            }

            if (isNaN(limit) || limit <= 0 || limit > 100) {
                return res.status(400).json({
                    message: "Giới hạn số lượng kết quả trên mỗi trang không hợp lệ",
                });
            }

            if (!keyword || keyword.trim() === "") {
                return res.status(400).json({
                    message: "Từ khóa tìm kiếm không hợp lệ",
                });
            }

            // Tìm kiếm sản phẩm dựa trên product_name
            const products = await modelProductAution.find({
                product_name: { $regex: keyword, $options: "i" }
            });

            const productIds = products.map(product => product._id);

            const searchQuery = {
                status: { $ne: "disable" },
                $or: [
                    { productAuction: { $in: productIds } }
                ]
            };

            // Đếm số lượng kết quả
            const totalResults = await modelInventory.countDocuments(searchQuery);

            if (totalResults === 0) {
                return res.status(200).json({
                    message: "Không tìm thấy kết quả nào",
                    data: [],
                    totalResults: 0,
                });
            }

            // Tìm kiếm với phân trang
            const result = await modelInventory
                .find(searchQuery)
                .populate({
                    path: 'productAuction',
                    select: 'product_name',
                    populate: {
                        path: 'product_supplier',
                        model: 'Supplier',
                        select: '_id name'
                    }
                })
                .skip((page - 1) * limit)
                .limit(limit);

            // Tính toán tổng số trang
            const totalPages = Math.ceil(totalResults / limit);

            // Trả về kết quả tìm kiếm
            res.status(200).json({
                message: "Tìm kiếm thành công",
                data: result,
                currentPage: page,
                totalResults,
                totalPages,
            });

        } catch (error) {
            console.error("Lỗi trong quá trình tìm kiếm:", error);
            res.status(500).json({
                message: "Lỗi máy chủ",
                error: error.message,
            });
        }
    },
    checkInventory: async (req, res) => {
        try {
            await checkInventoryAndNotify();  // Gọi hàm từ service
            res.status(200).json({ message: 'Đã kiểm tra tồn kho và gửi cảnh báo nếu cần.' });
        } catch (error) {
            console.error('Lỗi từ controller:', error);
            res.status(500).json({ message: 'Lỗi khi kiểm tra tồn kho.' });
        }
    },

};


module.exports = inventoryController;
