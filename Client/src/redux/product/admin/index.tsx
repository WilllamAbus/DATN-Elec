import { combineReducers } from "@reduxjs/toolkit";
import {
  listSclice,
  softDeleteSlice,
  addSlice,
  getOneSlice,
  updateSlice,
  paginatedProductSlice,
  deletedProductSlice,
  addVariantSlice,
  LimitProductAuctionSlice,
  softDeleteAuctionSlice,
  getOneAuctionSlice
} from "./Slicle";
const productsReducer = combineReducers({
  list: listSclice,
  softDelete: softDeleteSlice,
  softDeleteAuction: softDeleteAuctionSlice,
  add: addSlice,
  addVariant: addVariantSlice,
  getone: getOneSlice,
  update: updateSlice,
  pagilistActive: paginatedProductSlice,
  pagiDeletedList:deletedProductSlice,
  LimitProductAuction:LimitProductAuctionSlice,
  getOneAuction:getOneAuctionSlice
});

export default productsReducer;
