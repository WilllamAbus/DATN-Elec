import { createSlice } from "@reduxjs/toolkit";
import { listPageAuctionProductThunk } from "../Thunk";
import {
  Pagination,
  products,
  ProductBrand,
  ProductCondition
} from "../types/listPageAuctionProduct";

interface AuctionProductState {
  _sort?: string;
  products: products[];
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  pagination: Pagination | null;
  isLoading: boolean;
  brand: ProductBrand[]; 
  conditionShopping: ProductCondition[];  
  minPrice: number | null; 
  maxPrice: number | null; 
  minDiscountPercent: number | null;
  maxDiscountPercent: number | null;
  total: number | null;
  limit: number | null;
}

const initialState: AuctionProductState = {
  products: [],
  status: "idle",
  error: null,
  pagination: null,
  isLoading: false,
  brand: [], 
  conditionShopping: [], 
  minPrice: null,
  maxPrice: null,
  minDiscountPercent: null,
  maxDiscountPercent: null,
  total:null,
  limit: 12,
};
const listPageAuctionProductSlice = createSlice({
  name: "productsClient/listPageAuction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listPageAuctionProductThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(
        listPageAuctionProductThunk.fulfilled,
        (state, action) => {
          state.status = "success";
          state.isLoading = false;
          state.products = action.payload.data.products;
              state.pagination = {
            ...state.pagination,
            ...action.payload.pagination, 
          };
          state.brand = action.payload.data.brand || [];
          state.conditionShopping = action.payload.data.conditionShopping || [];
          state.minPrice = action.meta?.arg.minPrice || null;
          state.maxPrice = action.meta?.arg.maxPrice || null;
          state.minDiscountPercent = action.meta?.arg.minDiscountPercent || null;
          state.maxDiscountPercent = action.meta?.arg.maxDiscountPercent || null;  
          state.total = action.payload.data.total || 0;    
          state.limit = action.meta?.arg.limit || state.pagination.limit || null;    
        }
      )
      .addCase(listPageAuctionProductThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.error.message || "Unknown error";
      });
  },
});

export default listPageAuctionProductSlice.reducer;
