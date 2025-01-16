import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { confirmAuctionTemporaryThunk } from "../../thunk";
import { ConfirmAuctionTemporaryAuctionResponse, AuctionWinner, ItemAuction } from "../../../../services/AuctionWinsByUser/types/confirmAuctionTemporary";

interface ConfirmAuctionTemporaryState {
  auctionWinner: AuctionWinner | null;
  itemAuction: ItemAuction | null;
  status: "idle" | "loading" | "success" | "fail";
  error: { code: string; msg: string } | null;
  isLoading: boolean;
  auctions: AuctionWinner[];
}

const initialState: ConfirmAuctionTemporaryState = {
  auctionWinner: null,
  itemAuction: null,
  status: "idle",
  error: null,
  isLoading: false,
  auctions: [], 
};

const confirmAuctionTemporarySlice = createSlice({
  name: "auctionClient/confirmAuctionTemporary",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(confirmAuctionTemporaryThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        confirmAuctionTemporaryThunk.fulfilled,
        (state, action: PayloadAction<ConfirmAuctionTemporaryAuctionResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.auctionWinner = {
            ...action.payload.data.auctionWinner,
            confirmationStatus: "confirmed",
          };
          state.itemAuction = action.payload.data.itemAuction;
          state.error = null;

          // Kiểm tra nếu `auctions` tồn tại trước khi gọi `.map`
          if (state.auctions) {
            state.auctions = state.auctions.map((item: AuctionWinner) =>
              item.id === action.payload.data.auctionWinner.id
                ? { ...item, confirmationStatus: "confirmed" }
                : item
            );
          }
        }
      )
      .addCase(confirmAuctionTemporaryThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || { code: "LOI_KHONG_XAC_DINH", msg: "Lỗi không xác định" };
      });
  },
});

export default confirmAuctionTemporarySlice.reducer;
