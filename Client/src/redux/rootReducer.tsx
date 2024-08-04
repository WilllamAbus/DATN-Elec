import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import categoriesSlice from "./categories/categoriesSlice";
import voucherReducer from "./discount/voucherSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  categories: categoriesSlice,
  voucher: voucherReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
