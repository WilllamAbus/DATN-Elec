const mongoose = require('mongoose');
const { Schema } = mongoose;

// Định nghĩa schema cho comment
const repCommentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    id_comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comments',  // Tham chiếu đến bảng User
        required: true,
    }
   
}, {
    timestamps: true, // Tự động thêm createdAt và updatedAt
});

const Repcomment = mongoose.model('repComment', repCommentSchema);

module.exports = Repcomment;
