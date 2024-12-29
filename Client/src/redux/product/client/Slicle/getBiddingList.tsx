import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getBiddingListThunk, getAuctionWinnerThunk } from "../Thunk";
import {
  BiddingListResponse,
  Pagination,
  AuctionWinner,
} from "../../../../services/detailProductAuction/types/getBiddingList";

interface BiddingListState {
  productDetails: BiddingListResponse["data"]["productDetails"] | null;
  biddingList: BiddingListResponse["data"]["biddingList"] | null;
  pagination: Pagination | null;
  auctionWinner: AuctionWinner | null; // Thêm trạng thái cho người thắng
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}

const initialState: BiddingListState = {
  productDetails: null,
  biddingList: null,
  pagination: null,
  auctionWinner: null, // Khởi tạo trạng thái người thắng
  status: "idle",
  error: null,
  isLoading: false,
};

const getBiddingListSlice = createSlice({
  name: "auctionClient/getBiddingList/auctionWinner", // Đổi tên cho rõ ràng
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // **Bidding List**
      .addCase(getBiddingListThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getBiddingListThunk.fulfilled,
        (state, action: PayloadAction<BiddingListResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.productDetails = action.payload.data.productDetails;
          state.biddingList = action.payload.data.biddingList;
          state.pagination = action.payload.data.pagination || null;
          state.error = null;
        }
      )
      .addCase(getBiddingListThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || "Error fetching bidding list";
      })
      
      // **Auction Winner**
      .addCase(getAuctionWinnerThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getAuctionWinnerThunk.fulfilled,
        (state, action: PayloadAction<AuctionWinner>) => {
          state.status = "success";
          state.isLoading = false;
          state.auctionWinner = action.payload;
          state.error = null;
        }
      )
      .addCase(getAuctionWinnerThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.auctionWinner = null;
        state.error = action.payload || "Error fetching auction winner";
      });
  },
});

export default getBiddingListSlice.reducer;
