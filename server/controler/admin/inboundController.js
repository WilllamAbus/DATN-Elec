"use strict";
const modelInbound = require("../../model/inboundShipments.model");
const modelProductVariant = require("../../model/product_v2/productVariant");
const modelSupplier = require("../../model/suppliers.model");
const modelInventory = require("../../model/inventory/inventory.model");
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

const inboundController = {
    listInbounds: async (req, res) => {
        try {
            const page = parseInt(req.query.page, 10) || 1; // Trang hiện tại, mặc định là 1
            const limit = parseInt(req.query.limit, 5) || 5; // Số kết quả mỗi trang, mặc định là 5

            // Tạo điều kiện truy vấn
            let query = {
                status: { $ne: "disable" },
                product_variant_id: { $exists: true, $ne: null }
            };


            // Truy vấn dữ liệu các lô hàng với phân trang
            const inbounds = await modelInbound
                .find(query)
                .populate({
                    path: 'product_variant_id',
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
            const filteredInbounds = inbounds.filter(item => item.product_variant_id !== null);

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


    listInboundV2: async (req, res) => {
        try {
            // Lấy thông tin phân trang từ query
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 5;

            // Điều kiện truy vấn để lọc các lô hàng hợp lệ
            const query = {
                status: { $ne: "disable" },
                productAuction: { $exists: true, $ne: null }  // Lọc các bản ghi có productAuction không phải null
            };

            // Truy vấn tất cả các lô hàng mà không phân trang
            const inbounds = await modelInbound
                .find(query)
                .populate({
                    path: 'productAuction',
                    select: 'product_name',
                    populate: {
                        path: 'product_supplier',
                        model: 'Supplier',
                        select: '_id name'
                    }
                });

            // Lọc các bản ghi có productAuction không phải null
            const filteredInbounds = inbounds.filter(item => item.productAuction !== null);

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

            let {
                product_variant_id,
                inbound_quantity,
                inbound_description,
                inbound_price,
                totalPriceInbound
            } = req.body;

            if (
                !product_variant_id ||
                !inbound_quantity ||
                !inbound_description ||
                !inbound_price ||
                !totalPriceInbound
            ) {
                return res
                    .status(400)
                    .json({ message: "Vui lòng nhập đầy đủ thông tin lô hàng" });
            }

            const data = {
                product_variant_id,
                inbound_quantity,
                inbound_description,
                inbound_price,
                totalPriceInbound
            };
            const savedInbound = await modelInbound.create(data);

            // Tìm kiếm sản phẩm trong inventory
            const existingInventory = await modelInventory.findOne({
                product_variant: product_variant_id,
            });

            if (existingInventory) {
                // Cập nhật bản ghi inventory hiện có
                existingInventory.totalQuantity += inbound_quantity;
                existingInventory.quantityStock += inbound_quantity;
                existingInventory.price = inbound_price;
                existingInventory.totalPrice =
                    existingInventory.quantityStock * inbound_price;
                await existingInventory.save();
            } else {
                // Tạo mới bản ghi inventory
                const inventoryData = {
                    product_variant: product_variant_id,
                    totalQuantity: inbound_quantity,
                    quantityStock: inbound_quantity,
                    quantityShelf: 0,
                    price: inbound_price,
                    totalPrice: inbound_quantity * inbound_price,
                };
                await modelInventory.create(inventoryData);
            }

            res
                .status(201)
                .json({
                    message: "Lô hàng được tạo thành công và cập nhật kho hàng",
                    savedInbound,
                });
        } catch (error) {
            console.error("Lỗi khi thêm lô hàng:", error);
            res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
        }
    },

    addInboundProduct: async (req, res) => {
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

            let {
                productAuction,
                inbound_quantity,
                inbound_description,
                inbound_price,
                totalPriceInbound
            } = req.body;

            if (
                !productAuction ||
                !inbound_quantity ||
                !inbound_description ||
                !inbound_price ||
                !totalPriceInbound
            ) {
                return res
                    .status(400)
                    .json({ message: "Vui lòng nhập đầy đủ thông tin lô hàng" });
            }

            const data = {
                productAuction,
                inbound_quantity,
                inbound_description,
                inbound_price,
                totalPriceInbound
            };
            const savedInbound = await modelInbound.create(data);

            // Tìm kiếm sản phẩm trong inventory
            const existingInventory = await modelInventory.findOne({
                productAuction: productAuction,
            });

            if (existingInventory) {
                // Cập nhật bản ghi inventory hiện có
                existingInventory.totalQuantity += inbound_quantity;
                existingInventory.quantityStock += inbound_quantity;
                existingInventory.price = inbound_price;
                existingInventory.totalPrice =
                    existingInventory.quantityStock * inbound_price;
                await existingInventory.save();
            } else {
                // Tạo mới bản ghi inventory
                const inventoryData = {
                    productAuction: productAuction,
                    totalQuantity: inbound_quantity,
                    quantityStock: inbound_quantity,
                    quantityShelf: 0,
                    price: inbound_price,
                    totalPrice: inbound_quantity * inbound_price,
                };
                await modelInventory.create(inventoryData);
            }

            res
                .status(201)
                .json({
                    message: "Lô hàng được tạo thành công và cập nhật kho hàng",
                    savedInbound,
                });
        } catch (error) {
            console.error("Lỗi khi thêm lô hàng:", error);
            res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
        }
    },
    editInbound: async (req, res) => {
        try {
            const { id } = req.params;
            let {
                product_variant_id,
                inbound_quantity,
                inbound_description,
                inbound_price,
                totalPriceInbound
            } = req.body;

            if (
                !id ||
                !product_variant_id ||
                !inbound_quantity ||
                !inbound_description ||
                !inbound_price ||
                !totalPriceInbound
            ) {
                return res
                    .status(400)
                    .json({ message: "Vui lòng nhập đầy đủ thông tin lô hàng" });
            }

            // Tìm kiếm lô hàng cần chỉnh sửa
            const inbound = await modelInbound.findById(id);
            if (!inbound) {
                return res.status(404).json({ message: "Không tìm thấy lô hàng" });
            }

            // Cập nhật thông tin lô hàng
            inbound.product_variant_id = product_variant_id;
            inbound.inbound_quantity = inbound_quantity;
            inbound.inbound_description = inbound_description;
            inbound.inbound_price = inbound_price;
            inbound.totalPriceInbound = totalPriceInbound;

            await inbound.save();

            // Tìm kiếm sản phẩm trong inventory
            const existingInventory = await modelInventory.findOne({
                product_variant: product_variant_id,
            });

            if (existingInventory) {
                // Cập nhật bản ghi inventory hiện có
                existingInventory.totalQuantity +=
                    inbound_quantity - inbound.inbound_quantity; // Cập nhật số lượng tổng
                existingInventory.quantityStock +=
                    inbound_quantity - inbound.inbound_quantity; // Cập nhật số lượng tồn kho
                existingInventory.price = inbound_price; // Cập nhật giá
                existingInventory.totalPrice =
                    existingInventory.quantityStock * inbound_price; // Cập nhật tổng giá
                await existingInventory.save();
            } else {
                // Nếu không có inventory, tạo mới
                const inventoryData = {
                    product_variant: product_variant_id,
                    totalQuantity: inbound_quantity,
                    quantityStock: inbound_quantity,
                    quantityShelf: 0,
                    price: inbound_price,
                    totalPrice: inbound_quantity * inbound_price,
                    status: "active",
                };
                await modelInventory.create(inventoryData);
            }

            res
                .status(200)
                .json({
                    message: "Lô hàng được chỉnh sửa thành công và cập nhật kho hàng",
                    updatedInbound: inbound,
                });
        } catch (error) {
            console.error("Lỗi khi chỉnh sửa lô hàng:", error);
            res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
        }
    },

    editInboundV2: async (req, res) => {
        try {
            const { id } = req.params;
            let {
                productAuction,
                inbound_quantity,
                inbound_description,
                inbound_price,
                totalPriceInbound
            } = req.body;

            if (
                !id ||
                !productAuction ||
                !inbound_quantity ||
                !inbound_description ||
                !inbound_price ||
                !totalPriceInbound
            ) {
                return res
                    .status(400)
                    .json({ message: "Vui lòng nhập đầy đủ thông tin lô hàng" });
            }

            // Tìm kiếm lô hàng cần chỉnh sửa
            const inbound = await modelInbound.findById(id);
            if (!inbound) {
                return res.status(404).json({ message: "Không tìm thấy lô hàng" });
            }

            // Cập nhật thông tin lô hàng
            inbound.productAuction = productAuction;
            inbound.inbound_quantity = inbound_quantity;
            inbound.inbound_description = inbound_description;
            inbound.inbound_price = inbound_price;
            inbound.totalPriceInbound = totalPriceInbound;

            await inbound.save();

            // Tìm kiếm sản phẩm trong inventory
            const existingInventory = await modelInventory.findOne({
                productAuction: productAuction,
            });

            if (existingInventory) {
                // Cập nhật bản ghi inventory hiện có
                existingInventory.totalQuantity +=
                    inbound_quantity - inbound.inbound_quantity; // Cập nhật số lượng tổng
                existingInventory.quantityStock +=
                    inbound_quantity - inbound.inbound_quantity; // Cập nhật số lượng tồn kho
                existingInventory.price = inbound_price; // Cập nhật giá
                existingInventory.totalPrice =
                    existingInventory.quantityStock * inbound_price; // Cập nhật tổng giá
                await existingInventory.save();
            } else {
                // Nếu không có inventory, tạo mới
                const inventoryData = {
                    productAuction: productAuction,
                    totalQuantity: inbound_quantity,
                    quantityStock: inbound_quantity,
                    quantityShelf: 0,
                    price: inbound_price,
                    totalPrice: inbound_quantity * inbound_price,
                    status: "active",
                };
                await modelInventory.create(inventoryData);
            }

            res
                .status(200)
                .json({
                    message: "Lô hàng được chỉnh sửa thành công và cập nhật kho hàng",
                    updatedInbound: inbound,
                });
        } catch (error) {
            console.error("Lỗi khi chỉnh sửa lô hàng:", error);
            res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
        }
    },

    getProductController: async (req, res) => {
        try {
            // Tìm tất cả các product variant mà trạng thái không phải là "disable"
            const productVariants = await modelProductVariant
                .find({ status: { $ne: "disable" } })
                // Populate để lấy dữ liệu product và supplier liên quan
                .populate({
                    path: 'product', // Lấy thông tin product dựa trên quan hệ từ variant
                    populate: {
                        path: 'product_supplier', // Lấy thông tin supplier từ product
                        model: 'Supplier',
                        select: '_id name' // Chỉ lấy _id và name của supplier
                    }
                })
                .exec();

            // Map lại dữ liệu để trả về cho API
            const productReady = productVariants.map((product) => ({
                productVariant: product._id,
                variant_name: product.variant_name,
                supplier: product.product.product_supplier, // Bao gồm supplier
                _id: product._id,
            }));

            // Trả về dữ liệu JSON
            res.status(200).json({ productReady });
        } catch (error) {
            console.error("Error fetching categories:", error);
            res.status(500).json({ error: "Server error" });
        }
    },


    getProductV2Controller: async (req, res) => {
        try {
            const products = await modelProductAution
                .find({ status: { $ne: "disable" } })
                .exec();

            const productReady = products.map((product) => ({
                productAuction: product._id,
                product_name: product.product_name,
                _id: product._id,
            }));

            res.status(200).json({ productReady });
        } catch (error) {
            console.error("Error fetching products:", error);
            res.status(500).json({ error: "Server error" });
        }
    },
    getAllSuppliersController: async (req, res) => {
        try {
            const suppliers = await modelSupplier
                .find({ status: { $ne: "disable" } })
                .exec();

            const supplierReady = suppliers.map((supplier) => ({
                supplier: supplier._id,
                name: supplier.name,
                _id: supplier._id,
            }));
            // console.log(supplierReady);

            res.status(200).json({ supplierReady });
        } catch (error) {
            console.error("Error fetching suppliers:", error);
            res.status(500).json({ error: "Server error" });
        }
    },
    getOne: async (req, res) => {
        try {
            const { id } = req.params;
            const inbound = await modelInbound
                .findById(id)
                .populate("product_variant_id", "variant_name");

            if (!inbound) {
                return res.status(404).json({ message: "Không tìm thấy lô hàng" });
            }

            res.status(200).json(inbound);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server" });
        }
    },

    getOneV2: async (req, res) => {
        try {
            const { id } = req.params;
            const inbound = await modelInbound
                .findById(id)
                .populate("productAuction", "product_name");

            if (!inbound) {
                return res.status(404).json({ message: "Không tìm thấy lô hàng" });
            }

            res.status(200).json(inbound);
        } catch (error) {
            console.error("Error in getOneV2:", error);
            if (error.name === 'MongooseError' && error.message.includes('buffering timed out')) {
                res.status(504).json({ message: "Thời gian kết nối đến cơ sở dữ liệu quá lâu" });
            } else {
                res.status(500).json({ message: "Lỗi server", error: error.message });
            }
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
                    { product_variant_id: { $in: productIds } }
                ]
            };

            // Đếm số lượng kết quả
            const totalResults = await modelInbound.countDocuments(searchQuery);

            if (totalResults === 0) {
                return res.status(200).json({
                    message: "Không tìm thấy kết quả nào",
                    data: [],
                    totalResults: 0,
                });
            }

            // Tìm kiếm với phân trang
            const result = await modelInbound
                .find(searchQuery)
                .populate({
                    path: 'product_variant_id',
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
            const totalResults = await modelInbound.countDocuments(searchQuery);

            if (totalResults === 0) {
                return res.status(200).json({
                    message: "Không tìm thấy kết quả nào",
                    data: [],
                    totalResults: 0,
                });
            }

            // Tìm kiếm với phân trang
            const result = await modelInbound
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


    hardDelete: async (req, res) => {
        const { id } = req.params;
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
                    .status(403)
                    .json({
                        message:
                            "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể xóa đơn nhập hàng",
                    });
            }

            const hardDeletedInbound = await modelInbound.findByIdAndDelete(id);
            if (!hardDeletedInbound) {
                return res
                    .status(404)
                    .json({ message: "Không tìm thấy đơn nhập hàng" });
            }
            res.status(200).json({ message: "Đơn hàng đã được xóa thành công" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server" });
        }
    },
    softDelete: async (req, res) => {
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
                    .status(403)
                    .json({
                        message:
                            "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể xóa đơn nhập hàng",
                    });
            }

            const id = req.params.id;
            // Cập nhật trạng thái của danh mục thành "Đã xóa"
            const softDeletedInbound = await modelInbound.findByIdAndUpdate(
                id,
                { status: "disable" },
                { new: true }
            );

            if (!softDeletedInbound) {
                return res.status(404).json({ message: "Không tìm thấy thương hiệu" });
            }

            // Trả về phản hồi thành công
            res
                .status(200)
                .json({ message: "Đã xóa thành công", data: softDeletedInbound });
        } catch (error) {
            // Xử lý lỗi và trả về phản hồi lỗi server
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },
    restore: async (req, res) => {
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
                    .status(403)
                    .json({
                        message:
                            "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể khôi phục đơn hàng ",
                    });
            }

            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Thiếu id đơn hàng" });
            }

            // Cập nhật trạng thái của sản phẩm thành 'active'
            const restoreInbound = await modelInbound.findByIdAndUpdate(
                id,
                { status: "active" },
                { new: true }
            );

            if (!restoreInbound) {
                return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
            }

            // Trả về phản hồi thành công
            res
                .status(200)
                .json({
                    message: "Đơn hàng đã được khôi phục thành công",
                    data: restoreInbound,
                });
        } catch (error) {
            // Xử lý lỗi và trả về phản hồi lỗi server
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },


    deletedList: async (req, res) => {
        try {
            const page = parseInt(req.query.page, 10) || 1; // Sử dụng hệ thập phân, mặc định là 1 nếu không có giá trị
            const limit = parseInt(req.query.limit, 5) || 5; // Sử dụng hệ thập phân, mặc định là 10 nếu không có giá trị

            const count = await modelInbound.countDocuments({
                status: "disable",
            });
            const totalPages = Math.ceil(count / limit);

            const deleteListInbound = await modelInbound
                .find({ status: "disable" })
                .populate("product_variant_id", "variant_name")
                .populate("product_id", "product_name")
                .populate("inbound_supplier", "name")
                .skip((page - 1) * limit)
                .limit(limit);
            res.status(200).json({
                success: true,
                data: deleteListInbound,
                totalPages: totalPages,
            });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    searchDelete: async (req, res) => {
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
            const searchQuery = {
                name: { $regex: keyword, $options: "i" },
                status: "disable",
            };

            // Get the total count for pagination purposes
            const totalResults = await modelInbound.countDocuments(searchQuery);

            // If no results, return a suitable message
            if (totalResults === 0) {
                return res.status(200).json({
                    message: "Không tìm thấy kết quả nào",
                    data: [],
                    totalResults: 0,
                });
            }

            // Execute the search query with pagination
            const result = await modelInbound
                .find(searchQuery)
                .populate('product_variant_id', 'variant_name')
                .populate('product_id', 'product_name')
                .populate('inbound_supplier', 'name')
                .skip((page - 1) * limit)
                .limit(limit);

            // Return the search results with pagination info
            res.status(200).json({
                message: "Tìm kiếm thành công",
                data: result,
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
