import { combineReducers } from "@reduxjs/toolkit";
import categoriesSlice from "./categories/categoriesSlice";
import productsReducer from "./products/productsSlice";

const rootReducer = combineReducers({
  categories: categoriesSlice,
  products: productsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
