import { combineReducers } from "@reduxjs/toolkit";
// import categoriesSlice from "./categories/categoriesSlice";
import productsReducer from "./products/productsSlice";
// import discountReducer from './discount/discountSlice'
const rootReducer = combineReducers({
  // categories: categoriesSlice,
  products: productsReducer,
  // discount:discountReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
