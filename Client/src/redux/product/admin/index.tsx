import { combineReducers } from "@reduxjs/toolkit";
import {
  listSclice,
  softDeleteSlice,
  addSlice,
  getOneSlice,
  updateSlice,
  paginatedProductSlice,
  deletedProductSlice,
  addVariantSlice
} from "./Slicle";
const productsReducer = combineReducers({
  list: listSclice,
  softDelete: softDeleteSlice,
  add: addSlice,
  addVariant: addVariantSlice,
  getone: getOneSlice,
  update: updateSlice,
  pagilistActive: paginatedProductSlice,
  pagiDeletedList:deletedProductSlice
});

export default productsReducer;
