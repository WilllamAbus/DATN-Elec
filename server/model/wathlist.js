const mongoose = require("mongoose");
const { Schema } = mongoose;

const watchlistSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "product_v2",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "watchlists",
    timestamps: true,
  }
);

const Watchlist = mongoose.model("Watchlist", watchlistSchema);

module.exports = Watchlist;
