import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { checkAuctionTimeThunk } from "../Thunk";
import { CheckAuctionTimeResponse } from "../../../../services/detailProductAuction/types/checkAuctionTime";

interface CheckAuctionTimeState {
  auctionTimeData: CheckAuctionTimeResponse | null;
  status: "idle" | "loading" | "success" | "fail";
  error: { code: string; msg: string } | null;
  isLoading: boolean;
}

const initialState: CheckAuctionTimeState = {
  auctionTimeData: null,
  status: "idle",
  error: null,
  isLoading: false,
};

const checkAuctionTimeSlice = createSlice({
  name: "auctionClient/checkAuctionTime",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuctionTimeThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        checkAuctionTimeThunk.fulfilled,
        (state, action: PayloadAction<CheckAuctionTimeResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.auctionTimeData = action.payload;
          state.error = null;
        }
      )
      .addCase(checkAuctionTimeThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || { code: "LOI_KHONG_XAC_DINH", msg: "Lỗi không xác định" };
      });
  },
});

export default checkAuctionTimeSlice.reducer;
