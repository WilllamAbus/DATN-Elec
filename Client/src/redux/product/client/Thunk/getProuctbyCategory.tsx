import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetProductsByCategoryResponse, ProductBrand, ProductCondition,RAM, STORAGE } from "../../../../services/clientcate/client/types/getProuctbyCategory";
import { getProductsByCategory } from "../../../../services/clientcate/client/navbar/getProductsByCategory";

export const getProductsByCategoryThunk = createAsyncThunk<
  GetProductsByCategoryResponse,
  {
    slug: string;
    page: number; 
    _sort: string; 
    brand?: ProductBrand[];  
    ram?: RAM[];  
    storage?:STORAGE[];
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
    { slug, page, _sort, brand = [], ram = [], conditionShopping = [],storage=[], minPrice, maxPrice, minDiscountPercent, maxDiscountPercent, limit },
    { rejectWithValue }
  ) => {
    try {
      const response = await getProductsByCategory(
        slug,
        page, 
        _sort, 
        brand, 
        conditionShopping, 
        ram,
        storage,
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
