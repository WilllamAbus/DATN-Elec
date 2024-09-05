

import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./auth/authSlice";
import authGoogleReducer from "./auth/googleSlice";
import categoriesSlice from "./categories/categoriesSlice";
import voucherReducer from "./discount/voucherSlice";
import { store } from "./store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import checkoutSlice from "./checkout/checkoutSlice";
import productAdminReducer from "./product/admin";
import productClientReducer from "./product/client";
import listCateNavReducer from "./clientcate/client";
import watchlistReducer from "./product/wathList/wathlistSlice";
import cartRenducer from "./cart/cartSlice";
import countryRenducer from "./country/provinceSlice";
import VnpayRenducer from "./pay/vnpaySlice";
import orderRenducer from "./order/orderSlice";
const authConfig = {
  key: "auth",
  storage,
  whitelist: ["login"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authConfig, authReducer),
  authGoogle: persistReducer(authConfig, authGoogleReducer),
  categories: categoriesSlice,
  watchlist: watchlistReducer,
  voucher: voucherReducer,
  checkout: checkoutSlice,
  products: productAdminReducer,
  productClient: productClientReducer,
  cateClients: listCateNavReducer,
  cart: cartRenducer,
  country: countryRenducer,
  Vnpay: VnpayRenducer,
  order: orderRenducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default rootReducer;
