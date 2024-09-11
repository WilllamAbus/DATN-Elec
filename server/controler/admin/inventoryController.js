"use strict";
const modelInbound = require("../../model/inboundShipments.model");
const modelProduct = require("../../model/product_v2");
const modelSupplier = require("../../model/suppliers.model");
const modelInventory = require("../../model/inventory/inventory.model");

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
            const page = parseInt(req.query.page, 10) || 1;  // Sử dụng hệ thập phân, mặc định là 1 nếu không có giá trị
            const limit = parseInt(req.query.limit, 5) || 5; // Sử dụng hệ thập phân, mặc định là 10 nếu không có giá trị

            const count = await modelInventory.countDocuments({
                status: { $ne: "disable" },
            });
            const totalPages = Math.ceil(count / limit);
            const inventories = await modelInventory.find({})
                .populate('product', 'product_name')
                .populate('supplier', 'name')
                .skip((page - 1) * limit)
                .limit(limit);
            res.status(200).json({
                success: true,
                msg: "Lấy danh sách kho hàng thành công",
                data: inventories,
                totalPages: totalPages,
            });
        } catch (error) {
            console.error("Lỗi khi lấy danh sách kho hàng:", error);
            res.status(500).json({
                success: false,
                msg: "Lỗi khi lấy danh sách kho hàng",
                error: error.message,
            });
        }
    },

    updateQuantityShelf : async (req, res) => {
        try {
            const { product_id, quantity} = req.body;
            if (!product_id || quantity == null) {
                return res.status(400).json({ message: "Vui lòng cung cấp thông tin sản phẩm và số lượng." });
            }
    
            // Tìm sản phẩm trong kho (inventory)
            const inventory = await modelInventory.findOne({ product: product_id });
    
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
    
            // Lưu lại cập nhật
            await inventory.save();
    
            res.status(200).json({ message: "Cập nhật thành công.", inventory });
        } catch (error) {
            console.error("Lỗi khi cập nhật quantityShelf:", error);
            res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
        }
    },
    getProductsInInventoryController : async (req, res) => {
        try {
            // Tìm tất cả các bản ghi trong inventory và chỉ lấy trường 'product'
            const inventoryItems = await modelInventory.find({}, 'product')
            .populate('product', 'product_name')
            .exec();
    
            // Duyệt qua các bản ghi inventory và tạo danh sách các
            const productsInInventory = inventoryItems.map(item => ({
                product: item.product._id,
                product_name: item.product.product_name, // Assuming product_name is populated
                _id: item.product._id
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
            const inventoryItem = await modelInventory.findOne({ product: productId })
                .populate('product', 'product_name')
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
    }

};


module.exports = inventoryController;
