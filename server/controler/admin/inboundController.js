"use strict";
const modelInbound = require("../../model/inboundShipments.model");
const modelProduct = require("../../model/product_v2");
const modelSupplier = require("../../model/suppliers.model");

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

            const count = await modelSupplier.countDocuments({
                status: { $ne: "disable" },
            });
            const totalPages = Math.ceil(count / limit);
            const inbounds = await modelInbound.find({})
                .populate('product_id', 'product_name')
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

            let { product_id, inbound_supplier, inbound_quantity, inbound_description, inbound_price } = req.body;

            if (!product_id || !inbound_supplier || !inbound_quantity || !inbound_description || !inbound_price) {
                return res
                    .status(400)
                    .json({ message: "Vui lòng nhập đầy đủ thông tin lô hàng" });
            }

            const data = { product_id, inbound_supplier, inbound_quantity, inbound_description, inbound_price };
            const savedInbound = await modelInbound.create(data);

            
            res
                .status(201)
                .json({ message: "Lô hàng được tạo thành công", savedInbound });
        } catch (error) {
            console.error("Lỗi khi thêm lô hàng:", error);
            res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
        }
    },
    getProductController: async (req, res) => {
        try {

            const products = await modelProduct.find({}).exec();

            const productReady = products.map(product => ({
                product: product._id,
                product_name: product.product_name,
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

            const suppliers = await modelSupplier.find({}).exec();

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


};


module.exports = inboundController;
