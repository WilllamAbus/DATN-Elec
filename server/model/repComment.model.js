const mongoose = require('mongoose');
const { Schema } = mongoose;
const slugify = require('slugify');

// Định nghĩa schema cho repComment
const repCommentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  slug: String,
  id_comment: {
    type: Schema.Types.ObjectId,
    // Tham chiếu đến model Comment hoặc tùy thuộc vào cách bạn định nghĩa comment
    ref: 'Comment',  // Thay 'Comment' nếu bạn dùng một model khác
    required: true,
  }
}, {
  timestamps: true, // Tự động thêm createdAt và updatedAt
});

// Tạo slug từ nội dung
repCommentSchema.pre('save', function(next) {
  if (this.isModified('content') || this.isNew) {
    this.slug = slugify(this.content, { lower: true });
  }
  next();
});

const Repcomment = mongoose.model('Repcomment', repCommentSchema);

module.exports = Repcomment;
