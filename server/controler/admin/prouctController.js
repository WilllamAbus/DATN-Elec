'use strict';
const modelProduct = require("../../model/product.model");
const modelCategory = require('../../model/catgories.model');
const Role = require('../../model/role.model');
const admin = require('firebase-admin');
const serviceAccount = require('../../config/serviceAccount.json');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const dotenv = require("dotenv");

dotenv.config();

const STORE_BUCKET = process.env.STORE_BUCKET;
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: STORE_BUCKET
    });
}

const storage = admin.storage();
const bucket = storage.bucket();

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

const productsController = {
    addProduct: async (req, res) => {
        try {
            const adminRole = await Role.findOne({ name: 'admin' });

            if (!adminRole) {
                return res.status(500).json({ message: "Không tìm thấy vai trò quản trị viên" });
            }

            if (!req.user.roles.includes(adminRole._id.toString())) {
                return res.status(403).json({ message: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể thêm sản phẩm" });
            }

            let { name, price, quantity, categoryid, createdAt, weight, brand, color, description, discount } = req.body;
            const image = req.file;

            if (!name || !price || !quantity || !categoryid || discount === undefined) {
                return res.status(400).json({ message: "Vui lòng nhập đủ thông tin" });
            }

            createdAt = createdAt ? new Date(createdAt) : new Date();

            let imageURL;
            if (image) {
                if (!Buffer.isBuffer(image.buffer)) {
                    return res.status(400).json({ message: "Dữ liệu hình ảnh không hợp lệ" });
                }

                const filename = `${uuidv4()}-${Date.now()}-${image.originalname}`;
                const file = bucket.file(`products/${filename}`);
                const fileStream = file.createWriteStream({
                    metadata: {
                        contentType: image.mimetype
                    }
                });

                fileStream.on('error', (err) => {
                    console.error('Lỗi khi tải lên Firebase Storage:', err);
                    res.status(500).json({ error: 'Không thể tải lên hình ảnh' });
                });

                fileStream.on('finish', async () => {
                    try {

                        await file.makePublic();

                        // Generate URL for the uploaded file
                        const [metadata] = await file.getMetadata();
                        imageURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;

                        await saveProduct();
                    } catch (err) {
                        console.error('Lỗi khi lấy URL của hình ảnh:', err);
                        res.status(500).json({ error: 'Không thể lấy URL của hình ảnh' });
                    }
                });

                fileStream.end(image.buffer);
            } else {
                await saveProduct();
            }

            async function saveProduct() {
                let data = { name, price, quantity, categoryid, createdAt, weight, brand, color, description, discount, image: imageURL };

                // Save to database
                const savedProduct = await modelProduct.create(data);
                res.status(201).json({ message: "Sản phẩm được tạo thành công", savedProduct });
            }
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
            res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
        }
    },
    listProduct: async (req, res) => {
        try {
            // Truy vấn để tìm các danh mục không bao gồm những danh mục đã bị xóa mềm
            const products = await modelProduct.find({ status: { $ne: 'disable' } });
            res.status(200).json(products);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
        }
    },

    hardDelete: async (req, res) => {
        const { id } = req.params;
        try {
            const hardDeletedProduct = await modelProduct.findByIdAndDelete(id);
            if (!hardDeletedProduct) {
                return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
            }
            res.status(200).json({ message: 'Sản phẩm đã được xóa thành công' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    },
    getOne: async (req, res) => {
        try {
            const adminRole = await Role.findOne({ name: 'admin' });

            if (!adminRole) {
                return res.status(500).json({ message: "Không tìm thấy vai trò quản trị viên" });
            }

            if (!req.user.roles.includes(adminRole._id.toString())) {
                return res.status(403).json({ message: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể xem sản phẩm" });
            }

            const { id } = req.params;
            const product = await modelProduct.findById(id);

            if (!product) {
                return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
            }

            res.status(200).json(product);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server" });
        }
    },
    update: async (req, res) => {
        try {
            const adminRole = await Role.findOne({ name: 'admin' });

            if (!adminRole) {
                return res.status(500).json({ message: "Không tìm thấy vai trò quản trị viên" });
            }

            if (!req.user.roles.includes(adminRole._id.toString())) {
                return res.status(403).json({ message: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể cập nhật sản phẩm" });
            }

            const { id } = req.params;
            const { name, price, quantity, categoryId, createdAt, discount, brand, color, description, weight } = req.body;
            const image = req.file ? req.file.filename : undefined;

            console.log('Request body:', req.body);

            if (!name || !price || !quantity || !categoryId || !createdAt || !discount) {
                return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin' });
            }

            let imageURL;
            if (image) {
                if (!Buffer.isBuffer(image.buffer)) {
                    return res.status(400).json({ message: "Dữ liệu hình ảnh không hợp lệ" });
                }

                const filename = `${uuidv4()}-${Date.now()}-${image.originalname}`;
                const file = bucket.file(`products/${filename}`);
                const fileStream = file.createWriteStream({
                    metadata: {
                        contentType: image.mimetype,
                    },
                });

                fileStream.on('error', (err) => {
                    console.error('Lỗi khi tải lên Firebase Storage:', err);
                    return res.status(500).json({ message: 'Không thể tải lên hình ảnh' });
                });

                fileStream.on('finish', async () => {
                    try {
                        await file.makePublic();
                        const [metadata] = await file.getMetadata();
                        imageURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;
                        await updateProductInDB();
                    } catch (err) {
                        console.error('Lỗi khi lấy URL của hình ảnh:', err);
                        return res.status(500).json({ message: 'Không thể lấy URL của hình ảnh' });
                    }
                });

                fileStream.end(image.buffer);
            } else {
                await updateProductInDB();
            }

            async function updateProductInDB() {
                const updatedData = { name, price, quantity, categoryId, createdAt, weight, brand, color, description, discount };
                if (imageURL) {
                    updatedData.image = imageURL;
                }

                const updatedProduct = await modelProduct.findByIdAndUpdate(id, updatedData, { new: true });

                if (!updatedProduct) {
                    return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
                }

                return res.status(200).json({ message: "Sản phẩm được cập nhật thành công", updatedProduct });
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật sản phẩm:', error);
            return res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
        }
    },


    getAllCategoriesController: async (req, res) => {
        try {

            const categories = await modelCategory.find({}).exec();

            const cateReady = categories.map(category => ({
                category: category._id,
                name: category.name,
                _id: category._id
            }));

            res.status(200).json({ cateReady });
        } catch (error) {
            console.error('Error fetching categories:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    // Xóa mềm danh mục
    softDelete: async (req, res) => {
        try {
            const adminRole = await Role.findOne({ name: 'admin' });

            if (!adminRole) {
                return res.status(500).json({ message: "Không tìm thấy vai trò quản trị viên" });
            }

            if (!req.user.roles.includes(adminRole._id.toString())) {
                return res.status(403).json({ message: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể xóa danh mục" });
            }

            const id = req.params.id;
            // Cập nhật trạng thái của danh mục thành "Đã xóa"
            const softDeletedProduct = await modelProduct.findByIdAndUpdate(id, { status: 'disable' }, { new: true });

            if (!softDeletedProduct) {
                return res.status(404).json({ message: "Không tìm thấy danh mục" });
            }

            // Trả về phản hồi thành công
            res.status(200).json({ message: 'Đã xóa thành công', data: softDeletedProduct });
        } catch (error) {
            // Xử lý lỗi và trả về phản hồi lỗi server
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },
    deletedList: async (req, res) => {
        try {
            const adminRole = await Role.findOne({ name: 'admin' });

            if (!adminRole) {
                return res.status(500).json({ message: "Không tìm thấy vai trò quản trị viên" });
            }

            if (!req.user.roles.includes(adminRole._id.toString())) {
                return res.status(403).json({ message: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể xem danh sách danh mục đã bị xóa mềm" });
            }

            const deleteListCategory = await modelProduct.find({ status: 'disable' }) || [];

            res.status(200).json({ data: deleteListCategory });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },
    restore: async (req, res) => {
        try {
            const adminRole = await Role.findOne({ name: 'admin' });

            // Kiểm tra vai trò admin
            if (!adminRole) {
                return res.status(500).json({ message: "Không tìm thấy vai trò quản trị viên" });
            }

            if (!req.user.roles.includes(adminRole._id.toString())) {
                return res.status(403).json({ message: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể khôi phục sản phẩm" });
            }

            // Kiểm tra sự tồn tại của id trong req.params
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Thiếu id sản phẩm" });
            }

            // Cập nhật trạng thái của sản phẩm thành 'active'
            const restoreProduct = await modelProduct.findByIdAndUpdate(id, { status: 'active' }, { new: true });

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






}

productsController.upload = upload.single('image');

module.exports = productsController;
