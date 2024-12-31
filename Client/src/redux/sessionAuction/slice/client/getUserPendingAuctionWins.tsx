import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUserPendingAuctionWinsThunk } from "../../thunk";
import { AuctionWinResponse, AuctionWinner } from "../../../../services/AuctionWinsByUser/types/getUserPendingAuctionWin";

interface AuctionWinsState {
  auctionWins: AuctionWinner[] | null;
  status: "idle" | "loading" | "success" | "fail";
  error: { code: string; msg: string } | null;
  isLoading: boolean;
}

const initialState: AuctionWinsState = {
  auctionWins: null,
  status: "idle",
  error: null,
  isLoading: false,
};

const getUserPendingAuctionWinsSlice = createSlice({
  name: "auctionClient/getUserPendingAuctionWins",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserPendingAuctionWinsThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getUserPendingAuctionWinsThunk.fulfilled,
        (state, action: PayloadAction<AuctionWinResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.auctionWins = action.payload.data;
          state.error = null;
        }
      )
      .addCase(getUserPendingAuctionWinsThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || { code: "LOI_KHONG_XAC_DINH", msg: "Lỗi không xác định" };
      });
  },
});

export default getUserPendingAuctionWinsSlice.reducer;
