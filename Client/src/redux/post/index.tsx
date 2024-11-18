import { combineReducers } from "@reduxjs/toolkit";
import {
  addCategoryPostSlice,
  listCategoryPostSlice,
  softDeleteCategoryPostSlice,
  selectProductsSlice,
  addPostSlice,
  selectCategoryPostSlice,
  listPostSlice,
  getOnePostSlice,
  editPostSlice,
  softDeletePostSlice
} from "./slice";
const postReducer = combineReducers({
  addCategoryPost: addCategoryPostSlice,
  listCategoryPost:listCategoryPostSlice,
  softDeleteCategoryPost:softDeleteCategoryPostSlice,
  selectProduct:selectProductsSlice,
  addPost:addPostSlice,
  selectCategoryPost:selectCategoryPostSlice,
  listPost:listPostSlice,
  getOnePost:getOnePostSlice,
  editPost:editPostSlice,
  softDeletePost:softDeletePostSlice
});

export default postReducer;
