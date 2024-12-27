import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { confirmAuctionThunk } from "../../thunk";
import { ConfirmAuctionResponse, AuctionWinner, ItemAuction } from "../../../../services/AuctionWinsByUser/types/confirmAuction";

interface ConfirmAuctionState {
  auctionWinner: AuctionWinner | null;
  itemAuction: ItemAuction | null;
  status: "idle" | "loading" | "success" | "fail";
  error: { code: string; msg: string } | null;
  isLoading: boolean;
}

const initialState: ConfirmAuctionState = {
  auctionWinner: null,
  itemAuction: null,
  status: "idle",
  error: null,
  isLoading: false,
};

const confirmAuctionSlice = createSlice({
  name: "auctionClient/confirmAuction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(confirmAuctionThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        confirmAuctionThunk.fulfilled,
        (state, action: PayloadAction<ConfirmAuctionResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.auctionWinner = action.payload.auctionWinner;
          state.itemAuction = action.payload.itemAuction;
          state.error = null;
        }
      )
      .addCase(confirmAuctionThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || { code: "LOI_KHONG_XAC_DINH", msg: "Lỗi không xác định" };
      });
  },
});

export default confirmAuctionSlice.reducer;
