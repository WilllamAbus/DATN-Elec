import { combineReducers } from "@reduxjs/toolkit";
import {
  listPageSlice,
  getProductsByCategorySlice,
  listPageAuctionProductSlice,
  getAllBrandPageAuctionSlice,
  resetFilterAuctionProductSlice,
  getAllConditionShoppingSlice,
  getAllStorageSlice,
  getAllRamSlice,
  getProductDetailSlice,
  getAllStorageBySlugUrlSlice,
  getAllProductVariantsByVariantPriceSlice


} from "./Slicle";
const productsReducer = combineReducers({
  list: listPageSlice,
  getProductsByCategory: getProductsByCategorySlice,
  listPageAuctionProduct: listPageAuctionProductSlice,
  resetFilterAuctionProduct: resetFilterAuctionProductSlice,
  getAllBrandPageAuction: getAllBrandPageAuctionSlice,
  getAllConditionShoppingPageAuction: getAllConditionShoppingSlice,
  getAllRam: getAllRamSlice,
  getAllStorage:getAllStorageSlice,
  getProductDetail:getProductDetailSlice,
  getAllStorageBySlugUrl:getAllStorageBySlugUrlSlice,
  getAllProductVariantsByVariantPrice:getAllProductVariantsByVariantPriceSlice


});

export default productsReducer;
