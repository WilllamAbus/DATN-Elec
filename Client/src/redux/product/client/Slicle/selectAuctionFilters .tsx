import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../../redux/store";

export const selectAuctionProductState = (state: RootState) => state.productClient.listPageAuctionProduct;

export const selectAuctionFilters = createSelector(
  selectAuctionProductState,
  (auctionProductState) => ({
    brand: auctionProductState.brand,
    conditionShopping: auctionProductState.conditionShopping,
    minPrice: auctionProductState.minPrice,
    maxPrice: auctionProductState.maxPrice,
    minDiscountPercent: auctionProductState.minDiscountPercent,
    maxDiscountPercent: auctionProductState.maxDiscountPercent,
    limit: auctionProductState.limit,
  })
);
