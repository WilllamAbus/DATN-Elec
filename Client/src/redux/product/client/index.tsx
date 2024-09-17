import { combineReducers } from "@reduxjs/toolkit";
import {
  listPageSlice,
  getProductsByCategorySlice,
  listPageAuctionProductSlice,
  getAllBrandPageAuctionSlice,
  resetFilterAuctionProductSlice,
  getAllConditionShoppingSlice
} from "./Slicle";
const productsReducer = combineReducers({
  list: listPageSlice,
  getProductsByCategory: getProductsByCategorySlice,
  listPageAuctionProduct: listPageAuctionProductSlice,
  resetFilterAuctionProduct: resetFilterAuctionProductSlice,
  getAllBrandPageAuction: getAllBrandPageAuctionSlice,
  getAllConditionShoppingPageAuction: getAllConditionShoppingSlice
});

export default productsReducer;
