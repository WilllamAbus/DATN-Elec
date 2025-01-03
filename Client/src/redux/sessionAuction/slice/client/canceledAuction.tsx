import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { canceledAuctionThunk } from "../../thunk";
import { AuctionCanceledResponse, AuctionWin, UserWarningInfo } from "../../../../services/AuctionWinsByUser/types/canceledAuction";

interface CanceledAuctionState {
  auctionWinner: AuctionWin | null;
  user: UserWarningInfo | null;
  status: "idle" | "loading" | "success" | "fail";
  error: { code: string; msg: string } | null;
  isLoading: boolean;
  auctions: AuctionWin[]; 
}

const initialState: CanceledAuctionState = {
  auctionWinner: null,
  user: null,
  status: "idle",
  error: null,
  isLoading: false,
  auctions: [], 
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
          state.auctionWinner = {
            ...action.payload.data.auctionWinner,
            status: "disabled", 
            confirmationStatus: "canceled",
            auctionStatus: "canceled",
          };
          state.user = action.payload.data.user;
          state.error = null;
          console.log('Updated Auctions State:', state.auctions);
          state.auctions = state.auctions.map((item: AuctionWin) =>
            item._id === action.payload.data.auctionWinner._id
              ? { ...item, confirmationStatus: "canceled", auctionStatus: "canceled", status: "disabled" }
              : item
          );
        }
        
      )
      .addCase(canceledAuctionThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || { code: "LOI_KHÔNG_XÁC_ĐỊNH", msg: "Lỗi không xác định" };
      });
  },
});

export default canceledAuctionSlice.reducer;
