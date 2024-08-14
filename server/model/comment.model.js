const mongoose = require('mongoose');
const { Schema } = mongoose;

// Định nghĩa schema cho comment
const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    rating:{
        type:Number,
        required: true,

    },
    id_user: {
        type: Schema.Types.ObjectId,
        ref: 'User',  // Tham chiếu đến bảng User
        required: true,
    },
    id_product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',  // Tham chiếu đến bảng Product
        required: true,
    },
}, {
    timestamps: true, // Tự động thêm createdAt và updatedAt
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
