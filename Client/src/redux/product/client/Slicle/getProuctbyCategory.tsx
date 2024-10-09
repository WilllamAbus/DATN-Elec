import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getProductsByCategoryThunk } from "../Thunk";
import { GetProductsByCategoryResponse, products, ProductBrand, ProductCondition, Pagination, RAM, STORAGE } from "../../../../services/clientcate/client/types/getProuctbyCategory";

interface ProductState {
  products: products[];
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  pagination: Pagination | null;
  isLoading: boolean;
  brand: ProductBrand[];
  ram: RAM[];
  storage: STORAGE[];
  conditionShopping: ProductCondition[];
  minPrice: number | null;
  maxPrice: number | null;
  minDiscountPercent: number | null;
  maxDiscountPercent: number | null;
  total: number | null;
  limit: number | null;
  category: string;
}


interface FulfilledAction extends PayloadAction<GetProductsByCategoryResponse> {
  meta: {
    arg: {
      slug: string;
      page: number;
      _sort: string;
      brand?: ProductBrand[];
      ram?: RAM[];
      storage?: STORAGE[];
      conditionShopping?: ProductCondition[];
      minPrice?: number;
      maxPrice?: number;
      minDiscountPercent?: number;
      maxDiscountPercent?: number;
      limit?: number;
      category?: string;
    };
  };
}


const initialState: ProductState = {
  products: [],
  status: "idle",
  error: null,
  pagination: null,
  isLoading: false,
  brand: [],
  ram: [],
  storage: [],
  conditionShopping: [],
  minPrice: null,
  maxPrice: null,
  minDiscountPercent: null,
  maxDiscountPercent: null,
  total: null,
  limit: 12,
  category: "", 
};

const getProductsByCategorySlice = createSlice({
  name: "productsClient/getProductsByCategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductsByCategoryThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(
        getProductsByCategoryThunk.fulfilled,
        (state, action: FulfilledAction) => {
          state.status = "success";
          state.isLoading = false;
          state.products = action.payload.data.products;
          state.pagination = action.payload.pagination;
          state.brand = action.payload.data.brand || [];
          state.ram = action.payload.data.ram || [];
          state.storage = action.payload.data.storage || [];
          state.conditionShopping = action.payload.data.conditionShopping || [];
          const { minPrice, maxPrice, minDiscountPercent, maxDiscountPercent, limit } = action.meta.arg || {
            minPrice: null,
            maxPrice: null,
            minDiscountPercent: null,
            maxDiscountPercent: null,
            limit: null,
          };
          state.minPrice = minPrice || null;
          state.maxPrice = maxPrice || null;
          state.minDiscountPercent = minDiscountPercent || null;
          state.maxDiscountPercent = maxDiscountPercent || null;
          state.total = action.payload.data.total || 0;
          state.category = action.payload.data.category || '';
          state.limit = limit || state.pagination?.limit || null;
        }
      )
      .addCase(getProductsByCategoryThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || "Lỗi không xác định";
      });
  },
});

export default getProductsByCategorySlice.reducer;
