import { combineReducers } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
// import categoriesSlice from "./categories/categoriesSlice";
import productsReducer from "./products/productsSlice";
import authSlice from "./auth/authSlice";
import { store } from "./store";
// import discountReducer from './discount/discountSlice'
const rootReducer = combineReducers({
  // categories: categoriesSlice,
  products: productsReducer,
  auth: authSlice,
  // discount:discountReducer
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default rootReducer;
