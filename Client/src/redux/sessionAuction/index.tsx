import { combineReducers } from "@reduxjs/toolkit";
import {
  getAuctionWinsByUserSlice,
  confirmAuctionSlice,
  canceledAuctionSlice

} from "./slice";
const auctionWinReducer = combineReducers({
  getAuctionWinsByUser: getAuctionWinsByUserSlice,
  confirmAuction:confirmAuctionSlice,
  canceledAuction:canceledAuctionSlice

});

export default auctionWinReducer;
