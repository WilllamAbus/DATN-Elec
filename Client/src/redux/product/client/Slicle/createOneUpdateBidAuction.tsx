import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createOneUpdateBidAuctionThunk } from "../Thunk";
import { UserBidPriceResponse } from "../../../../services/detailProductAuction/types/userBidPrice";

interface BidAuctionState {
  bidAuctionResponse: UserBidPriceResponse | null;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}

const initialState: BidAuctionState = {
  bidAuctionResponse: null,
  status: "idle",
  error: null,
  isLoading: false,
};

const createOneUpdateBidAuctionSlice = createSlice({
  name: "productClient/createOneUpdateBidAuction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOneUpdateBidAuctionThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createOneUpdateBidAuctionThunk.fulfilled,
        (state, action: PayloadAction<UserBidPriceResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.bidAuctionResponse = action.payload;
          state.error = null;
        }
      )
      .addCase(createOneUpdateBidAuctionThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        
        if (typeof action.payload === 'string') {
          state.error = action.payload;  // Gán thông báo lỗi
        } else {
          state.error = action.payload?.msg || "Lỗi khi cập nhật giá đấu giá"; 
        }
      });
      
  },
});

export default createOneUpdateBidAuctionSlice.reducer;
