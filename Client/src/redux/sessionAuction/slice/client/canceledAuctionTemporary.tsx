import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { canceledAuctionTemporaryThunk } from "../../thunk";
import { CanceledAuctionTemporaryResponse, AuctionWinner, User } from "../../../../services/AuctionWinsByUser/types/canceledAuctionTemporary";

interface CanceledAuctionTemporaryState {
  auctionWinner: AuctionWinner | null;
  user: User | null;
  status: "idle" | "loading" | "success" | "fail";
  error: { code: string; msg: string } | null;
  isLoading: boolean;
  auctions: AuctionWinner[]; 
}

const initialState: CanceledAuctionTemporaryState = {
  auctionWinner: null,
  user: null,
  status: "idle",
  error: null,
  isLoading: false,
  auctions: [], 
};

const canceledAuctionTemporarySlice = createSlice({
  name: "auctionClient/canceledAuctionTemporary",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(canceledAuctionTemporaryThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        canceledAuctionTemporaryThunk.fulfilled,
        (state, action: PayloadAction<CanceledAuctionTemporaryResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.auctionWinner = {
            ...action.payload.data.auctionWinner,
            status: "disabled", 
            confirmationStatus: "canceled",
            auctionStatus: "canceled",
          };
          state.user = {
            ...action.payload.data.user,
            _id: action.payload.data.user.id,
            name: action.payload.data.auctionWinner.user.name,
            email: action.payload.data.auctionWinner.user.email
          };
          state.error = null;
          console.log('Updated Auctions State:', state.auctions);
          state.auctions = state.auctions.map((item: AuctionWinner) =>
            item.id === action.payload.data.auctionWinner.id
              ? { ...item, confirmationStatus: "canceled", auctionStatus: "canceled", status: "disabled" }
              : item
          );
        }
      )
      .addCase(canceledAuctionTemporaryThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || { code: "LOI_KHÔNG_XÁC_ĐỊNH", msg: "Lỗi không xác định" };
      });
  },
});

export default canceledAuctionTemporarySlice.reducer;
