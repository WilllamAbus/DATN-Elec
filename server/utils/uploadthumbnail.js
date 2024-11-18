const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const dotenv = require("dotenv");
const serviceAccount = require('../config/serviceAccount.json');

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

const uploadImage = async (image) => {
    return new Promise((resolve, reject) => {
        console.log('Đang tải lên hình ảnh với thông tin sau:', {
            originalname: image.originalname,
            mimetype: image.mimetype,
            size: image.size,
            bufferLength: image.buffer ? image.buffer.length : 0,
        });

        if (!image || !Buffer.isBuffer(image.buffer)) {
            return reject(new Error("Dữ liệu hình ảnh không hợp lệ"));
        }

        const filename = `${uuidv4()}-${Date.now()}-${image.originalname}`;
        const file = bucket.file(`post/${filename}`);
        const fileStream = file.createWriteStream({
            metadata: {
                contentType: image.mimetype
            }
        });

        fileStream.on('error', (err) => {
            console.error('Lỗi khi tải lên Firebase Storage:', err);
            reject(new Error('Không thể tải lên hình ảnh'));
        });

        fileStream.on('finish', async () => {
            try {
                await file.makePublic();
                const imageURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;
                resolve(imageURL);
            } catch (err) {
                console.error('Lỗi khi lấy URL của hình ảnh:', err);
                reject(new Error('Không thể lấy URL của hình ảnh'));
            }
        });

        fileStream.end(image.buffer);
    });
};

module.exports = { uploadImage, upload };
