import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetProductsByCategoryResponse, ProductBrand, ProductCondition } from "../types/getProuctbyCategory";
import { getProductsByCategory } from "../../../../services/clientcate/client/navbar";

export const getProductsByCategoryThunk = createAsyncThunk<
  GetProductsByCategoryResponse,
  {
    slug: string;
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
  "productsClient/getProductsByCategory",
  async (
    { slug, page, _sort, brand = [], conditionShopping = [], minPrice, maxPrice, minDiscountPercent, maxDiscountPercent, limit },
    { rejectWithValue }
  ) => {
    try {
      const response = await getProductsByCategory(
        slug,
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
