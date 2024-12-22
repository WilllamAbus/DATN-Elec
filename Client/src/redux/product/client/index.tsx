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
  getAllProductVariantsByVariantPriceSlice,
  getPhoneByVariantsSlice,
  getLaptopByVariantsSlice,
  getAccessoryByVariantsSlice,
  getProductDetailAuctionSlice


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
  getAllProductVariantsByVariantPrice:getAllProductVariantsByVariantPriceSlice,
  getPhoneByVariants:getPhoneByVariantsSlice,
  getLaptopByVariants:getLaptopByVariantsSlice,
  getAccessoryByVarians:getAccessoryByVariantsSlice,
  getProductDetailAuction:getProductDetailAuctionSlice


});

export default productsReducer;
