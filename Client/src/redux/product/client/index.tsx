import { combineReducers } from "@reduxjs/toolkit";
import { listPageSlice, getProductsByCategorySlice, listPageAuctionProductSlice } from "./Slicle";
const productsReducer = combineReducers({
  list: listPageSlice,
  getProductsByCategory: getProductsByCategorySlice,
  listPageAuctionProduct: listPageAuctionProductSlice,
});

export default productsReducer;
