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
import auctionWinReducer from "./sessionAuction";
import postReducer from "./post";
import attributeReducer from "./attribute";
import getAttributesReducer from "./product/attributes";
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
import OrderListAuctionAdminReducer from "./orderAucAdmin/getAllOrder/orderAucAdminSlice";
import getDeletedOrderAucAdminReducer from "./orderAucAdmin/getDeletedAucAdmin/getDeletedSlice";
import statusShippingReducer from "./statusOrderUser/shippingStatusOrder/shiipingStatusSlice";
import orderAuctionReducer from "./orderAuction/orderAuctionSlice";
import allLIstOrderStatusReducer from "./statusOrderUser/allListOrderStatus/allListStatuSlice";
import statusComplteOrderStatusReducer from "./statusOrderUser/completOrderStatus/completeStatusSlice";
import statusReceiveOrderReducer from "./statusOrderUser/reciveOrderStatus/receiveStatuSlice";
import softDelOrderStatus from "./statusOrderUser/softDelByUser/softDellOrderSlice";
import orderPagiReducer from "./order/pagiOrder/pagislice";
import linkAccountReducer from "./linkAccount/Slice/linkAccount";
import adminTimeTrackReducer from "./adminTimeTrack/list/listTimeTrackSlice";
import adminTimeTrackDeletedReducer from "./adminTimeTrack/deleted/deletedTimeProdSlice";
import adminListPriceRandReducer from "./adminPriceRand/list/listPriceRandSlice";
import adminDeletedPriceRandReducer from "./adminPriceRand/deleted/deletedPriceRandSlice";
import pendingStatusOrderReducer from "./statusOrderUser/pendingStatus/pendingStatusSlice";
import confirmedStatusOrderReducer from "./statusOrderUser/confirmedStatus/confirmedStatusSlice";
import listBidReducer from "./listBiddings/listBidSlice";
import mailSoftDelOrderUserReducer from "./statusOrderUser/MailSoftOrder/mailSoftOrderSlicce";
import BankReducer from "./auth/bank/bankSlice";
import listBidActiveReducer from "./listBidActive/listBidActivveSlice";
import listRandAuctReducer from "./adminPriceRandAuc/listPriceRandAuct/listPriceRandSlice";
import listRandAuctDeletedReducer from "./adminPriceRandAuc/deletedPriceRandAuct/dletedPriceRandAuctSlice";
import checkAuctWinnerAllReducer from "./adminCheckAuct/adminCheckAucSlice";
import biddingDetailsSlice from "./listBiddings/listBidDetails";

import checkAuctEnableAllReducer from "./adminEnableAuct/enableAuctSlice";
const authConfig = {
  key: "auth",
  storage,
  whitelist: ["login"],
};
const linkAccountConfig = {
  key: "linkAccount",
  storage,
  whitelist: ["linkAccount"],
};
const rootReducer = combineReducers({
  auth: persistReducer(authConfig, authReducer),
  // authGoogle: persistReducer(authConfig, authGoogleReducer),
  // authGoogle: persistReducer(authConfig, authGoogleReducer),
  linkAccountUser: persistReducer(linkAccountConfig, linkAccountReducer),
  categories: categoriesSlice,
  watchlist: watchlistReducer,
  voucher: voucherReducer,
  checkout: checkoutSlice,
  products: productAdminReducer,
  post:postReducer,
  attribute:attributeReducer,
  productClient: productClientReducer,
  getAttributes: getAttributesReducer,
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
  orderAucAdmin: OrderListAuctionAdminReducer,
  getDeletedOrderAucAdmin: getDeletedOrderAucAdminReducer,
  statusShippingOrder: statusShippingReducer,
  allListOrderStatus: allLIstOrderStatusReducer,
  completStatusOrder: statusComplteOrderStatusReducer,
  receiveStatusOrder: statusReceiveOrderReducer,
  softDelOrderUser: softDelOrderStatus,
  orderPagi: orderPagiReducer,
  adminTimeTrack: adminTimeTrackReducer,
  adminDeletedTimeProd: adminTimeTrackDeletedReducer,
  adminListPriceRand: adminListPriceRandReducer,
  adminDeltedPriceRand: adminDeletedPriceRandReducer,
  pendingStatusOrder: pendingStatusOrderReducer,
  confirmedStatusOrder: confirmedStatusOrderReducer,
  listBid: listBidReducer,
  mailSoftDelOrderUser: mailSoftDelOrderUserReducer,
  Bank: BankReducer,
  listBidActive: listBidActiveReducer,
  listRandAuct: listRandAuctReducer,
  deletedPriceRand: listRandAuctDeletedReducer,
  auctionWin:auctionWinReducer,
  checkAuctWinnerAll: checkAuctWinnerAllReducer,
  listBidDetails: biddingDetailsSlice,
  enableAuct: checkAuctEnableAllReducer,
  // Add other reducers here to combine them with the persisted state.
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default rootReducer;
