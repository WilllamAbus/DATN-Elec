"use strict";
const modelInbound = require("../../model/inboundShipments.model");
const modelProductVariant = require("../../model/product_v2/productVariant");
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


const inboundController = {
    listInbounds: async (req, res) => {
        try {
            const page = parseInt(req.query.page, 10) || 1;  // Sử dụng hệ thập phân, mặc định là 1 nếu không có giá trị
            const limit = parseInt(req.query.limit, 5) || 5; // Sử dụng hệ thập phân, mặc định là 10 nếu không có giá trị

            const count = await modelInbound.countDocuments({ });
            const totalPages = Math.ceil(count / limit);
            const inbounds = await modelInbound.find({})
                .populate('product_variant_id', 'variant_name')
                .populate('inbound_supplier', 'name')
                .skip((page - 1) * limit)
                .limit(limit);
            res.status(200).json({
                success: true,
                msg: "Lấy danh sách lô hàng thành công",
                data: inbounds,
                totalPages: totalPages,
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

    addInbound: async (req, res) => {
        try {
            const adminRole = await Role.findOne({ name: "admin" });

            if (!adminRole) {
                return res
                    .status(500)
                    .json({ message: "Không tìm thấy vai trò quản trị viên" });
            }

            const isAdmin = req.user.roles.some(
                (role) => role._id.toString() === adminRole._id.toString()
            );

            if (!isAdmin) {
                return res
                    .status(401)
                    .json({ message: "Bạn không có quyền thêm mới lô hàng" });
            }

            let {product_variant_id, inbound_supplier, inbound_quantity, inbound_description, inbound_price } = req.body;

            if (!product_variant_id || !inbound_supplier || !inbound_quantity || !inbound_description || !inbound_price) {
                return res
                    .status(400)
                    .json({ message: "Vui lòng nhập đầy đủ thông tin lô hàng" });
            }

            const data = { product_variant_id, inbound_supplier, inbound_quantity, inbound_description, inbound_price };
            const savedInbound = await modelInbound.create(data);

            // Tìm kiếm sản phẩm trong inventory
            const existingInventory = await modelInventory.findOne({
                product_variant: product_variant_id,
                supplier: inbound_supplier
            });

            if (existingInventory) {
                // Cập nhật bản ghi inventory hiện có
                existingInventory.totalQuantity += inbound_quantity;
                existingInventory.quantityStock += inbound_quantity;
                existingInventory.price = inbound_price;
                existingInventory.totalPrice = existingInventory.quantityStock * inbound_price;
                await existingInventory.save();
            } else {
                // Tạo mới bản ghi inventory
                const inventoryData = {
                    product_variant: product_variant_id,
                    supplier: inbound_supplier,
                    totalQuantity: inbound_quantity,
                    quantityStock: inbound_quantity,
                    quantityShelf: 0,
                    price: inbound_price,
                    totalPrice: inbound_quantity * inbound_price,
                    status: 'active'
                };
                await modelInventory.create(inventoryData);
            }

            res
                .status(201)
                .json({ message: "Lô hàng được tạo thành công và cập nhật kho hàng", savedInbound });
        } catch (error) {
            console.error("Lỗi khi thêm lô hàng:", error);
            res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
        }
    },
    getProductController: async (req, res) => {
        try {


            const productVariants = await modelProductVariant.find({ status: { $ne: "disable" } }).exec();

            const productReady = productVariants.map(product => ({
                productVariant: product._id,
                product_name: product.variant_name,
                _id: product._id
            }));

            res.status(200).json({ productReady });
        } catch (error) {
            console.error('Error fetching categories:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },
    getAllSuppliersController: async (req, res) => {
        try {

            const suppliers = await modelSupplier.find({ status: { $ne: "disable" } }).exec();

            const supplierReady = suppliers.map(supplier => ({
                supplier: supplier._id,
                name: supplier.name,
                _id: supplier._id
            }));
            // console.log(supplierReady);

            res.status(200).json({ supplierReady });
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },
    getOne: async (req, res) => {
        try {
            const { id } = req.params;
            const inbound = await modelInbound.findById(id)
                .populate('product_id', 'product_name')
                .populate('inbound_supplier', 'name');

            if (!inbound) {
                return res.status(404).json({ message: "Không tìm thấy lô hàng" });
            }

            res.status(200).json(inbound);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server" });
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
    
            // Sử dụng `populate` để tìm kiếm theo product_name trong product_v2

    
            // Tính tổng kết quả
            const totalResults = await modelInbound
                .find()
                .populate({
                    path: 'product_id', // Tên tham chiếu trong inboundShipmentSchema
                    match: { product_name: { $regex: keyword, $options: 'i' } }, // Tìm kiếm theo tên sản phẩm
                    select: 'product_name', // Chỉ lấy trường `product_name`
                })
                .countDocuments();
    
            if (totalResults === 0) {
                return res.status(200).json({
                    message: "Không tìm thấy kết quả nào",
                    data: [],
                    totalResults: 0,
                });
            }
    
            // Lấy kết quả với phân trang và tìm kiếm
            const result = await modelInbound
                .find()
                .populate({
                    path: 'product_id', 
                    match: { product_name: { $regex: keyword, $options: 'i' } }, 
                    select: 'product_name',
                })
                .populate('inbound_supplier', 'name') // Tham chiếu đến nhà cung cấp
                .skip((page - 1) * limit)
                .limit(limit);
    
            // Lọc ra những kết quả không khớp (populate sẽ trả về null cho những kết quả không có product_name khớp với keyword)
            const filteredResults = result.filter(item => item.product_id !== null);
    
            res.status(200).json({
                message: "Tìm kiếm thành công",
                data: filteredResults,
                currentPage: page,
                totalResults,
                totalPages: Math.ceil(totalResults / limit),
            });
        } catch (error) {
            console.error("Lỗi trong quá trình tìm kiếm:", error);
            res.status(500).json({
                message: "Lỗi máy chủ",
                error: error.message,
            });
        }
    },


};


module.exports = inboundController;
