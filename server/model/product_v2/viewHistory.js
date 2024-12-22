const { Schema, model } = require("mongoose");

const viewHistorySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  productVariant: { type: Schema.Types.ObjectId, ref: 'productVariant', required: false },
  productAuction: { type: Schema.Types.ObjectId, ref: 'productAuction', required: false },
  viewDuration: { type: Number}, 
  viewCount: { type: Number } ,
  lastViewed: { type: Date, default: Date.now },
}, {
  collection: "viewHistory", 
  timestamps: true 
});

module.exports = model("ViewHistory", viewHistorySchema);
