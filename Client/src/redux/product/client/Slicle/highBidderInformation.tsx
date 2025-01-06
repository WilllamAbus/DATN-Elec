import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { highBidderInformationThunk } from "../Thunk";
import { HighBidderInformationResponse, AuctionData } from "../../../../services/detailProductAuction/types/highBidderInformation";

interface HighBidderInformationState {
  auctionData: AuctionData | null;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}

const initialState: HighBidderInformationState = {
  auctionData: null,
  status: "idle",
  error: null,
  isLoading: false,
};

const highBidderInformationSlice = createSlice({
  name: "auctionClient/highBidderInformation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(highBidderInformationThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        highBidderInformationThunk.fulfilled,
        (state, action: PayloadAction<HighBidderInformationResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.auctionData = action.payload.data;
          state.error = null;
        }
      )
      .addCase(highBidderInformationThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || "Lỗi khi lấy thông tin người trúng đấu giá";
      });
  },
});

export default highBidderInformationSlice.reducer;
