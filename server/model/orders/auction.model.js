const { Schema, model } = require("mongoose");


const auctionSchema = Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'productAuction'},
    auction_winner: { type: String, default: 'A' }, // Tên của người chiến thắng
    auctionUser: { type: Schema.Types.ObjectId, ref: 'users' }, // Tên của người chiến thắng
    auction_total: { type: Number, default: 0 }, // Tổng giá trị đấu giá
    auction_quantity: { type: Number, default: 1 }, // Số lượng đấu giá
    // Khoảnh giá của phiên đấu giá
    auctionTime: { type: String , default:'5p'}, // Thời gian bắt đầu đấu giá
   
    auctionEndTime: {  type: Schema.Types.ObjectId, ref: 'timetrack'  }, // Thời gian kết thúc đấu giá // Thời gian thực hiện đấu giá
    biddings: [{type: Schema.Types.ObjectId, ref: 'bidding', required: true }], // Mảng các lượt đấu giá
    // Thời gian cập nhật phiên đấu giá
    modifieon: { type: Date, default: Date.now },
    stateAuction :{
      type:String,
      enum:[ 'Xử lý', 'Xác nhận'],
    },
    isActive: { type: Boolean, default: false },
    status: { type: String, default: "active" },
    disabledAt: { type: Date, default: null },
  },
  {
    collection: "auctions",
    timestamps: true,
  }
);

module.exports = model("auctions", auctionSchema);
