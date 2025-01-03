import { combineReducers } from "@reduxjs/toolkit";
import {
  getAuctionWinsByUserSlice,
  confirmAuctionSlice,
  canceledAuctionSlice,
  getUserPendingAuctionWinsSlice

} from "./slice";
const auctionWinReducer = combineReducers({
  getAuctionWinsByUser: getAuctionWinsByUserSlice,
  confirmAuction:confirmAuctionSlice,
  canceledAuction:canceledAuctionSlice,
  getUserPendingAuctionWins:getUserPendingAuctionWinsSlice

});

export default auctionWinReducer;
