import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { enterAuctionPriceThunk } from "../Thunk/enterAuctionPrice";
import { EnterAuctionPriceResponse } from "../../../../services/detailProductAuction/types/enterAuctionPriceResponse";

interface EnterAuctionPriceState {
  enterAuctionPriceResponse: EnterAuctionPriceResponse | null;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}

const initialState: EnterAuctionPriceState = {
  enterAuctionPriceResponse: null,
  status: "idle",
  error: null,
  isLoading: false,
};

const enterAuctionPriceSlice = createSlice({
  name: "productClient/enterAuctionPrice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(enterAuctionPriceThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        enterAuctionPriceThunk.fulfilled,
        (state, action: PayloadAction<EnterAuctionPriceResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.enterAuctionPriceResponse = action.payload;
          state.error = null;
        }
      )
      .addCase(enterAuctionPriceThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        
        if (typeof action.payload === 'string') {
          state.error = action.payload;
        } else {
          state.error = action.payload?.msg || "Lỗi khi đặt giá đấu giá";
        }
      });
  },
});

export default enterAuctionPriceSlice.reducer;
