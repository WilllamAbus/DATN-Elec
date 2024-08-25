const mongoose = require('mongoose');
const { Schema } = mongoose;
const slugify = require('slugify')
// Định nghĩa schema cho comment
const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
   slug: String,
    rating:{
        type:Number,
        required: true,

    },
    id_user: {
        type: Schema.Types.ObjectId,
        ref: 'users',  // Tham chiếu đến bảng User
        required: true,
    },
    id_product: {
        type: Schema.Types.ObjectId,
        ref: 'product_v2',  // Tham chiếu đến bảng Product
        required: true,
    },
    status: { type: String, default: 'active' },
    disabledAt: { type: Date, default: null },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set to the current date and time
      },
}, {
    timestamps: true, // Tự động thêm createdAt và updatedAt
});
commentSchema.pre('save', function(next){
    this.slug = slugify(this.content, {lower: true})
    next()
})
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
