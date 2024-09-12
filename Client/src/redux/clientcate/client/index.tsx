import { combineReducers } from "@reduxjs/toolkit";
import {
  listCateNavSlice,
} from "./Sclice";
const productsReducer = combineReducers({
  listCateNav: listCateNavSlice,

});

export default productsReducer;
