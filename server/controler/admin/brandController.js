'use strict';
const modelBrand = require('../../model/brands.model');
const modelCategory = require('../../model/catgories.model');
const modelSupplier = require('../../model/suppliers.model');
const admin = require('firebase-admin');
const serviceAccount = require('../../config/serviceAccount.json');
const multer = require('multer');
const dotenv = require("dotenv");
const { v4: uuidv4 } = require('uuid');
const Role = require('../../model/role.model');
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
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 5) || 5;
            const count = await modelBrand.countDocuments({
                status: { $ne: "disable" },
            });
            const totalPages = Math.ceil(count / limit);
            const brands = await modelBrand.find({ status: { $ne: 'disable' } })
                .populate('category_id', 'name')
                .populate('supplier_id', 'name')
                .skip((page - 1) * limit)
                .limit(limit);

            res.status(200).json({
                success: true,
                data: brands,
                totalPages: totalPages,
            });
        } catch (error) {
            console.error('Error fetching brands with categories:', error);
            res.status(500).json({ success: false, error: 'Server error' });
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
            let { name, description, category_id, supplier_id } = req.body;
            const image = req.file;

            // Kiểm tra thông tin bắt buộc
            if (!name || !description || !category_id || !supplier_id) {
                return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin thương hiệu" });
            }

            const existingBrand = await modelBrand.findOne({ name, supplier_id });
            if (existingBrand) {
                return res.status(400).json({ message: "Tên thương hiệu đã tồn tại cho nhà cung cấp này, vui lòng chọn tên khác" });
            }
            let imageURL;

            if (image) {
                if (!Buffer.isBuffer(image.buffer)) {
                    return res.status(400).json({ message: "Dữ liệu hình ảnh không hợp lệ" });
                }

                try {
                    const filename = `${uuidv4()}-${Date.now()}-${image.originalname}`;
                    const file = bucket.file(`brands/${filename}`);

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

            const data = { name, description, category_id, supplier_id, image: imageURL };
            const savedBrand = await modelBrand.create(data);
            res.status(201).json({ message: "Thương hiệu được tạo thành công", savedBrand });

        } catch (error) {
            console.error('Lỗi khi thêm thương hiệu:', error);
            res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
        }
    },
    getAllCategoriesController: async (req, res) => {
        try {

            const categories = await modelCategory.find({ status: { $ne: 'disable' } }).exec();

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

    getAllSuppliersController: async (req, res) => {
        try {

            const suppliers = await modelSupplier.find({ status: { $ne: 'disable' } }).exec();

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
            const brand = await modelBrand.findById(id);

            if (!brand) {
                return res.status(404).json({ message: "Không tìm thấy thương hiệu" });
            }

            res.status(200).json(brand);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server" });
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, category_id, supplier_id, description } = req.body;
            const image = req.file ? req.file : undefined;
    
            if (!name || !description || !category_id || !supplier_id) {
                return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin' });
            }
    
            // Kiểm tra trùng tên thương hiệu (trừ chính thương hiệu đang được cập nhật)
            const existingBrand = await modelBrand.findOne({
                name: name.trim(),
                _id: { $ne: id }, // Bỏ qua chính thương hiệu đang được cập nhật
            });
    
            if (existingBrand) {
                return res.status(400).json({ message: "Tên thương hiệu đã tồn tại, vui lòng chọn tên khác" });
            }
    
            let imageURL;
            if (image) {
                if (!Buffer.isBuffer(image.buffer)) {
                    return res.status(400).json({ message: "Dữ liệu hình ảnh không hợp lệ" });
                }
    
                const filename = `${uuidv4()}-${Date.now()}-${image.originalname}`;
                const file = bucket.file(`brands/${filename}`);
                const fileStream = file.createWriteStream({
                    metadata: { contentType: image.mimetype },
                });
    
                fileStream.on('error', err => {
                    console.error('Lỗi khi tải lên Firebase Storage:', err);
                    return res.status(500).json({ message: 'Không thể tải lên hình ảnh' });
                });
    
                fileStream.on('finish', async () => {
                    try {
                        await file.makePublic();
                        imageURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;
                        await updateBrandInDB();
                    } catch (err) {
                        console.error('Lỗi khi lấy URL của hình ảnh:', err);
                        return res.status(500).json({ message: 'Không thể lấy URL của hình ảnh' });
                    }
                });
    
                fileStream.end(image.buffer);
            } else {
                await updateBrandInDB();
            }
    
            async function updateBrandInDB() {
                const updatedData = { name, category_id, supplier_id, description };
                if (imageURL) updatedData.image = imageURL;
    
                const updatedBrand = await modelBrand.findByIdAndUpdate(id, updatedData, { new: true });
    
                if (!updatedBrand) {
                    return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
                }
    
                return res.status(200).json({ message: "Sản phẩm được cập nhật thành công", updatedBrand });
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật sản phẩm:', error);
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
                return res.status(403).json({ message: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể xóa thương hiệu" });
            }

            const hardDeletedBrand = await modelBrand.findByIdAndDelete(id);
            if (!hardDeletedBrand) {
                return res.status(404).json({ message: 'Không tìm thấy thương hiệu' });
            }
            res.status(200).json({ message: 'Thương hiệu đã được xóa thành công' });
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
                return res.status(403).json({ message: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể xóa thương hiệu" });
            }

            const id = req.params.id;
            // Cập nhật trạng thái của danh mục thành "Đã xóa"
            const softDeletedBrand = await modelBrand.findByIdAndUpdate(id, { status: 'disable' }, { new: true });

            if (!softDeletedBrand) {
                return res.status(404).json({ message: "Không tìm thấy thương hiệu" });
            }

            // Trả về phản hồi thành công
            res.status(200).json({ message: 'Đã xóa thành công', data: softDeletedBrand });
        } catch (error) {
            // Xử lý lỗi và trả về phản hồi lỗi server
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },
    restore: async (req, res) => {
        try {
            const adminRole = await Role.findOne({ name: 'admin' });


            if (!adminRole) {
                return res.status(500).json({ message: "Không tìm thấy vai trò quản trị viên" });
            }


            const isAdmin = req.user.roles.some(role => role._id.toString() === adminRole._id.toString());

            if (!isAdmin) {
                return res.status(403).json({ message: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể khôi phục thương hiệu " });
            }


            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Thiếu id thương hiệu" });
            }

            // Cập nhật trạng thái của sản phẩm thành 'active'
            const restoreBrand = await modelBrand.findByIdAndUpdate(id, { status: 'active' }, { new: true });

            if (!restoreBrand) {
                return res.status(404).json({ message: "Không tìm thấy thương hiệu" });
            }

            // Trả về phản hồi thành công
            res.status(200).json({ message: "Thương hiệu đã được khôi phục thành công", data: restoreBrand });
        } catch (error) {
            // Xử lý lỗi và trả về phản hồi lỗi server
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },
    deletedList: async (req, res) => {
        try {
            const page = parseInt(req.query.page, 10) || 1;  // Sử dụng hệ thập phân, mặc định là 1 nếu không có giá trị
            const limit = parseInt(req.query.limit, 5) || 5; // Sử dụng hệ thập phân, mặc định là 10 nếu không có giá trị

            const count = await modelBrand.countDocuments({
                status: "disable",
            });
            const totalPages = Math.ceil(count / limit);

            const deleteListBrand = await modelBrand.find({ status: 'disable' })
                .populate('category_id', 'name')
                .populate('supplier_id', 'name')
                .skip((page - 1) * limit)
                .limit(limit);
            res.status(200).json({
                success: true,
                data: deleteListBrand,
                totalPages: totalPages,
            });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
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
            const searchQuery = {
                name: { $regex: keyword, $options: "i" },
                status: "active",
            };

            // Get the total count for pagination purposes
            const totalResults = await modelBrand.countDocuments(searchQuery);

            // If no results, return a suitable message
            if (totalResults === 0) {
                return res.status(200).json({
                    message: "Không tìm thấy kết quả nào",
                    data: [],
                    totalResults: 0,
                });
            }

            // Execute the search query with pagination
            const result = await modelBrand
                .find(searchQuery)
                .populate('category_id', 'name')
                .populate('supplier_id', 'name')
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
            const totalResults = await modelBrand.countDocuments(searchQuery);

            // If no results, return a suitable message
            if (totalResults === 0) {
                return res.status(200).json({
                    message: "Không tìm thấy kết quả nào",
                    data: [],
                    totalResults: 0,
                });
            }

            // Execute the search query with pagination
            const result = await modelBrand
                .find(searchQuery)
                .populate('category_id', 'name')
                .populate('supplier_id', 'name')
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





}


brandController.upload = upload.single('image');

module.exports = brandController;
