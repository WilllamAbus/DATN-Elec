import { combineReducers } from "@reduxjs/toolkit";
import { listPageSlice, getProductsByCategorySlice } from "./Slicle";
const productsReducer = combineReducers({
  list: listPageSlice,
  getProductsByCategory: getProductsByCategorySlice,
});

export default productsReducer;
