import { combineReducers } from "@reduxjs/toolkit";
import {
  listSclice,
  softDeleteSlice,
  addSlice,
  getOneSlice,
  updateSlice,
  paginatedProductSlice,
} from "./Slicle";
const productsReducer = combineReducers({
  list: listSclice,
  softDelete: softDeleteSlice,
  add: addSlice,
  getone: getOneSlice,
  update: updateSlice,
  pagilistActive: paginatedProductSlice,
});

export default productsReducer;
