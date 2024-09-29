import { createAsyncThunk } from "@reduxjs/toolkit";
import { listPageAuction } from "../../../../services/product_v2/client";
import { LimitPageAuctionProductResponse, ProductCondition, ProductBrand } from "../types/listPageAuctionProduct";

export const listPageAuctionProductThunk = createAsyncThunk<
  LimitPageAuctionProductResponse,
  { 
    page: number; 
    _sort: string; 
    brand?: ProductBrand[];  
    conditionShopping?: ProductCondition[];
    minPrice?: number; 
    maxPrice?: number; 
    minDiscountPercent?: number;
    maxDiscountPercent?: number;
    limit?: number;
  },
  { rejectValue: string }
>(
  "productsClient/listPageAuction",
  async (
    { page, _sort, brand = [], conditionShopping = [], minPrice, maxPrice, minDiscountPercent, maxDiscountPercent, limit }, 
    { rejectWithValue }
  ) => {
    try {
      const response = await listPageAuction(
        page, 
        _sort, 
        brand, 
        conditionShopping, 
        minPrice, 
        maxPrice, 
        minDiscountPercent, 
        maxDiscountPercent,
        limit 
      );
      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.msg);
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi không xác định");
    }
  }
);
