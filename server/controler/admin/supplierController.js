'use strict';
const modelSupplier = require('../../model/suppliers.model');
const admin = require('firebase-admin');
const serviceAccount = require('../../config/serviceAccount.json');
const multer = require('multer');
const Role = require('../../model/role.model');
const dotenv = require("dotenv");
const { v4: uuidv4 } = require('uuid');
const modelUser = require("../../model/users.model");


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

const supplierController = {

    listSuppliers: async (req, res) => {
        try {
            const suppliers = await modelSupplier.find({ status: { $ne: 'disable' } });
            res.status(200).json({
                success: true,
                msg: "Lấy danh sách nhà cung cấp thành công",
                data: suppliers
            });
        } catch (error) {
            console.error('Lỗi khi lấy danh sách nhà cung cấp:', error);
            res.status(500).json({
                success: false,
                msg: "Lỗi khi lấy danh sách nhà cung cấp",
                error: error.message
            });
        }
    },

    addSupplier: async (req, res) => {
        try {
            const adminRole = await Role.findOne({ name: 'admin' });
    
            if (!adminRole) {
                return res.status(500).json({ message: "Không tìm thấy vai trò quản trị viên" });
            }

            const isAdmin = req.user.roles.some(role => role._id.toString() === adminRole._id.toString());
    
            if (!isAdmin) {
                return res.status(401).json({ message: "Bạn không có quyền thêm mới nhà cung cấp" });
            }

            let { name, address, phone, description } = req.body;
            const image = req.file;
            console.log(image);

            if (!name || !address || !phone || !description) {
                return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin nhà cung cấp" });
            }

            let imageURL;
            if (image) {
                if (!Buffer.isBuffer(image.buffer)) {
                    return res.status(400).json({ message: "Dữ liệu hình ảnh không hợp lệ" });
                }

                try {
                    const filename = `${uuidv4()}-${Date.now()}-${image.originalname}`;
                    const file = bucket.file(`suppliers/${filename}`);
                    
                    await file.save(image.buffer, {
                        metadata: { contentType: image.mimetype }
                    });

                    await file.makePublic();
                    imageURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;
                } catch (err) {
                    console.error('Lỗi khi tải lên Firebase Storage:', err);
                    return res.status(500).json({ message: 'Không thể tải lên hình ảnh', error: err.message });
                }
            }

            const data = { name, address, phone, description, image: imageURL };
            const savedSupplier = await modelSupplier.create(data);
            res.status(201).json({ message: "Nhà cung cấp được tạo thành công", savedSupplier });
            
        } catch (error) {
            console.error('Lỗi khi thêm nhà cung cấp:', error);
            res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
        }
    },
    getOne: async (req, res) => {
        try {
            const { id } = req.params;
            const supplier = await modelSupplier.findById(id);

            if (!supplier) {
                return res.status(404).json({ message: "Không tìm thấy nhà cung cấp" });
            }

            res.status(200).json(supplier);
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
    
    
            const isAdmin = req.user.roles.some(role => role._id.toString() === adminRole._id.toString());
    
            if (!isAdmin) {
                return res.status(403).json({ message: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể cập nhật nhà cung cấp" });
            }
    
    
            const { id } = req.params;
            const { name, description, address, phone } = req.body;
            const image = req.file ? req.file.filename : undefined;
    
    
    
            if (!name || !description || !address || !phone ) {
                return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin' });
            }
    
            let imageURL;
            if (image) {
                if (!Buffer.isBuffer(image.buffer)) {
                    return res.status(400).json({ message: "Dữ liệu hình ảnh không hợp lệ" });
                }
    
                const filename = `${uuidv4()}-${Date.now()}-${image.originalname}`;
                const file = bucket.file(`suppliers/${filename}`);
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
                        await updateSupplierInDB();
                    } catch (err) {
                        console.error('Lỗi khi lấy URL của hình ảnh:', err);
                        return res.status(500).json({ message: 'Không thể lấy URL của hình ảnh' });
                    }
                });
    
                fileStream.end(image.buffer);
            } else {
                await updateSupplierInDB();
            }
    
            async function updateSupplierInDB() {
                const updatedData = { name, address, phone, description };
                if (imageURL) {
                    updatedData.image = imageURL;
                }
    
                const updatedSuppliers = await modelSupplier.findByIdAndUpdate(id, updatedData, { new: true });
    
                if (!updatedSuppliers) {
                    return res.status(404).json({ message: "Không tìm thấy nhà cung cấp" });
                }
    
                return res.status(200).json({ message: "Nhà cung cấp được cập nhật thành công", updatedSuppliers });
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật nhà cung cấp:', error);
            return res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
        }
    },
    hardDelete: async (req, res) => {
        const { id } = req.params;
        try {
            const adminRole = await Role.findOne({ name: 'admin' });


            if (!adminRole) {
                return res.status(500).json({ message: "Không tìm thấy vai trò quản trị viên" });
            }


            const isAdmin = req.user.roles.some(role => role._id.toString() === adminRole._id.toString());

            if (!isAdmin) {
                return res.status(403).json({ message: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể xóa nhà cung cấp" });
            }

            const hardDeletedSupplier = await modelSupplier.findByIdAndDelete(id);
            if (!hardDeletedSupplier) {
                return res.status(404).json({ message: 'Không tìm thấy nhà cung cấp' });
            }
            res.status(200).json({ message: 'Nhà cung cấp đã được xóa thành công' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    },
    softDelete: async (req, res) => {
        try {
            const adminRole = await Role.findOne({ name: 'admin' });


            if (!adminRole) {
                return res.status(500).json({ message: "Không tìm thấy vai trò quản trị viên" });
            }


            const isAdmin = req.user.roles.some(role => role._id.toString() === adminRole._id.toString());

            if (!isAdmin) {
                return res.status(403).json({ message: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể xóa nhà cung cấp" });
            }

            const id = req.params.id;
            // Cập nhật trạng thái của danh mục thành "Đã xóa"
            const softDeletedSupplier= await modelSupplier.findByIdAndUpdate(id, { status: 'disable' }, { new: true });

            if (!softDeletedSupplier) {
                return res.status(404).json({ message: "Không tìm thấy nhà cung cấp" });
            }

            // Trả về phản hồi thành công
            res.status(200).json({ message: 'Đã xóa thành công', data: softDeletedSupplier });
        } catch (error) {
            // Xử lý lỗi và trả về phản hồi lỗi server
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },
}




supplierController.upload = upload.single('image');

module.exports = supplierController;
