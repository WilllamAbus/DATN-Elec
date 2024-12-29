import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAuctionWinsByUserThunk, clearAuctionWinById } from "../../thunk"; // Import hành động xóa state theo ID
import { AuctionWinsResponse, AuctionWin, Pagination } from "../../../../services/AuctionWinsByUser/types/getAuctionWinsByUser";

interface AuctionWinsState {
  auctionWins: AuctionWin[] | null;
  pagination: Pagination | null;
  status: "idle" | "loading" | "success" | "fail";
  error: { code: string; msg: string } | null;
  isLoading: boolean;
  total: number;
}

const initialState: AuctionWinsState = {
  auctionWins: null,
  pagination: null,
  status: "idle",
  error: null,
  isLoading: false,
  total: 0,
};

const getAuctionWinsByUserSlice = createSlice({
  name: "auctionClient/getAuctionWins",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAuctionWinsByUserThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getAuctionWinsByUserThunk.fulfilled,
        (state, action: PayloadAction<AuctionWinsResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.auctionWins = action.payload.data;
          state.pagination = action.payload.pagination;
          state.total = action.payload.total;
          state.error = null;
        }
      )
      .addCase(getAuctionWinsByUserThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || { code: "LOI_KHONG_XAC_DINH", msg: "Lỗi không xác định" };
      })
      .addCase(clearAuctionWinById, (state, action: PayloadAction<string>) => {
        state.auctionWins = state.auctionWins?.filter((win) => win._id !== action.payload) ?? null;
        state.total = state.total > 0 ? state.total - 1 : 0;
      });
  },
});

export default getAuctionWinsByUserSlice.reducer;
