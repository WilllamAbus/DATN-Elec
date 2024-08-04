import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import categoriesSlice from "./categories/categoriesSlice";
import voucherReducer from "./discount/voucherSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { store } from "./store";

const rootReducer = combineReducers({
  auth: authReducer,
  categories: categoriesSlice,
  voucher: voucherReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default rootReducer;
