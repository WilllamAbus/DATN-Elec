const mongoose = require('mongoose');
const { Schema } = mongoose;
const slugify = require('slugify')
// Định nghĩa schema cho comment
const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    rating: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',  // Tham chiếu đến bảng User
        required: true,
    },
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'repComment'  // Tham chiếu đến bảng repComment
    }]
}, {
    timestamps: true,
});
commentSchema.pre('save', function(next){
    this.slug = slugify(this.content, {lower: true})
    next()
})
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
