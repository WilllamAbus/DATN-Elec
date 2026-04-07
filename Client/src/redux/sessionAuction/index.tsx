import { combineReducers } from "@reduxjs/toolkit";
import {
  getAuctionWinsByUserSlice,
  confirmAuctionSlice,
  canceledAuctionSlice,
  getUserPendingAuctionWinsSlice,
  confirmAuctionTemporarySlice

} from "./slice";
const auctionWinReducer = combineReducers({
  getAuctionWinsByUser: getAuctionWinsByUserSlice,
  confirmAuction:confirmAuctionSlice,
  canceledAuction:canceledAuctionSlice,
  getUserPendingAuctionWins:getUserPendingAuctionWinsSlice,
  confirmAuctionTemporary:confirmAuctionTemporarySlice

});

export default auctionWinReducer;
