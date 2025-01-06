import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAuctionProgressThunk } from "../Thunk"; 
import { GetAuctionProgressResponse, Bid, Pagination, ProductDetails } from "../../../../services/detailProductAuction/types/getAuctionProgress";

interface AuctionProgressState {
  productDetails: ProductDetails | null;
  biddingList: Bid[] | null;
  pagination: Pagination | null;
  status: "idle" | "loading" | "success" | "fail";
  error: { code: string; msg: string } | null;
  isLoading: boolean;
}

const initialState: AuctionProgressState = {
  productDetails: null,
  biddingList: null,
  pagination: null,
  status: "idle",
  error: null,
  isLoading: false,
};

const getAuctionProgressSlice = createSlice({
  name: "auctionClient/getAuctionProgress",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAuctionProgressThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getAuctionProgressThunk.fulfilled,
        (state, action: PayloadAction<GetAuctionProgressResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.productDetails = action.payload.data.productDetails;
          state.biddingList = action.payload.data.biddingList;
          state.pagination = action.payload.data.pagination;
          state.error = null;
        }
      )
      .addCase(getAuctionProgressThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || { code: "LOI_KHONG_XAC_DINH", msg: "Lỗi không xác định" };
      });
  },
});

export default getAuctionProgressSlice.reducer;
