import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getBiddingListThunk } from "../Thunk";
import {
  BiddingListResponse,
  Pagination,
  ProductDetails,
  BiddingItem,
} from "../../../../services/detailProductAuction/types/getBiddingList";

interface BiddingListState {
  productDetails: ProductDetails | null;
  biddingList: BiddingItem[] | null;
  pagination: Pagination | null;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
  isFetched: boolean;
}

const initialState: BiddingListState = {
  productDetails: null,
  biddingList: null,
  pagination: null,
  status: "idle",
  error: null,
  isLoading: false,
  isFetched: false,
};

const getBiddingListSlice = createSlice({
  name: "auctionClient/getBiddingList",
  initialState,
  reducers: {
    resetFetchStatus(state) {
      state.isFetched = false;
    },
    addNewBid(state, action: PayloadAction<BiddingItem>) {
      if (state.biddingList) {
        state.biddingList.unshift(action.payload); // Thêm bid mới vào đầu danh sách
      }
    },
  },
  extraReducers: (builder) => {
    builder
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
          state.isFetched = true;
          state.productDetails = action.payload.data.productDetails;
          state.biddingList = action.payload.data.biddingList;
          state.pagination = action.payload.data.pagination || null;
          state.error = null;
        }
      )
      .addCase(getBiddingListThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.isFetched = false;
        state.error = action.payload || "Error fetching bidding list";
      });
  },
});

export const { resetFetchStatus, addNewBid } = getBiddingListSlice.actions;
export default getBiddingListSlice.reducer;
