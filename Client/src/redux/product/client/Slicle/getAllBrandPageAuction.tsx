import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllBrandPageAuctionThunk } from "../Thunk";
import { GetAllBrandPageAuctionResponse, Brand } from "../types/getAllBrandPageAuction";

interface BrandState {
  brands: Brand[];
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}

const initialState: BrandState = {
  brands: [],
  status: "idle",
  error: null,
  isLoading: false,
};

const getAllBrandPageAuctionSlice = createSlice({
  name: "brandClient/getAllBrandPageAuction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllBrandPageAuctionThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(
        getAllBrandPageAuctionThunk.fulfilled,
        (state, action: PayloadAction<GetAllBrandPageAuctionResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.brands = action.payload.brands;
        }
      )
      .addCase(getAllBrandPageAuctionThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = (action.payload as string) || "Lỗi không xác định";
      });
  },
});

export default getAllBrandPageAuctionSlice.reducer;
