import { combineReducers } from "@reduxjs/toolkit";
import {
  getAuctionWinsByUserSlice,
  confirmAuctionSlice

} from "./slice";
const auctionWinReducer = combineReducers({
  getAuctionWinsByUser: getAuctionWinsByUserSlice,
  confirmAuction:confirmAuctionSlice

});

export default auctionWinReducer;
