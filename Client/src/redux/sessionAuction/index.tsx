import { combineReducers } from "@reduxjs/toolkit";
import {
  getAuctionWinsByUserSlice,

} from "./slice";
const auctionWinReducer = combineReducers({
  getAuctionWinsByUser: getAuctionWinsByUserSlice,

});

export default auctionWinReducer;
