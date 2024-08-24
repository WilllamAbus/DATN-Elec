const mongoose = require('mongoose');
const { Schema } = mongoose;
const slugify = require('slugify')
// Định nghĩa schema cho comment
const repCommentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    slug: String,
    rating:{
        type:Number,
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
repCommentSchema.pre('save', function(next){
    this.slug = slugify(this.content, {lower: true})
    next()
})
const Repcomment = mongoose.model('repComment', repCommentSchema);

module.exports = Repcomment;
