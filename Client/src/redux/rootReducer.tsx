// src/redux/rootReducer.ts

import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./auth/authSlice";
import authGoogleReducer from "./auth/googleSlice";
import categoriesSlice from "./categories/categoriesSlice";
import voucherReducer from "./discount/voucherSlice";

const authConfig = {
  key: "auth",
  storage,
  whitelist: ["login"],
};
const authConfigGoogle = {
  key: "authGoogle",
  storage,
  whitelist: ["login"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authConfig, authReducer),
  authGoogle: persistReducer(authConfigGoogle, authGoogleReducer),
  categories: categoriesSlice,
  voucher: voucherReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
