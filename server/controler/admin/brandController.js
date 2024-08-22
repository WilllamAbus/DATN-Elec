'use strict';
const modelBrand = require('../../model/brands.model');
const admin = require('firebase-admin');
const serviceAccount = require('../../config/serviceAccount.json');
const multer = require('multer');
const dotenv = require("dotenv");
const { create } = require('../../model/role.model');

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

const brandController = {

    listBrands: async (req, res) => {
        try {
            const brands = await modelBrand.find();
            res.status(200).json({
                success: true,
                msg: "Lấy danh sách sản phẩm thành công",
                data: brands
            });
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            res.status(500).json({
                success: false,
                msg: "Lỗi khi lấy danh sách sản phẩm",
                error: error.message
            });
        }
    },

    addBrand: async (req, res) => {
        try {
            // Tìm vai trò quản trị viên
            const adminRole = await Role.findOne({ name: 'admin' });
    
            if (!adminRole) {
                return res.status(500).json({ message: "Không tìm thấy vai trò quản trị viên" });
            }
    
            // Kiểm tra quyền của người dùng
            const isAdmin = req.user.roles.some(role => role._id.toString() === adminRole._id.toString());
    
            if (!isAdmin) {
                return res.status(401).json({ message: "Bạn không có quyền thêm mới thương hiệu" });
            }
    
            // Lấy dữ liệu từ request body
            let { name, description } = req.body;
            const image = req.file;
    
            // Kiểm tra thông tin bắt buộc
            if (!name || !description) {
                return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin thương hiệu" });
            }
    
            let imageURL;
    
            // Xử lý hình ảnh nếu có
            if (image) {
                if (!Buffer.isBuffer(image.buffer)) {
                    return res.status(400).json({ message: "Dữ liệu hình ảnh không hợp lệ" });
                }
    
                const filename = `${uuidv4()}-${Date.now()}-${image.originalname}`;
                const file = bucket.file(`brands/${filename}`);
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
                        imageURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;
    
                        await saveBrand();
                    } catch (err) {
                        console.error('Lỗi khi lấy URL của hình ảnh:', err);
                        res.status(500).json({ error: 'Không thể lấy URL của hình ảnh' });
                    }
                });
    
                fileStream.end(image.buffer);
            } else {
                await saveBrand();
            }
    
            // Hàm lưu thương hiệu vào cơ sở dữ liệu
            async function saveBrand() {
                let data = { name, description, image: imageURL };
    
                // Lưu vào cơ sở dữ liệu
                const savedBrand = await modelBrand.create(data);
                res.status(201).json({ message: "Thương hiệu được tạo thành công", savedBrand });
            }
        } catch (error) {
            console.error('Lỗi khi thêm thương hiệu:', error);
            res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
        }
    },



}


brandController.upload = upload.single('image');

module.exports = brandController;
