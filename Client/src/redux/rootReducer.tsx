import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./auth/authSlice";
// import authGoogleReducer from "./auth/googleSlice";
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
import productByTimeTrackReducer from "./timeTrackProduct/timeTrackProdSlice";
import randBidPriceReducer from "./timeTrackProduct/randBidPrice/randBidPriceSlice";
import biddingReducer from "./bidding/biddingSlice";
import getRandBidReducer from "./timeTrackProduct/getRandBidV2/getRandBidSlice";
import serviceRefSlice from "./servicesRef/serviceRefSlice";
import auctionReducer from "./auctions/auctionSlice";
import deleteBidReducer from "./deleteBid/deleteBidSlice";
import auctCheckoutReducer from "./aucCheckout/auctCheckoutSlice";
import confirmReducer from "./confirmOrder/confirmOrderSlice";
import orderAuctionReducer from "./orderAuction/orderAuctionSlice";
import orderPagiReducer from "./order/pagiOrder/pagislice";
const authConfig = {
  key: "auth",
  storage,
  whitelist: ["login"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authConfig, authReducer),
  // authGoogle: persistReducer(authConfig, authGoogleReducer),
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
  productByTimeTrack: productByTimeTrackReducer,
  randBid: randBidPriceReducer,
  bidding: biddingReducer,
  randBidPrice: getRandBidReducer,
  serviceRef: serviceRefSlice,
  deleteBid: deleteBidReducer,
  auction: auctionReducer,
  auctCheckout: auctCheckoutReducer,
  orderAuction: orderAuctionReducer,
  confirmOrder: confirmReducer,
  orderPagi: orderPagiReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default rootReducer;
