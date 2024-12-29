import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { canceledAuctionThunk } from "../../thunk";
import { AuctionCanceledResponse, AuctionWinner, UserWarningInfo } from "../../../../services/AuctionWinsByUser/types/canceledAuction";

interface CanceledAuctionState {
  auctionWinner: AuctionWinner | null;
  user: UserWarningInfo | null;
  status: "idle" | "loading" | "success" | "fail";
  error: { code: string; msg: string } | null;
  isLoading: boolean;
}

const initialState: CanceledAuctionState = {
  auctionWinner: null,
  user: null,
  status: "idle",
  error: null,
  isLoading: false,
};

const canceledAuctionSlice = createSlice({
  name: "auctionClient/canceledAuction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(canceledAuctionThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        canceledAuctionThunk.fulfilled,
        (state, action: PayloadAction<AuctionCanceledResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.auctionWinner = action.payload.data.auctionWinner;
          state.user = action.payload.data.user;
          state.error = null;
        }
      )
      .addCase(canceledAuctionThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || { code: "LOI_KHONG_XAC_DINH", msg: "Lỗi không xác định" };
      });
  },
});

export default canceledAuctionSlice.reducer;
