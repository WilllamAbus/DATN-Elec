'use strict';
const modelProduct = require("../../model/product.model");
const modelCategory = require('../../model/catgories.model');
const Role = require('../../model/role.model');
const admin = require('firebase-admin');
const serviceAccount = require('../../config/serviceAccount.json');
const ProductService = require('../../services/product.service');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const dotenv = require("dotenv");
const modelUser = require("../../model/users.model");
const modelComment = require("../../model/comment.model");
const modelRepComment = require("../../model/repComment.model")
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


            const isAdmin = req.user.roles.some(role => role._id.toString() === adminRole._id.toString());

            if (!isAdmin) {
                return res.status(403).json({ message: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể thêm sản phẩm" });
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
            const products = await modelProduct.find({ status: { $ne: 'disable' } });
            res.status(200).json({
                success: true,
                msg: "Lấy danh sách sản phẩm thành công",
                data: products
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


    hardDelete: async (req, res) => {
        const { id } = req.params;
        try {
            const adminRole = await Role.findOne({ name: 'admin' });


            if (!adminRole) {
                return res.status(500).json({ message: "Không tìm thấy vai trò quản trị viên" });
            }


            const isAdmin = req.user.roles.some(role => role._id.toString() === adminRole._id.toString());

            if (!isAdmin) {
                return res.status(403).json({ message: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể xóa sản phẩm" });
            }

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
    update : async (req, res) => {
        try {
            const { id } = req.params;
            const { name, price, quantity, categoryId, createdAt, discount, brand, color, description, weight } = req.body;
            const image = req.file ? req.file : undefined;
    
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
                if (imageURL) updatedData.image = imageURL;
    
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
    search: async (req, res) => {
        try {
            const keyword = req.params.keyword;
            const result = await modelProduct.find({ name: { $regex: keyword, $options: 'i' } });
            if (result && result.length > 0) {
                res.status(200).json({
                    data: result
                });
            } else {
                console.error("No results found");
                res.status(404).json({
                    message: "No results found"
                });
            }
        } catch (error) {
            console.error('Error during search:', error);
            res.status(500).json({
                message: 'Internal Server Error',
                error: error.message
            });
        }
    },

    upView: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await modelProduct.findById(id);

            if (!product) {
                console.error('Product not found');
                return res.status(404).json({
                    message: 'Product not found'
                });
            }

            product.view = (product.view || 0) + 1;
            await product.save();

            res.status(200).json({
                message: 'View count incremented successfully',
                data: product
            });
        } catch (error) {
            console.error('Error during view count increment:', error);
            res.status(500).json({
                message: 'Internal Server Error',
                error: error.message
            });
        }
    },
    price: async (req, res) => {
        try {
            const price = req.params.price;
            let minPrice = 0; // Giá tối thiểu, mặc định là 0
            let maxPrice;

            switch (price) {
                case 'price-0':
                    maxPrice = 500000; // Dưới 500000
                    break;
                case 'price-1':
                    minPrice = 500000;
                    maxPrice = 1000000; // Từ 500000 đến dưới 2000000
                    break;
                case 'price-2':
                    minPrice = 1000000;
                    maxPrice = 3000000; // Từ 2000000 đến dưới 10000000
                    break;
                case 'price-3':
                    minPrice = 3000000;
                    maxPrice = 5000000; // Từ 10000000 đến dưới 14000000
                    break;
                case 'price-4':
                    minPrice = 5000000; // Trên 14000000
                    break;
                default:
                    return res.status(400).json({
                        message: "Khoảng giá không hợp lệ"
                    });
            }

            const query = { price: { $gte: minPrice } };
            if (maxPrice) {
                query.price.$lt = maxPrice;
            }

            const result = await modelProduct.find(query);

            if (result.length > 0) {
                res.status(200).json({
                    data: result
                });
            } else {
                console.error("Không tìm thấy sản phẩm nào trong khoảng giá này");
                res.status(404).json({
                    message: "Không tìm thấy sản phẩm nào trong khoảng giá này"
                });
            }
        } catch (error) {
            console.error('Lỗi khi tìm kiếm sản phẩm:', error);
            res.status(500).json({
                message: 'Lỗi máy chủ nội bộ',
                error: error.message
            });
        }

    },
    // Xóa mềm danh mục
    softDelete: async (req, res) => {
        try {
            const adminRole = await Role.findOne({ name: 'admin' });


            if (!adminRole) {
                return res.status(500).json({ message: "Không tìm thấy vai trò quản trị viên" });
            }


            const isAdmin = req.user.roles.some(role => role._id.toString() === adminRole._id.toString());

            if (!isAdmin) {
                return res.status(403).json({ message: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể xóa sản phẩm" });
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


            const isAdmin = req.user.roles.some(role => role._id.toString() === adminRole._id.toString());

            if (!isAdmin) {
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


            if (!adminRole) {
                return res.status(500).json({ message: "Không tìm thấy vai trò quản trị viên" });
            }


            const isAdmin = req.user.roles.some(role => role._id.toString() === adminRole._id.toString());

            if (!isAdmin) {
                return res.status(403).json({ message: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể khôi phục sản phẩm" });
            }


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
    getProductLimit: async (req, res) => {
        const { page } = req.query;

        try {
            console.log('Page:', page);

            const response = await ProductService.getProductLimitService(page);
            console.log('Response:', response); 

            if (response.err) {
                return res.status(400).json(response); 
            }

            const currentPage = page ? +page : 1;
            const totalPages = Math.ceil(response.response.total / (+process.env.LIMIT || 1));

            return res.status(200).json({
                ...response,
                pagination: {
                    currentPage,
                    totalPages,
                    hasNextPage: currentPage < totalPages,
                    hasPrevPage: currentPage > 1,
                }
            });

        } catch (error) {
            console.error('Error:', error); 
            return res.status(500).json({
                err: -1,
                msg: 'Failed at product controller: ' + error.message
            });
        }
    },
    userID: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await modelUser.findById(id);
            if (!product) {
                return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
            }

            res.status(200).json(product);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server" });
        }
    },
    comment: async (req, res) => {
        try {
            let { content, id_product, id_user, rating, createdAt } = req.body;

            if (!content || !id_product|| !id_user || !rating) {
                return res.status(400).json({ message: "Vui lòng nhập đủ thông tin" });
            }

            createdAt = createdAt ? new Date(createdAt) : new Date();

          
                await saveComment();

            async function saveComment() {
                let data = { content, id_product, id_user, rating, createdAt };

                // Save to database
                const savedProduct = await modelComment.create(data);
                res.status(201).json({ message: "Sản phẩm được tạo thành công", savedProduct });
            }
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
            res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
        }
    },
    commentProduct : async (req, res) => {
        try {
            const { id } = req.params; 
            const comments = await modelComment.find({ id_product: id })
            if (comments.length === 0) {
                return res.status(404).json({ message: "Không tìm thấy bình luận cho sản phẩm này" });
            }
            res.status(200).json(comments);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server" });
        }
    },
    deleteComment: async (req, res) => {
        try {
            const { id } = req.params;
            const comment = await modelComment.findById(id);
            
            if (!comment) {
                return res.status(404).json({ message: "Không tìm thấy bình luận cho sản phẩm này" });
            }
    
            await modelComment.findByIdAndDelete(id);
            res.status(200).json({ message: "Bình luận đã được xóa thành công" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server" });
        }
    },
    
    commentAllProduct :  async (req, res) => {
        try {
            const comments = await modelComment.find()
            if (comments.length === 0) {
                return res.status(404).json({ message: "Không tìm thấy bình luận cho sản phẩm này" });
            }
            res.status(200).json(comments);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server" });
        }
    },
    repComment: async (req, res) => {
        try {
            let { content, id_comment, createdAt } = req.body;
    
            // Kiểm tra xem các trường cần thiết có được gửi lên không
            if (!content || !id_comment) {
                return res.status(400).json({ message: "Vui lòng nhập đủ thông tin" });
            }
    
            // Nếu không có createdAt thì lấy thời gian hiện tại
            createdAt = createdAt ? new Date(createdAt) : new Date();
    
            // Gọi hàm lưu comment
            await saverepComment();
    
            async function saverepComment() {
                let data = { content, id_comment, createdAt };
    
                // Lưu vào cơ sở dữ liệu
                const savedComment = await modelRepComment.create(data);
                res.status(201).json({ message: "Phản hồi bình luận được tạo thành công", savedComment });
            }
        } catch (error) {
            console.error('Lỗi khi thêm phản hồi:', error);
            res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
        }
    },
    getRepComment : async (req, res) => {
        try {
            const { id } = req.params; 
            const comments = await modelRepComment.find({ id_comment: id })
            if (comments.length === 0) {
                return res.status(404).json({ message: "Không tìm thấy bình luận cho sản phẩm này" });
            }
            res.status(200).json(comments);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server" });
        }
    },
    




}


productsController.upload = upload.single('image');

module.exports = productsController;
