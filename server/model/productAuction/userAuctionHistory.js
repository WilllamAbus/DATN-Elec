const mongoose = require('mongoose');

const userAuctionHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  bids: [{
    auctionRound: { type: mongoose.Schema.Types.ObjectId, ref: 'AuctionRound', required: true }, 
    bidPrice: { type: Number, required: true }, 
    bidTime: { type: Date, default: Date.now }, 
  }],
  updatedAt: { type: Date, default: Date.now },
});

const UserAuctionHistory = mongoose.model('UserAuctionHistory', userAuctionHistorySchema);

module.exports = UserAuctionHistory;
