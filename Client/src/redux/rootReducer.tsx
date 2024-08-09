import { combineReducers } from "@reduxjs/toolkit";
import AuthSlice from "./auth/authSlice";
import categoriesSlice from "./categories/categoriesSlice";

import voucherReducer from "./discount/voucherSlice";
import { store } from "./store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import checkoutSlice from "./checkout/checkoutSlice";
const rootReducer = combineReducers({
  auth: AuthSlice,
  categories: categoriesSlice,
  voucher: voucherReducer,
  checkout: checkoutSlice,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default rootReducer;
