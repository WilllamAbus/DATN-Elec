const mongoose = require("mongoose");
const { Schema } = mongoose;
const slugify = require("slugify");

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    id_user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    id_product: {
      type: Schema.Types.ObjectId,
      ref: "product_v2",
      required: true,
    },
    status: { type: String, default: "active" },
    likes: [{ type: Schema.Types.ObjectId, ref: "User"}],
    replies: {  type: Schema.Types.ObjectId,  ref: "repcomments" },
  },
  {
    timestamps: true,
  }
);

commentSchema.pre("save", function (next) {
  this.slug = slugify(this.content, { lower: true });
  next();
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = { Comment };
