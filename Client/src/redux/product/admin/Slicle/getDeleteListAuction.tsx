import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getDeleteListAuctionThunk } from "../Thunk";
import { LimitDeleteListAuctionResponse, ProductAuction, Pagination } from "../../../../services/productAuction/types/getDeleteListAuction";

interface ProductState {
  productAuction: ProductAuction[]; 
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  pagination: Pagination | null;
  total: number | null;
}

const initialState: ProductState = {
  productAuction: [],
  status: "idle",
  error: null,
  pagination: null,
  total: null
  
};

const getDeleteListAuctionSlice = createSlice({
  name: "products/getDeleteListAuction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDeleteListAuctionThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getDeleteListAuctionThunk.fulfilled,
        (state, action: PayloadAction<LimitDeleteListAuctionResponse>) => {
          state.status = "success";
          state.productAuction = action.payload.data.productAuction;
          state.pagination = action.payload.pagination;
          state.total = action.payload.data.total;
        }
      )
      .addCase(getDeleteListAuctionThunk.rejected, (state, action) => {
        console.error("Error payload:", action.payload);
        state.status = "fail";
        state.error = typeof action.payload === 'string' ? action.payload : "Lỗi không xác định";
      });
  },
});

export default getDeleteListAuctionSlice.reducer;
